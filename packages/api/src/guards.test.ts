import { describe, expect, it } from "vitest";
import { hasRequiredRole } from "./guards";

describe("role guards", () => {
  it("treats missing role as KNITTER", () => {
    expect(hasRequiredRole({}, "KNITTER")).toBe(true);
    expect(hasRequiredRole({}, "ADMIN")).toBe(false);
    expect(hasRequiredRole({ role: null }, "ADMIN")).toBe(false);
  });

  it("lets KNITTER reach KNITTER but not ADMIN", () => {
    expect(hasRequiredRole({ role: "KNITTER" }, "KNITTER")).toBe(true);
    expect(hasRequiredRole({ role: "KNITTER" }, "ADMIN")).toBe(false);
  });

  it("lets ADMIN reach both", () => {
    expect(hasRequiredRole({ role: "ADMIN" }, "KNITTER")).toBe(true);
    expect(hasRequiredRole({ role: "ADMIN" }, "ADMIN")).toBe(true);
  });

  it("ignores unknown role strings", () => {
    expect(hasRequiredRole({ role: "SUPERUSER" }, "ADMIN")).toBe(false);
    expect(hasRequiredRole({ role: "admin" }, "ADMIN")).toBe(false);
  });
});
