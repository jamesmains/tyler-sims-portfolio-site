import { createFileRoute, redirect } from "@tanstack/react-router";
import { AdminProjectsList } from "../../components/admin/AdminProjectsList";
import { AdminBase } from "../../components/admin/AdminBase";
import { checkSessionStatus } from "../../api/projects";

export function AdminDashboard() {
  return(
    <>
    <AdminBase />
    <AdminProjectsList />
    </>
  )
}

export const Route = createFileRoute("/admin/dashboard")({
loader: async () => {
    const isSessionValid = await checkSessionStatus();
    if (!isSessionValid) {
      throw redirect({ to: "/admin/login", throw: true });
    }
    return null;
  },
  component: AdminDashboard,
});
