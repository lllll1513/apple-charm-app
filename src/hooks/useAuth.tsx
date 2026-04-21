import { createContext, useContext, useState, ReactNode, useMemo } from "react";
import { AppRole, defaultMatrix, Resource, Action, Matrix } from "@/data/rbac";
import { members, getMember } from "@/data/mock";

interface AuthCtx {
  userId: string;
  role: AppRole;
  setRole: (r: AppRole) => void;
  matrix: Matrix;
  setMatrix: (m: Matrix) => void;
  can: (resource: Resource, action?: Action) => boolean;
  user: ReturnType<typeof getMember>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // 默认以管理员视角进入,方便用户体验全部模块
  const [role, setRole] = useState<AppRole>("admin");
  const [userId] = useState("u1");
  const [matrix, setMatrix] = useState<Matrix>(defaultMatrix);

  const value = useMemo<AuthCtx>(() => ({
    userId,
    role,
    setRole,
    matrix,
    setMatrix,
    user: getMember(userId),
    can: (resource, action = "view") => {
      const allowed = matrix[role]?.[resource];
      return !!allowed?.includes(action);
    },
  }), [role, userId, matrix]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
};
