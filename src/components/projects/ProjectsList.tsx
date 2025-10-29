import { useState } from "react";
import { Text, Group, SimpleGrid, Loader, Pagination, Box } from "@mantine/core";
import { useProjectsQuery } from "../../api/projects";
import { PageTitle } from "../PageTitle";
import { ProjectCard } from "./ProjectCard";

export function ProjectsList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useProjectsQuery(page, 9); // 9 projects per page
  const projects = data?.data ?? [];

  if (isLoading) return <Loader size="xl" mx="auto" my="xl" />;
  if (error) return <Text color="red">Failed to load projects</Text>;

  return (
    <Box>
      <PageTitle title={"Projects"}/>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
        {projects.map((p) => (
          p.isPublished && (
          <ProjectCard key={p.id} project={p} />)
        ))}
      </SimpleGrid>

      <Group mt="xl" justify="center">
        <Pagination
          total={data?.pagination.totalPages ?? 1}
          value={page}
          onChange={setPage}
        />
      </Group>
    </Box>
  );
}
