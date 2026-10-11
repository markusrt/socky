/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "shared-no-outer",
      severity: "error",
      comment: "packages/shared must not depend on api or web (no I/O in domain).",
      from: { path: "^packages/shared" },
      to: { path: "^packages/(api|web)" },
    },
    {
      name: "api-no-web",
      severity: "error",
      comment: "packages/api must not import the web app.",
      from: { path: "^packages/api" },
      to: { path: "^packages/web" },
    },
    {
      name: "no-circular",
      severity: "error",
      from: {},
      to: { circular: true },
    },
    {
      name: "no-tests-from-src",
      severity: "warn",
      comment: "Production code should not import test files.",
      from: { path: "^packages/(shared|api|web)/src" },
      to: { path: "\\.(test|spec)\\.(ts|tsx)$" },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: "tsconfig.base.json" },
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "node", "default", "types"],
    },
  },
};
