import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminSecretAtom } from "../state/auth";
import { useAtom } from "jotai";
import type { Project } from "../../types.ts";

const BASE_URL_API = import.meta.env.VITE_API_URL;

async function secureFetch(path: string, options: RequestInit = {}) {
  const response = await fetch(`${BASE_URL_API}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let errorBody = await response
      .json()
      .catch(() => ({ message: "Unknown error" }));
    throw new Error(
      errorBody.error ||
        errorBody.message ||
        `HTTP error! Status: ${response.status}`
    );
  }

  // Handle 204 No Content for successful ops like DELETE
  if (
    response.status === 204 ||
    response.headers.get("content-length") === "0"
  ) {
    return {};
  }
  return response.json();
}

export const fetchProjects = async (
  page = 1,
  limit = 10
): Promise<PaginatedProjects> => {
  return secureFetch(`/projects?page=${page}&limit=${limit}`, {
    method: "GET",
  });
};

export const fetchSingleProject = async (id: number): Promise<Project> => {  
  return secureFetch(`/project?id=${id}`, {
    method: "GET",
  });
};

export async function checkSessionStatus() {
  try {
    await secureFetch("/admin/status", {
      method: "GET",
    });
    return true; // Cookie is valid, session is active
  } catch (e) {
    return false; // Cookie is invalid or missing
  }
}

export async function adminLogin(secretKey: any) {
  return secureFetch("/admin/login", {
    method: "POST",
    headers: {
      // Only used once for initial login validation
      "x-admin-secret": secretKey,
    },
  });
}

export async function adminLogout() {
  return secureFetch("/admin/logout", {
    method: "POST",
  });
}

export interface PaginatedProjects {
  data: Project[];
  pagination: {
    page: number;
    totalPages: number;
    total: number;
  };
}

export const useProjectsQuery = (page: number, limit: number) => {
  return useQuery<PaginatedProjects>({
    queryKey: ["projects", page],
    queryFn: () => fetchProjects(page, limit),
  });
};

export const useProjectQuery = (id: number) =>{
  return useQuery<Project>({
    queryKey: ["projects", id],
    queryFn: () => fetchSingleProject(id),
  });
};

export const addProject = async (newProject: Project, authToken: string) => {
  return secureFetch("/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Secret": authToken,
    },
    body: JSON.stringify(newProject),
  });
};

export const updateProject = async (modifiedProject: Project, authToken: string) => {
  return secureFetch("/projects", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Secret": authToken,
    },
    body: JSON.stringify(modifiedProject),
  });
};

export const deleteProject = async (
  projectId: number
): Promise<{ message: string }> => {
  const response = await secureFetch(`/projects/${projectId}`, {
    method: "DELETE",
  });
  return response as { message: string };
};

export const useDeleteProjectMutation = () => {
  const queryClient = useQueryClient();
  const [adminSecret] = useAtom(adminSecretAtom);

  return useMutation({
    mutationFn: (projectId: number) => {
      if (!adminSecret) {
        // This check ensures we don't proceed if the user somehow lost the token
        throw new Error("Admin authentication token is missing.");
      }
      return deleteProject(projectId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useAddProjectMutation = () => {
  const queryClient = useQueryClient();
  const [adminSecret] = useAtom(adminSecretAtom);

  return useMutation({
    mutationFn: (newProject: Project) => {
      if (!adminSecret) {
        // This check ensures we don't proceed if the user somehow lost the token
        throw new Error("Admin authentication token is missing.");
      }
      // Call the worker function, passing the new project data and the required secret
      return addProject(newProject, adminSecret);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useModifyProjectMutation = () => {
  const queryClient = useQueryClient();
  const [adminSecret] = useAtom(adminSecretAtom);

  return useMutation({
    mutationFn: (modifiedProject: Project) => {
      if (!adminSecret) {
        // This check ensures we don't proceed if the user somehow lost the token
        throw new Error("Admin authentication token is missing.");
      }
      // Call the worker function, passing the new project data and the required secret
      return updateProject(modifiedProject, adminSecret);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};