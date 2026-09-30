import { DEMO_ROLES } from "./roles";

const STORAGE_KEY = "demoRole";

const VALID = new Set(Object.values(DEMO_ROLES));

export function getStoredRole() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return VALID.has(v) ? v : null;
  } catch {
    return null;
  }
}

export function setStoredRole(role) {
  try {
    if (role && VALID.has(role)) {
      localStorage.setItem(STORAGE_KEY, role);
    }
  } catch {
    // ignore
  }
}

export function clearStoredRole() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
