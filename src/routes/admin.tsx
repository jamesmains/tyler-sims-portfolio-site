import { createFileRoute, redirect,  } from "@tanstack/react-router";

export const AdminComponent = () => {};


export const Route = createFileRoute("/admin")({
  
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/admin") {
      throw redirect({
        to: "/admin/dashboard",
        throw: true,
      });
    }
  },
});