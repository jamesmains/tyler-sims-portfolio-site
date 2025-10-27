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

interface DeleteProjectModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

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
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useProjectsQuery(page, 10);
  const deleteProject = useDeleteProjectMutation();

  const projects = data?.data ?? [];

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

      <Table highlightOnHover striped withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Title</Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {projects.map((project) => (
            <Table.Tr key={project.id}>
              <Table.Td>{project.id}</Table.Td>
              <Table.Td>{project.title}</Table.Td>
              <Table.Td>{project.description}</Table.Td>
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
