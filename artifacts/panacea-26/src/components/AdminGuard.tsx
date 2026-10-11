import {
  type ReactNode,
} from "react";

import {
  Redirect,
} from "wouter";

import {
  useAuth,
} from "@/context/AuthContext";

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({
  children,
}: AdminGuardProps) {
  const {
    user,
    loading,
  } = useAuth();

  if (loading) {
    return (
      <main
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="mono"
          style={{
            fontSize: 12,
            letterSpacing: "0.08em",
          }}
        >
          VERIFYING ACCESS...
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <Redirect to="/login" />
    );
  }

  const isAdmin =
    Array.isArray(user.roles) &&
    user.roles.some(
      (role: string) =>
        role === "ROLE_ADMIN" ||
        role === "ADMIN"
    );

  if (!isAdmin) {
    return (
      <Redirect to="/profile" />
    );
  }

  return <>{children}</>;
}