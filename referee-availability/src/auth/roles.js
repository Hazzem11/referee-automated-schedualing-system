/** Demo role ids persisted in localStorage (no real auth). */
export const DEMO_ROLES = {
  ADMIN: "ADMIN",
  GAME_ASSIGNER: "GAME_ASSIGNER",
  REFEREE_COACH: "REFEREE_COACH",
  REFEREE: "REFEREE",
};

export const ROLE_LABELS = {
  [DEMO_ROLES.ADMIN]: "Admin",
  [DEMO_ROLES.GAME_ASSIGNER]: "Game assigner",
  [DEMO_ROLES.REFEREE_COACH]: "Referee coach",
  [DEMO_ROLES.REFEREE]: "Referee",
};

/** True if current role is included in allowed list (or allowed is empty = any authenticated). */
export function roleMatches(role, allowed) {
  if (!role) return false;
  if (!allowed || allowed.length === 0) return true;
  return allowed.includes(role);
}

/** Admin can access everything in the demo policy layer. */
export function isAdmin(role) {
  return role === DEMO_ROLES.ADMIN;
}
