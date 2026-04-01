import { createContext, useContext } from "react";

interface ActiveTimeContextValue {
  activeTimeMs: number;
  isActive: boolean;
}

export const ActiveTimeContext = createContext<ActiveTimeContextValue>({
  activeTimeMs: 0,
  isActive: true,
});

export function useActiveTime() {
  return useContext(ActiveTimeContext);
}
