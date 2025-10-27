import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { checkSessionStatus } from "./api/projects";
import { adminSecretAtom, isSessionCheckedAtom } from "./state/auth";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const setSecretKey = useSetAtom(adminSecretAtom);
  const setSessionChecked = useSetAtom(isSessionCheckedAtom);

  useEffect(() => {
    const hydrateSession = async () => {
      try {
        const response = await checkSessionStatus();
        if (response) {
          setSecretKey("session_restored");
        } else {
          setSecretKey(null);
        }
      } catch {
        setSecretKey(null);
      } finally {
        setSessionChecked(true);
      }
    };

    hydrateSession();
  }, []);

  return <>{children}</>;
}
