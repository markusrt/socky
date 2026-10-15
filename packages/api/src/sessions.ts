import {
  createPairSession,
  finishActiveSock,
  getActualSize,
  type PairSession,
  REGIA_4_FAEDIG_PATTERN,
  type SessionStepProgress,
  switchToSock2,
  tickActiveSock,
  untickActiveSock,
} from "@socky/shared";
import { Hono } from "hono";
import { z } from "zod";
import type { Auth, SessionUser } from "./auth";
import type { Bindings } from "./env";
import type { AuthedEnv } from "./guards";
import { requireRole, requireUser } from "./guards";

const createBody = z.object({
  actualSizeId: z.string().min(1),
});

const patchBody = z.object({
  action: z.enum(["tick", "untick", "finishSock", "startSock2"]),
});

type SessionHeadRow = {
  id: string;
  user_id: string;
  pattern_id: string;
  chart_size_label: string;
  actual_size_label: string;
  status: PairSession["status"];
  active_sock: number;
  created_at: string;
  notes: string | null;
};

type StepRow = {
  session_id: string;
  sort_index: number;
  step_key: SessionStepProgress["stepKey"];
  title_key: string;
  technique_note_key: string | null;
  unit: SessionStepProgress["unit"];
  target_count: number;
  display_value: string | null;
  tip_round_index: number | null;
  tip_round_title: string | null;
  tip_row_label: string | null;
  tip_direction: "knit" | "decrease" | null;
  row_polarity: "knit" | "purl" | null;
  tip_rounds_json: string | null;
  sock1_done: number;
  sock2_done: number;
};

function mapStep(row: StepRow): SessionStepProgress {
  const step: SessionStepProgress = {
    stepKey: row.step_key,
    sortIndex: row.sort_index,
    titleKey: row.title_key,
    unit: row.unit,
    targetCount: row.target_count,
    sock1Done: row.sock1_done,
    sock2Done: row.sock2_done,
  };
  if (row.technique_note_key !== null) step.techniqueNoteKey = row.technique_note_key;
  if (row.display_value !== null) step.displayValue = row.display_value;
  if (row.tip_round_index !== null) step.tipRoundIndex = row.tip_round_index;
  if (row.tip_round_title !== null) step.tipRoundTitle = row.tip_round_title;
  if (row.tip_row_label !== null) step.tipRowLabel = row.tip_row_label;
  if (row.tip_direction !== null) step.tipDirection = row.tip_direction;
  if (row.row_polarity !== null) step.rowPolarity = row.row_polarity;
  if (row.tip_rounds_json !== null) {
    step.tipRounds = JSON.parse(row.tip_rounds_json) as NonNullable<
      SessionStepProgress["tipRounds"]
    >;
  }
  return step;
}

function mapSession(row: SessionHeadRow, steps: StepRow[]): PairSession {
  return {
    id: row.id,
    userId: row.user_id,
    patternId: row.pattern_id,
    chartSizeLabel: row.chart_size_label,
    actualSizeLabel: row.actual_size_label,
    status: row.status,
    activeSock: row.active_sock === 2 ? 2 : 1,
    createdAt: row.created_at,
    ...(row.notes !== null ? { notes: row.notes } : {}),
    steps: steps
      .slice()
      .sort((a, b) => a.sort_index - b.sort_index)
      .map(mapStep),
  };
}

async function loadSession(
  db: D1Database,
  id: string,
  userId: string
): Promise<PairSession | null> {
  const head = await db
    .prepare(
      `SELECT id, user_id, pattern_id, chart_size_label, actual_size_label, status, active_sock, created_at, notes
       FROM pair_sessions WHERE id = ? AND user_id = ?`
    )
    .bind(id, userId)
    .all<SessionHeadRow>();
  const row = head.results[0];
  if (!row) return null;

  const stepResult = await db
    .prepare(
      `SELECT session_id, sort_index, step_key, title_key, technique_note_key, unit, target_count,
              display_value, tip_round_index, tip_round_title, tip_row_label, tip_direction,
              row_polarity, tip_rounds_json, sock1_done, sock2_done
       FROM session_steps WHERE session_id = ? ORDER BY sort_index ASC`
    )
    .bind(id)
    .all<StepRow>();
  return mapSession(row, stepResult.results);
}

async function saveSession(db: D1Database, session: PairSession): Promise<void> {
  await db.batch([
    db
      .prepare(
        `UPDATE pair_sessions
         SET status = ?, active_sock = ?, notes = ?
         WHERE id = ? AND user_id = ?`
      )
      .bind(session.status, session.activeSock, session.notes ?? null, session.id, session.userId),
    ...session.steps.map((step) =>
      db
        .prepare(
          `UPDATE session_steps
           SET sock1_done = ?, sock2_done = ?
           WHERE session_id = ? AND sort_index = ?`
        )
        .bind(step.sock1Done, step.sock2Done, session.id, step.sortIndex)
    ),
  ]);
}

async function insertSession(db: D1Database, session: PairSession): Promise<void> {
  const statements: D1PreparedStatement[] = [
    db
      .prepare(
        `INSERT INTO pair_sessions
           (id, user_id, pattern_id, chart_size_label, actual_size_label, status, active_sock, created_at, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        session.id,
        session.userId,
        session.patternId,
        session.chartSizeLabel,
        session.actualSizeLabel,
        session.status,
        session.activeSock,
        session.createdAt,
        session.notes ?? null
      ),
  ];
  for (const step of session.steps) {
    statements.push(
      db
        .prepare(
          `INSERT INTO session_steps
             (session_id, sort_index, step_key, title_key, technique_note_key, unit, target_count,
              display_value, tip_round_index, tip_round_title, tip_row_label, tip_direction,
              row_polarity, tip_rounds_json, sock1_done, sock2_done)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          session.id,
          step.sortIndex,
          step.stepKey,
          step.titleKey,
          step.techniqueNoteKey ?? null,
          step.unit,
          step.targetCount,
          step.displayValue ?? null,
          step.tipRoundIndex ?? null,
          step.tipRoundTitle ?? null,
          step.tipRowLabel ?? null,
          step.tipDirection ?? null,
          step.rowPolarity ?? null,
          step.tipRounds ? JSON.stringify(step.tipRounds) : null,
          step.sock1Done,
          step.sock2Done
        )
    );
  }
  await db.batch(statements);
}

/** Auth resolver used by session routes (session cookie via Better Auth). */
async function resolveUser(auth: Auth, request: Request): Promise<SessionUser | null> {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return null;
    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: (session.user as { role?: string | null }).role ?? "KNITTER",
    };
  } catch {
    // Missing tables / bad secret → treat as unauthenticated (guards fail closed).
    return null;
  }
}

export function sessionRoutes(getAuth: (env: Bindings) => Auth) {
  const app = new Hono<AuthedEnv>();

  const withUser = requireUser(async (c) => resolveUser(getAuth(c.env), c.req.raw));

  app.use("*", withUser);

  /** Own sessions only (Constitution §8). */
  app.get("/", async (c) => {
    const user = c.get("user");
    const listed = await c.env.DB.prepare(
      `SELECT id, user_id, pattern_id, chart_size_label, actual_size_label, status, active_sock, created_at, notes
       FROM pair_sessions WHERE user_id = ? ORDER BY created_at DESC`
    )
      .bind(user.id)
      .all<SessionHeadRow>();

    const sessions: PairSession[] = [];
    for (const row of listed.results) {
      const full = await loadSession(c.env.DB, row.id, user.id);
      if (full) sessions.push(full);
    }
    return c.json({ sessions });
  });

  app.get("/:id", async (c) => {
    const user = c.get("user");
    const session = await loadSession(c.env.DB, c.req.param("id"), user.id);
    if (!session) return c.json({ error: "not_found" }, 404);
    return c.json({ session });
  });

  app.post("/", async (c) => {
    const user = c.get("user");
    const parsed = createBody.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) {
      return c.json({ error: "invalid_body", issues: parsed.error.issues }, 400);
    }
    const actual = getActualSize(parsed.data.actualSizeId);
    if (!actual) {
      return c.json({ error: "unknown_actual_size" }, 404);
    }
    const session = createPairSession({
      userId: user.id,
      pattern: REGIA_4_FAEDIG_PATTERN,
      actualSize: actual,
    });
    await insertSession(c.env.DB, session);
    return c.json({ session }, 201);
  });

  /** Tick / undo / finish — one tap = one row (Constitution §9). */
  app.post("/:id/actions", async (c) => {
    const user = c.get("user");
    const parsed = patchBody.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) {
      return c.json({ error: "invalid_body", issues: parsed.error.issues }, 400);
    }
    const existing = await loadSession(c.env.DB, c.req.param("id"), user.id);
    if (!existing) return c.json({ error: "not_found" }, 404);

    const next =
      parsed.data.action === "tick"
        ? tickActiveSock(existing)
        : parsed.data.action === "untick"
          ? untickActiveSock(existing)
          : parsed.data.action === "finishSock"
            ? finishActiveSock(existing)
            : switchToSock2(existing);
    await saveSession(c.env.DB, next);
    return c.json({ session: next });
  });

  return app;
}

/** Admin-only: list actual sizes from D1 (seeded from JSON in `packages/shared/data`). */
export function adminSizeRoutes(getAuth: (env: Bindings) => Auth) {
  const app = new Hono<AuthedEnv>();
  const withUser = requireUser(async (c) => resolveUser(getAuth(c.env), c.req.raw));
  app.use("*", withUser, requireRole("ADMIN"));

  app.get("/actual-sizes", async (c) => {
    const result = await c.env.DB.prepare(
      `SELECT id, pattern_id, label, chart_size_label, counts_json, tip_rounds_json, construction_json, tags_json, notes, updated_at
       FROM actual_sizes ORDER BY label ASC`
    ).all();
    return c.json({ actualSizes: result.results });
  });

  return app;
}
