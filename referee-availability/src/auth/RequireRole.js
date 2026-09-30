import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { DEMO_ROLES, roleMatches } from "./roles";

/**
 * @param {string[]} allow - role ids that may access this route. Empty = any authenticated user.
 */
export function RequireRole({ allow = [], children }) {
  const { role, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const effectiveAllow =
    allow.length > 0 ? [...allow, DEMO_ROLES.ADMIN] : [];

  if (effectiveAllow.length > 0 && !roleMatches(role, effectiveAllow)) {
    return <Navigate to="/board/members/updates" replace />;
  }

  return children;
}
