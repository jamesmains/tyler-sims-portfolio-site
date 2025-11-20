import React, { useState } from 'react';
import {
  Group,
  TextInput,
  Button,
  Select,
  ActionIcon,
  Tooltip,
  Text,
  Box,
  Alert,
} from '@mantine/core';
import { IconTrash, IconAlertCircle } from '@tabler/icons-react';
// Assuming this path to your types and constants:
import {
  prefedinedProjectExternalLinks,
  type ExternalLink,
  type ProjectLink,
} from '../../../types'; 

type Props = {
  // Accepts the array of links and an update function from the parent form
  links: ProjectLink[];
  updateField: (key: 'links', value: ProjectLink[]) => void;
};

// --- Helper Functions ---
// Find the ExternalLink object based on its ID
const getExternalLinkDetails = (id: string): ExternalLink | undefined =>
  prefedinedProjectExternalLinks.find((link: ExternalLink) => link.id === id);

export function ProjectLinksManager({ links, updateField }: Props) {
  const [selectedLinkType, setSelectedLinkType] = useState<string | null>(null);
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Transform predefined links for Mantine Select component
  const selectData = prefedinedProjectExternalLinks.map((link) => ({
    value: link.id,
    label: link.name,
    icon: link.icon,
    disabled: links.some(l => l.id === link.id), // Disable already-added types
  }));

const getExternalLinkDetails = (id: string): ExternalLink | undefined =>
  prefedinedProjectExternalLinks.find((link: ExternalLink) => link.id === id);

  // --- HANDLER FUNCTIONS ---

  const handleAddLink = () => {
    setError(null);

    if (!selectedLinkType || !newLinkUrl.trim()) {
      setError('Both link type and URL are required.');
      return;
    }
    
    // ⚠️ Validation Check: Ensure this link type hasn't been added yet
    if (links.some(link => link.id === selectedLinkType)) {
      setError(`A link of type "${selectedLinkType}" has already been added.`);
      return;
    }

    const newLink: ProjectLink = {
      // The crucial change: 'id' is now the selected external link type ID
      id: selectedLinkType, 
      url: newLinkUrl.trim(),
    };

    // Update parent state with the new list
    updateField('links', [...links, newLink]);

    // Reset inputs
    setSelectedLinkType(null);
    setNewLinkUrl('');
  };

  const handleRemoveLink = (idToRemove: string) => {
    // Filter out the link to be removed by its type ID
    const updatedLinks = links.filter((link) => link.id !== idToRemove);
    updateField('links', updatedLinks);
  };

  // --- RENDER FUNCTIONS ---

  const renderableLinks = links.map((link) => {
    const linkTypeDetails = getExternalLinkDetails(link.id);
    const LinkIcon = linkTypeDetails?.icon;
    const linkLabel = linkTypeDetails?.tooltip || link.id;

    return (
      <Group 
        key={link.id} 
        justify="space-between" 
        align="center" 
        w="100%" 
        style={{ borderBottom: '1px solid var(--mantine-color-gray-1)', paddingBottom: '4px', paddingTop: '4px' }}
      >
        <Group gap="xs">
          {LinkIcon && <LinkIcon size={20} />}
          <Tooltip label={linkLabel}>
            <Text size="sm" w={100} fw={500} truncate>{linkLabel}</Text>
          </Tooltip>
          <a href={link.url} target="_blank" rel="noopener noreferrer">
            <Text size="sm" color="blue" truncate style={{ maxWidth: 200 }}>
              {link.url}
            </Text>
          </a>
        </Group>
        <ActionIcon
          color="red"
          variant="light"
          onClick={() => handleRemoveLink(link.id)}
          aria-label={`Remove ${link.id} link`}
        >
          <IconTrash size={18} />
        </ActionIcon>
      </Group>
    );
  });

  return (
    <Box>
      {/* Error Alert */}
      {error && (
        <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" mb="md">
          {error}
        </Alert>
      )}

      {/* Input Group for Adding New Link */}
      <Group align="flex-end" mb="md" grow>
        {/* Select Link Type */}
        <Select
          label="Link Type"
          placeholder="Select link type"
          data={selectData}
          value={selectedLinkType}
          onChange={(v)=>{setSelectedLinkType(v); console.log(v);}}
          required
        />
        {/* URL Input */}
        <TextInput
          label="URL"
          placeholder="https://..."
          type="url"
          value={newLinkUrl}
          onChange={(e) => setNewLinkUrl(e.currentTarget.value)}
          required
        />
        {/* Add Button */}
        <Button onClick={handleAddLink} disabled={!selectedLinkType || !newLinkUrl.trim()} style={{ height: 36 }}>
          Add Link
        </Button>
      </Group>

      {/* Display List of Existing Links */}
      {links.length > 0 ? (
        <Box mt="md">
          {renderableLinks}
        </Box>
      ) : (
        <Text color="dimmed" fs="italic">
          No external links added.
        </Text>
      )}
    </Box>
  );
}