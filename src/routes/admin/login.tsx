import { createFileRoute, redirect } from "@tanstack/react-router";
import { AdminLogin } from "../../components/admin/AdminLogin";
import { checkSessionStatus } from "../../api/projects";
import { useDocumentTitle } from '@mantine/hooks';

export const AdminLoginComponent = () => {
  useDocumentTitle("Admin Login")
    return(
        <AdminLogin/>
    )
    
};

export const Route = createFileRoute("/admin/login")({
loader: async () => {
    const isSessionValid = await checkSessionStatus();
    if (isSessionValid) {
      throw redirect({ to: "/admin/dashboard", throw: true });
    }
    return null;
  },
  component: AdminLoginComponent,
});