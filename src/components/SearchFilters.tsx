import React, { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { TextInput, Select, Checkbox, Group, Box, Title, Stack, MultiSelect, Container } from '@mantine/core'; 
import { IconSearch } from '@tabler/icons-react';
import MemoizedSearchInput from './MemoizedSearchInput';

// --- Type Definitions (Remain the same) ---
export type FilterOptionType =
  | { id: string; label: string; type: 'text'; }
  | { id: string; label: string; type: 'dropdown'; options: string[]; }
  | { id: string; label: string; type: 'checkbox'; };

export type FilterValues = Record<string, string | string[] | boolean | undefined>;

interface SearchFiltersProps {
  availableFilters: FilterOptionType[]; 
  initialFilters: FilterValues; 
  onFilterChange: (filters: FilterValues) => void; 
}

// --- Component Implementation ---

const SearchFilters: React.FC<SearchFiltersProps> = ({ 
  availableFilters, 
  initialFilters, 
  onFilterChange 
}) => {
  // 1. ISOLATED STATE: Separate state for the text search input (stable value)
  const initialQuery = (initialFilters.query as string) || '';
  const [searchText, setSearchText] = useState(initialQuery);
  
  // 2. MAIN STATE: State for all NON-TEXT filters (dropdowns, checkboxes)
  // Initialize by removing the 'query' value from the prop
  const nonQueryFilters = Object.fromEntries(
    Object.entries(initialFilters).filter(([key]) => availableFilters.find(f => f.id === key)?.type !== 'text')
  );
  const [nonQueryFormState, setNonQueryFormState] = useState<FilterValues>(nonQueryFilters);

  // 3. Debounce the ISOLATED search text
  const debouncedSearchText = useDebounce(searchText, 0);
  const handleSearchTextChange = useCallback((value: string) => {
    setSearchText(value);
}, []);

  // 4. Effect to call parent ONLY when the debounced search or non-query state changes
  useEffect(() => {
    // Normalize the debounced text
    const normalizedQuery = debouncedSearchText.trim().length > 0 ? debouncedSearchText.trim() : undefined;

    // Merge the two independent states for the final output
    const finalFilters: FilterValues = {
      ...nonQueryFormState,
      query: normalizedQuery,
    };
    
    // Call the parent handler
    onFilterChange(finalFilters);
    
  }, [debouncedSearchText, nonQueryFormState, onFilterChange]);


  // Handler for dropdowns/checkboxes (non-text inputs)
  const handleNonQueryChange = useCallback((
    id: string, 
    value: string | boolean | string[]
  ) => {
    let normalizedValue: string | string[] | boolean | undefined = value;

    if (typeof value === 'string' && value.trim() === '') {
        normalizedValue = undefined;
    }

    // Update the non-query state
    setNonQueryFormState(prev => ({
      ...prev,
      [id]: normalizedValue
    }));
  }, []);

  // Helper function to render Mantine input based on the filter type
  const renderInput = (filter: FilterOptionType) => {
    
    switch (filter.type) {
      case 'text':
    const filterId = filter.id;
    const filterLabel = filter.label;
    
    return (
        <MemoizedSearchInput
            id={filterId}
            label={filterLabel}
            value={searchText}
            onChange={handleSearchTextChange}
        />
    );
      case 'dropdown':
        const dropdownValue = nonQueryFormState[filter.id] as string[];
        // Dropdown changes trigger the handleNonQueryChange
        return (
          <MultiSelect 
            key={filter.id}
            id={filter.id}
            placeholder={`Filter by ${filter.label}`}
            data={filter.options}
            value={dropdownValue}
            onChange={(value) => handleNonQueryChange(filter.id, value || '')}
            clearable 
          />
        );
      case 'checkbox':
        const checkboxValue = nonQueryFormState[filter.id] as boolean;
        // Checkbox changes trigger the handleNonQueryChange
        return (
          <Checkbox
            key={filter.id}
            id={filter.id}
            label={filter.label}
            checked={checkboxValue || false}
            onChange={(e) => handleNonQueryChange(filter.id, e.target.checked)}
          />
        );
      default:
        return null;
    }
  };

  // Use Mantine Group and Stack for structure and spacing
  return (
    <Stack gap="md" py="md">
        <Group align="center" justify='flex-start'>
            {availableFilters.map(filter => {
                if (filter.type === 'checkbox') {
                    return (
                        <div key={filter.id}>
                            {renderInput(filter)}
                        </div>
                    );
                }
                
                return (
                    <Box key={filter.id} style={{ minWidth: 200 }}>
                        {renderInput(filter)}
                    </Box>
                );
            })}
        </Group>
    </Stack>
  );
};

export default SearchFilters;