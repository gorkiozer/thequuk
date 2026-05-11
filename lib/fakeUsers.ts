export type FakeUser = {
  username: string;
  initial: string;
  /** Hex color for avatar background tint */
  color: string;
};

export const fakeUsers: FakeUser[] = [
  { username: "ayse.k",       initial: "A", color: "#E8A4B8" },
  { username: "mehmet_g",     initial: "M", color: "#7FB8D9" },
  { username: "elif.dem",     initial: "E", color: "#A088E0" },
  { username: "can_y",        initial: "C", color: "#F2C09A" },
  { username: "ayse.gul",     initial: "A", color: "#E8A488" },
  { username: "ahmet.k",      initial: "A", color: "#8FA5D9" },
  { username: "ece.sezgin",   initial: "E", color: "#A3D9B8" },
  { username: "mert.az",      initial: "M", color: "#D9C088" },
  { username: "naz.ozkan",    initial: "N", color: "#F2D08F" },
  { username: "deniz_b",      initial: "D", color: "#7FB8D9" },
  { username: "selin.a",      initial: "S", color: "#E8A4B8" },
  { username: "kerem.t",      initial: "K", color: "#C9A88F" },
  { username: "berke.y",      initial: "B", color: "#A088E0" },
  { username: "zeynep.n",     initial: "Z", color: "#E8A488" },
];

// Stable user-for-memory mapping so the same memory always shows the same author.
export function userForMemoryId(id: string): FakeUser {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return fakeUsers[hash % fakeUsers.length];
}
