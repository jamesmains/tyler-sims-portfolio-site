import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import {
  Group,
  Text,
  Image,
  Button,
  SimpleGrid,
  Title,
  Divider,
  Space,
  Flex,
  Box,
} from "@mantine/core";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import { type Project } from "../../../types";

export function ProjectFileUpload({
  project,
  updateField,
  fieldName,
  maxImages,
}: {
  project: Project;
  updateField: (key: keyof Project, value: any) => void;
  fieldName: keyof Project;
  maxImages: number;
}) {
  const files = (project[fieldName] as any[]) ?? [];

  const handleUpload = async (filesToUpload: File[]) => {
    const uploaded = [];
    for (const file of filesToUpload) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`/api/admin/project/image/${project.id}/upload`, {
        method: "POST",
        body: formData,
      });

      const { url } = await res.json();
      uploaded.push({ id: crypto.randomUUID(), url, alt: file.name });
    }

    // Merge uploaded images into the proper field
    const updated =
      fieldName === "gallery"
        ? [...files, ...uploaded]
        : uploaded[0]?.url ?? "";

    updateField(fieldName, updated);
  };

  const handleRemove = (id: string) => {
    if (fieldName === "gallery") {
      const updated = files.filter((img) => img.id !== id);
      updateField("gallery", updated);
    } else {
      updateField("showcase", "");
    }
  };
  return (
    <div>
      <Title order={4} className="mb-2">
        {fieldName === "showcase" ? "Showcase Image" : "Gallery Images"}
      </Title>
      <Space h="xs" />
      <Divider size="sm" />
      <Space h="xs" />

      {((fieldName === "showcase" && project.showcase.length === 0)
        || (fieldName === "gallery" && project.gallery.length < maxImages))
        && (
          <Dropzone
            onDrop={handleUpload}
            accept={IMAGE_MIME_TYPE}
            maxFiles={maxImages}
            multiple={fieldName === "gallery"}
          >
            <Group justify="center" gap="md" mih={100}>
              <Dropzone.Accept>
                <IconUpload size={32} />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX size={32} color="red" />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconPhoto size={32} />
                <Text>Drag image here or click to upload</Text>
              </Dropzone.Idle>
            </Group>
          </Dropzone>
        )}
      {/* Image previews */}
      {fieldName === "showcase" && project.showcase && (
        <Box align="center">
          <Group justify="center">
            <Image
              src={project.showcase}
              alt="Showcase"
              radius="md"
              fit="cover"
              h="200"
              w="200"
            />
          </Group>
          <Button mt="xs" color="red" onClick={() => handleRemove("showcase")}>
            Remove
          </Button>
        </Box>
      )}

      {fieldName === "gallery" && files.length > 0 && (
        <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="sm" mt="md">
          {files.map((img) => (
            <div key={img.id} style={{ position: "relative" }}>
              <Image src={img.url} alt={img.alt} radius="md" fit="cover" />
              <Button
                size="xs"
                color="red"
                variant="light"
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                }}
                onClick={() => handleRemove(img.id)}
              >
                Remove
              </Button>
            </div>
          ))}
        </SimpleGrid>
      )}
    </div>
  );
}
