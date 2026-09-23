// Design tokens for the Onco Sahayak UI. Mirrors tailwind.config.js so values can be
// used from style props where a className is not practical (gradients, svg, icons).
export const colors = {
  primary: "#0E7C5A",      // deep teal-green used for CTAs and active nav
  primaryBright: "#19A974",
  primarySoft: "#E9F8F1",
  navy: "#0F2C52",         // "Care" in the wordmark, headings
  dark: "#12283F",
  pink: "#D94F7B",         // ribbon + emotional-support accents
  pinkSoft: "#FCECEF",
  lavender: "#F0ECFF",
  violet: "#7C5CE6",
  sky: "#E8F1FD",
  blue: "#2F73E0",
  amber: "#F59E0B",
  amberSoft: "#FEF3E2",
  slate400: "#94A3B8",
  slate500: "#64748B",
  slate100: "#F1F5F9",
  border: "#E7EDF3",
  bg: "#F6F9FB",
};

/** Soft top-to-bottom wash used behind most screens. */
export const screenWash = ["#F2FAF6", "#F7FAFD", "#FFFFFF"] as const;

/**
 * The top edge of `login-hero.png`, sampled from the artwork itself: a cool
 * blue-white that is near-uniform across the crop (#F8FCFF at the left edge to
 * #F4F9FC at the right). The login wash ends on this exact value so the page
 * background flows into the illustration with no visible seam.
 */
export const loginHeroTop = "#F5FAFD";

/**
 * Login wash: starts on the same soft green as the other screens and cools into
 * the illustration's own blue-green, rather than ending on white.
 */
export const loginWash = ["#F0F9F4", "#F2F9F9", loginHeroTop] as const;

/** Pastel tile palette for the AI-support category grid (image 1). */
export const tilePalettes = {
  rose: { bg: "#FDECEF", fg: "#E4457A" },
  green: { bg: "#E6F7EF", fg: "#0E7C5A" },
  violet: { bg: "#EFEBFE", fg: "#7C5CE6" },
  sky: { bg: "#E6F1FD", fg: "#2F73E0" },
  amber: { bg: "#FEF3E2", fg: "#E9922B" },
  mint: { bg: "#E6F7F1", fg: "#12A87A" },
} as const;

export type TileTone = keyof typeof tilePalettes;
