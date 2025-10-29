import { createFileRoute, redirect } from '@tanstack/react-router'
import type { Project } from '../../../../types';
import { ProjectForm } from '../../../components/admin/ProjectForm';
import { AdminBase } from '../../../components/admin/AdminBase';
import { checkSessionStatus, fetchSingleProject } from '../../../api/projects';
import { useDocumentTitle } from '@mantine/hooks';
import { Space } from '@mantine/core';

function EditProjectPage() {
  const project = Route.useLoaderData() as Project;
  let projectStateText = project.id === undefined ? "New Project" : "Editing Project"
  let publishStateText = project.isPublished ? "Published" : "Draft";
  useDocumentTitle(`${projectStateText} | ${publishStateText}`);
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
        isPublished: false,
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

