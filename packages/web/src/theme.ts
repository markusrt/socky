export const colors = {
  berryRed: "#A61E3C",
  cozyPeach: "#F0A088",
  warmMustard: "#D4A017",
  woolyTeal: "#2F7F7F",
  softCream: "#FBF6EC",
  ink: "#5C1A2E",
} as const;

export type ColorName = keyof typeof colors;
