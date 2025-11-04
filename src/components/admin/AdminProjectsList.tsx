import { useCallback, useState } from "react";
import {
  Table,
  Button,
  Group,
  Text,
  Pagination,
  Loader,
  Modal,
} from "@mantine/core";
import { useProjectsQuery, useDeleteProjectMutation } from "../../api/projects";
import { notifications } from "@mantine/notifications";
import { Link } from "@tanstack/react-router";
import { predefinedTechs, type Project } from "../../../types";
import { IconCheck } from "@tabler/icons-react";
import type { FilterOptionType, FilterValues } from "../SearchFilters";
import SearchFilters from "../SearchFilters";

interface DeleteProjectModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

// ----------------------------------------------------
// 1. Filter Configuration
// ----------------------------------------------------

const PROJECT_FILTER_OPTIONS: FilterOptionType[] = [
  { id: 'query', label: 'Search Title', type: 'text' },
  { id: 'tech', label: 'Technology', type: 'dropdown', options: predefinedTechs.map(o=>o.id) },
  { id: 'published', label: 'Published Only', type: 'checkbox' }, 
];

const INITIAL_FILTERS: FilterValues = {
  query: undefined,
  tech: undefined, 
  published: true,
};

const ITEMS_PER_PAGE = 9;

export function DeleteProjectModal({
  opened,
  onClose,
  onConfirm,
}: DeleteProjectModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title="Confirm Deletion" centered>
      <Text>
        Are you sure you want to delete this project? This action cannot be
        undone.
      </Text>
      <Group justify="end" mt="md">
        <Button variant="default" onClick={onClose}>
          Cancel
        </Button>
        <Button color="red" onClick={onConfirm}>
          Delete
        </Button>
      </Group>
    </Modal>
  );
}


export function AdminProjectsList() {

  
  const [opened, setOpened] = useState(false);
  const [targetDeleteProject, setTargetDeleteProject] = useState<number | null>(
    null
  );
  const deleteProject = useDeleteProjectMutation();

  const [activeFilters, setActiveFilters] = useState<FilterValues>(INITIAL_FILTERS);
  const [page, setPage] = useState(1);
  
  const { data, isLoading, error } = useProjectsQuery(page, ITEMS_PER_PAGE, activeFilters); 
  const projects = data?.data ?? [];

    const handleFilterChange = useCallback((newFilters: FilterValues) => {
    // Use functional update for setActiveFilters
    setActiveFilters(newFilters);
    
    // Use functional update for setPage or simply set it to 1
    // Setting to 1 is simpler and guarantees the pagination reset.
    setPage(1); 
    
  }, []);

  const openDeleteModal = useCallback((projectId: number | undefined) => {
    if(projectId === undefined) return;
    setTargetDeleteProject(projectId);
    setOpened(true);
  }, []);

  const handleDelete = useCallback(() => {
    if (targetDeleteProject !== null) {
      deleteProject.mutate(targetDeleteProject, {
        onSuccess: () => {
          setOpened(false);
          setTargetDeleteProject(null);
          notifications.show({ message: "Project deleted", color: "green" });
        },
        onError: () => {
          notifications.show({ message: "Failed to delete", color: "red" });
        },
      });
    }
  }, [deleteProject, targetDeleteProject]);

  const closeModal = useCallback(() => {
    setTargetDeleteProject(null);
    setOpened(false);
  }, []);

  if (isLoading) return <Loader />;
  if (error) return <Text color="red">Failed to load projects</Text>;

  return (
    <div>

      <Group justify="space-between" mb="md">
        <Text size="xl" fw={600}>
          Projects
        </Text>
        <Link to="/admin/manage/$projectId" params={{ projectId: 'new' }}>
  New Project
</Link>
      </Group>
      <SearchFilters
        availableFilters={PROJECT_FILTER_OPTIONS}
        initialFilters={activeFilters}
        onFilterChange={handleFilterChange} 
      />
      <Table highlightOnHover striped withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Title</Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th>Published</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {projects.map((project: Project) => (
            <Table.Tr key={project.id}>
              <Table.Td>{project.id}</Table.Td>
              <Table.Td>{project.title}</Table.Td>
              <Table.Td>{project.description}</Table.Td>
              <Table.Td>{project.isPublished && (<IconCheck size={32} />)}</Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <Link to="/projects/$projectId" params={{ projectId: String(project.id) }}>
  View
</Link>
                  <Link to="/admin/manage/$projectId" params={{ projectId: String(project.id) }}>
  Edit
</Link>
                  <Button
                    size="xs"
                    color="red"
                    variant="light"
                    onClick={() => openDeleteModal(project.id)} //() => deleteProject.mutate(project.id)}
                  >
                    Delete
                  </Button>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      <DeleteProjectModal
        opened={opened}
        onClose={closeModal}
        onConfirm={handleDelete}
      />
      <Group justify="center" mt="md">
        <Pagination
          total={data?.pagination.totalPages ?? 1}
          value={page}
          onChange={setPage}
        />
      </Group>
    </div>
  );
}
