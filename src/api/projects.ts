import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminSecretAtom } from "../state/auth";
import { useAtom } from "jotai";
import type { Project } from "../../types.ts";
import type { FilterValues } from "../components/SearchFilters.tsx";

const BASE_URL_API = import.meta.env.VITE_API_URL;

const cleanFilters = (filters: FilterValues) => {
  return Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => 
      // Keep booleans (true/false)
      (typeof value === 'boolean') || 
      // Keep strings with content
      (typeof value === 'string' && value.length > 0) ||
      // Keep arrays with content
      (Array.isArray(value) && value.length > 0)
    )
  );
};

async function secureFetch(path: string, options: RequestInit = {}) {
  console.log(`${BASE_URL_API}${path}`);
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

export function useProjectsQuery(page: number, limit: number, filters: FilterValues) {
    // 1. Convert the filters object into a stable string
    // This ensures the query key only changes when the content changes, not the object reference.
    const stableFilterString = JSON.stringify(filters); 
    return useQuery({
        // 2. The queryKey now uses the stable string
        queryKey: ['projects', page, limit, stableFilterString], 
        
        queryFn: async () => {
            // Your API URL construction logic (already correctly uses filters)
            const filterParams = new URLSearchParams(filters as Record<string, string>).toString().replaceAll("undefined","");
            const response = await fetch(`/api/projects?page=${page}&limit=${limit}&${filterParams}`);
            
            // 3. Optional: Add a check to minimize redundant logging/fetches in dev mode
            // TanStack Query handles the deduplication, but this helps the console log
            if (response.status !== 200) {
                 throw new Error("Failed to fetch projects");
            }

            return response.json();
        },
        // 4. Set a short staleTime/gcTime to allow faster cleanup if needed
        // staleTime: 1000 * 60, // e.g., 1 minute
        // gcTime: 1000 * 60 * 5, // e.g., 5 minutes
    });
}

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