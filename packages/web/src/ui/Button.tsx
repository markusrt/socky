import type { CSSProperties, ReactNode } from "react";
import { colors } from "../theme";

type Variant = "primary" | "secondary" | "ghost";

const base: CSSProperties = {
  fontSize: "1rem",
  padding: "0.75rem 1.25rem",
  borderRadius: 14,
  cursor: "pointer",
  border: "none",
  fontWeight: 600,
  lineHeight: 1.2,
};

const variants: Record<Variant, CSSProperties> = {
  /** Same as “Neue Socke starten” — main action / row confirm. */
  primary: {
    ...base,
    background: colors.berryRed,
    color: colors.softCream,
  },
  secondary: {
    ...base,
    background: colors.softCream,
    color: colors.berryRed,
    border: `2px solid ${colors.cozyPeach}`,
  },
  ghost: {
    ...base,
    background: "transparent",
    color: colors.berryRed,
    padding: "0.35rem 0",
    fontWeight: 500,
  },
};

export function Button({
  children,
  onClick,
  variant = "primary",
  fullWidth,
  large,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: Variant;
  fullWidth?: boolean;
  large?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        ...variants[variant],
        ...(fullWidth ? { width: "100%" } : null),
        ...(large ? { fontSize: "1.25rem", padding: "1.05rem 1.25rem" } : null),
      }}
    >
      {children}
    </button>
  );
}
