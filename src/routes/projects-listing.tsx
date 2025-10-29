import { createFileRoute } from "@tanstack/react-router";
import { ProjectsList } from "../components/projects/ProjectsList";
import { useDocumentTitle } from '@mantine/hooks';

function ProjectsListingPage(){
      useDocumentTitle("Projects");
      return (
        <><ProjectsList/></>);
}

export const Route = createFileRoute("/projects-listing")({
      component: ProjectsListingPage,
})