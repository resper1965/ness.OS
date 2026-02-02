'use client';

import { createContext, useContext, type ReactNode } from 'react';

const RoleContext = createContext<string | null>(null);

export function RoleProvider({ role, children }: { role: string | null; children: ReactNode }) {
  return <RoleContext.Provider value={role}>{children}</RoleContext.Provider>;
}

export function useRole() {
  return useContext(RoleContext);
}
