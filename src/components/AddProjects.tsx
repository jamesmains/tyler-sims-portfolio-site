import { useState } from 'react';
import { useAddProjectMutation } from '../api/projects';
import type { Project } from '../../types.ts';

export function AddProject({visible}:{visible:boolean}) {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const mutation = useAddProjectMutation();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let project: Project = {
            title: title,
            description: desc,
            id: -1,             // Stupid workaround, this isn't written anywhere except the database...
            bodyContent: '',
            showcase: '',
            gallery: [],
            tech: [],
        }
        
        mutation.mutate(project);

        setTitle("");
        setDesc("");
    };
    if (!visible) return <></>;

    return (
        <form onSubmit={handleSubmit}>
            <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Title"
                disabled={mutation.isPending}
            />
            <input
                value={desc}
                onChange={e => setDesc(e.target.value)}
                placeholder="Description"
                disabled={mutation.isPending}
            />
            <button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Adding...' : 'Add Project'}
            </button>

            {mutation.isError && <div>An error occurred: {mutation.error.message}</div>}
        </form>
    )
}