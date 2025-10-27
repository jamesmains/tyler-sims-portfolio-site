import { createFileRoute } from "@tanstack/react-router";
import { fetchSingleProject } from "../../api/projects";
import type { Project } from "../../../types";
import { ProjectDetails } from "../../components/projects/ProjectDetails";

function ProjectPage(){
      const project = Route.useLoaderData() as Project;
      return (
        <><ProjectDetails project={project}/></>);
}

export const Route = createFileRoute("/projects/$projectId")({
    // Loader handles both editing existing projects and creating new ones
      loader: async ({ params }) => {
        const { projectId } = params;
        // Otherwise fetch from your backend
        const project = await fetchSingleProject(parseInt(projectId));
        if (!project) throw new Error("Project not found");
        return project;
      },
      // Render component using loader data
      component: ProjectPage,
})