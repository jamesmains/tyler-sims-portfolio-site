import { useState, useCallback } from "react";
import { Text, Group, SimpleGrid, Loader, Pagination, Box } from "@mantine/core";
import { useProjectsQuery } from "../../api/projects"; 
import { PageTitle } from "../PageTitle";
import { ProjectCard } from "./ProjectCard";
import SearchFilters, { type FilterValues, type FilterOptionType } from "../SearchFilters";
import { predefinedTechs, type Project } from "../../../types";

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

// ----------------------------------------------------
// 2. Updated Component Logic
// ----------------------------------------------------

export function ProjectsList() {
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

  // --- Error State ---
  if (error) return <Text color="red">Failed to load projects</Text>;

  // --- Rendering ---
  return (
    <Box>
      <PageTitle title={"Projects"}/>
      
      {/* SearchFilters component receives the stable handleFilterChange prop */}
      <SearchFilters
        availableFilters={PROJECT_FILTER_OPTIONS}
        initialFilters={activeFilters}
        onFilterChange={handleFilterChange} 
      />
      { isLoading ? (<Loader size="xl" mx="auto" my="xl" /> ) : (
        <>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg" mt="xl">
        {projects.map((p:Project) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </SimpleGrid>

      <Group mt="xl" justify="center">
        <Pagination
          total={data?.pagination.totalPages ?? 1}
          value={page}
          onChange={setPage}
        />
      </Group>
      </>
      )}
    </Box>
  );
}