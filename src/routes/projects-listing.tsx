import { createFileRoute } from "@tanstack/react-router";
import { ProjectsList } from "../components/ProjectsList";

function ProjectsListingPage(){
      return (
        <><ProjectsList/></>);
}

export const Route = createFileRoute("/projects-listing")({
      component: ProjectsListingPage,
})