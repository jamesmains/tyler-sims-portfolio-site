import { adminSecretAtom } from "../../state/auth";
import { useSetAtom } from "jotai";
import { adminLogout } from "../../api/projects";
import { useRouter } from "@tanstack/react-router";
import { AdminActionsMenu } from "./AdminActionsMenu";
import { Group } from "@mantine/core";

export function AdminBase() {
  const setSecretKey = useSetAtom(adminSecretAtom);

  const router = useRouter();

  const handleLogout = async () => {
    try {
      // 1. Tell the backend to clean up the session (database and cookie)
      await adminLogout();

      // 2. CRITICAL: Clear the local Jotai state
      // This immediately sets isAdminLoggedInAtom to false and triggers a UI update.
      setSecretKey(null);

      // Logged out, navigate to login
      await router.navigate({
        to: "/admin/login",
      });
    } catch (error) {
      console.error("Logout failed:", error);
      // Even on failure, we often clear local state to prevent a broken session
      setSecretKey(null);
    }
  };

  return (
    <Group px="lg">
      <p className="text-2xl font-bold">Admin Control</p>
      <div style={{ marginLeft: "auto" }}>
        <AdminActionsMenu logout={handleLogout} />
      </div>
    </Group>
  );
}
