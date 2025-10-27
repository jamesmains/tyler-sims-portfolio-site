import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  predefinedTechs,
  type Project,
} from "../../../types";
import {
  useAddProjectMutation,
  useModifyProjectMutation,
} from "../../api/projects";
import {
  Checkbox,
  TextInput,
  Textarea,
  Button,
  Group,
  Box,
  Title,
  Paper,
  Divider,
  Tabs,
  Tooltip,
  Space,
  Menu,
} from "@mantine/core";
import { IconFileTypeHtml, IconLetterCase } from "@tabler/icons-react";
import { ProjectFileUpload } from "./ProjectFileUpload";

type Props = {
  project: Project;
};

export function ProjectForm({ project: initialProject }: Props) {
  const [project, setProject] = useState<Project>(initialProject);
  const navigate = useNavigate();
  const mutation =
    initialProject.id !== undefined
      ? useModifyProjectMutation()
      : useAddProjectMutation();
  const editor = useEditor({
    extensions: [StarterKit],
    content: project.bodyContent,
    onUpdate: ({ editor }) => updateField("bodyContent", editor.getHTML()),
  });

  const updateField = (key: keyof Project, value: any) => {
    setProject((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(project);
    await navigate({ to: `/admin/manage/${project.id}`, replace: true });
    await navigate({ to: "/admin/dashboard" });
  };

  return (
    <Paper
      shadow="sm"
      radius="md"
      p="xl"
      withBorder
      className="max-w-4xl mx-auto my-8"
    >
      <Title order={2} className="mb-6 text-center">
        {initialProject.id ? "Edit Project" : "Create Project"}
      </Title>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        {/* Title */}
        <TextInput
          label="Project Title"
          placeholder="Enter the project title"
          value={project.title}
          onChange={(e) => updateField("title", e.currentTarget.value)}
          required
        />

        {/* Short Description */}
        <Textarea
          label="Short Description"
          placeholder="Enter a brief description"
          value={project.description}
          onChange={(e) => updateField("description", e.currentTarget.value)}
          minRows={2}
        />

        {/* Body Content Editor */}
        <Box>
          <Space h="xs" />
          <Title order={4} className="mb-2">
            Body Content
          </Title>
          <Space h="xs" />
          <Divider size="sm" />
          <Space h="xs" />

          <Tabs defaultValue="content">
            <Tabs.List>
              <Tabs.Tab
                value="content"
                leftSection={<IconFileTypeHtml size={12} />}
              >
                HTML
              </Tabs.Tab>
              <Tabs.Tab
                value="raw_content"
                leftSection={<IconLetterCase size={12} />}
              >
                Raw Content
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="content">
              <Box className="border rounded-lg bg-white shadow-sm p-4">
                <Space h="xs" />
                <Group className="mb-2">
                  <Button
                    variant="default"
                    size="xs"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                  >
                    B
                  </Button>
                  <Button
                    variant="default"
                    size="xs"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                  >
                    I
                  </Button>
                  <Menu shadow="md" width={200}>
                    <Menu.Target>
                      <Button variant="default" size="xs">
                        H
                      </Button>
                    </Menu.Target>

                    <Menu.Dropdown>
                      <Menu.Item
                        onClick={() =>
                          editor
                            .chain()
                            .focus()
                            .toggleHeading({ level: 2 })
                            .run()
                        }
                      >
                        Header 2
                      </Menu.Item>
                      <Menu.Item
                        onClick={() =>
                          editor
                            .chain()
                            .focus()
                            .toggleHeading({ level: 3 })
                            .run()
                        }
                      >
                        Header 3
                      </Menu.Item>
                      <Menu.Item
                        onClick={() =>
                          editor
                            .chain()
                            .focus()
                            .toggleHeading({ level: 4 })
                            .run()
                        }
                      >
                        Header 4
                      </Menu.Item>
                      <Menu.Item
                        onClick={() =>
                          editor
                            .chain()
                            .focus()
                            .toggleHeading({ level: 5 })
                            .run()
                        }
                      >
                        Header 5
                      </Menu.Item>
                      <Menu.Item
                        onClick={() =>
                          editor
                            .chain()
                            .focus()
                            .toggleHeading({ level: 6 })
                            .run()
                        }
                      >
                        Header 6
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                  <Button
                    variant="default"
                    size="xs"
                    onClick={() =>
                      editor.chain().focus().toggleBulletList().run()
                    }
                  >
                    • List
                  </Button>
                </Group>
                <Space h="xs" />
                <EditorContent editor={editor} className="editor-content" />
              </Box>
            </Tabs.Panel>

            <Tabs.Panel value="raw_content">
              <TextInput
                label="Raw HTML Content"
                value={project.bodyContent}
                onChange={(e) => {
                  updateField("bodyContent", e.currentTarget.value);
                  editor?.commands.setContent(e.currentTarget.value);
                }}
              />
            </Tabs.Panel>
          </Tabs>
        </Box>
        <Space h="xs" />
        {/* Showcase Image */}
        <ProjectFileUpload
          project={project}
          updateField={updateField}
          fieldName="showcase"
          maxImages={1}
        />
        <Space h="xs" />
        <ProjectFileUpload
          project={project}
          updateField={updateField}
          fieldName="gallery"
          maxImages={10}
        />
        {/* Tech Selection */}
        <Box>
          <Space h="xs" />
          <Title order={4} className="mb-2">
            Technologies
          </Title>
          <Space h="xs" />
          <Divider size="sm" />
          <Space h="xs" />
          <Group wrap="wrap">
            {predefinedTechs.map(({ id, label, icon: Icon }) => {
              const active = project.tech?.includes(id);
              return (
                <Tooltip label={label}>
                  <Box key={id} className="flex items-center gap-1 col-2">
                    <Icon size={24} />
                    <Checkbox
                      checked={active}
                      // label={label}
                      onChange={(e) => {
                        const newTechs = e.currentTarget.checked
                          ? [...(project.tech || []), id]
                          : (project.tech || []).filter((t) => t !== id);
                        updateField("tech", newTechs);
                      }}
                    />
                  </Box>
                </Tooltip>
              );
            })}
          </Group>
        </Box>

        {/* Action Buttons */}
        <Group mt="xl">
          <Button variant="default" component={Link} to="/admin/dashboard">
            Cancel
          </Button>
          <Button type="submit">Save Project</Button>
        </Group>
      </form>
    </Paper>
  );
}
