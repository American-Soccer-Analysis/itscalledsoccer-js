export const API_VERSION = "v1";
export const BASE_URL = `https://app.americansocceranalysis.com/api/${API_VERSION}/`;
export const MIN_FUSE_SCORE = 0.35;

export const LEAGUES = {
  NWSL: "nwsl",
  MLS: "mls",
  USLC: "uslc",
  USL1: "usl1",
  NASL: "nasl",
  MLSNP: "mlsnp",
} as const;

export type League = typeof LEAGUES[keyof typeof LEAGUES];

export const ENTITY_TYPES = {
  PLAYER: "player",
  MANAGER: "manager",
  STADIUM: "stadium",
  REFEREE: "referee",
  TEAM: "team",
} as const;
