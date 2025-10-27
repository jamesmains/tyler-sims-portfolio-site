import { createFileRoute, redirect } from '@tanstack/react-router'
import type { Project } from '../../../../types';
import { ProjectForm } from '../../../components/admin/ProjectForm';
import { AdminBase } from '../../../components/admin/AdminBase';
import { checkSessionStatus, fetchSingleProject } from '../../../api/projects';
import { Space } from '@mantine/core';

function EditProjectPage() {
  const project = Route.useLoaderData() as Project;
  return (
    <><AdminBase /><ProjectForm project={project} /><Space h="xs" /></>);
}

export const Route = createFileRoute("/admin/manage/$projectId")({
  // Loader handles both editing existing projects and creating new ones
  loader: async ( { params }) => {

    const isSessionValid = await checkSessionStatus();
    const { projectId } = params;
    if (!isSessionValid) {
      throw redirect({ to: "/admin/login", throw: true });
    }

    // const projectId = Route.useParams().projectId;
    if (projectId === "new") {
      // Default "blank" project for new creation
      const newProject: Project = {
        id: undefined,     // WTF?
        title: "",
        description: "",
        bodyContent: "",
        showcase: "",
        gallery: [],
        tech: [],
      };
      return newProject;
    }

    // Otherwise fetch from your backend
    const project = await fetchSingleProject(parseInt(projectId));
    if (!project) throw new Error("Project not found");
    return project;
  },
  // Render component using loader data
  component: EditProjectPage,
});