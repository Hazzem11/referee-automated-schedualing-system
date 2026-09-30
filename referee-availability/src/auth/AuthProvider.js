import React, { useCallback, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import { clearStoredRole, getStoredRole, setStoredRole } from "./authStore";

export function AuthProvider({ children }) {
  const [role, setRoleState] = useState(() => getStoredRole());

  const setRole = useCallback((next) => {
    setRoleState(next);
    if (next) {
      setStoredRole(next);
    } else {
      clearStoredRole();
    }
  }, []);

  const logout = useCallback(() => {
    clearStoredRole();
    setRoleState(null);
  }, []);

  const value = useMemo(
    () => ({
      role,
      setRole,
      logout,
      isAuthenticated: Boolean(role),
    }),
    [role, setRole, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
