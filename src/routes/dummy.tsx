import  { createFileRoute } from '@tanstack/react-router';
import { ProjectsList } from '../components/ProjectsList';

const AdminComponent = () => {

    return (
        <div>
            <h1>Dummy page</h1>
            <ProjectsList />
        </div>
    );
};

export const Route = createFileRoute('/dummy')({
  component: AdminComponent,
});
