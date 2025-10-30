import { Group, Paper, SimpleGrid, Tabs, Tooltip, Image, Text, Container, Modal, Space } from "@mantine/core";
import { PageTitle } from "../PageTitle";
import {
  predefinedTechs,
  type Project,
} from "../../../types";
import { IconMessageCircle, IconPhoto } from "@tabler/icons-react";
import { useContext, useState } from "react";

type Props = {
  project: Project;
};

export function ProjectDetails({ project: projectToDisplay }: Props) {
  const project = projectToDisplay;
  const [opened, setOpened] = useState(false);
  const [url, setUrl ] = useState('')
  // let imageUrl = ''; 
  return (
    <>
      <PageTitle title={project.title}/>
      <Container>
      <Group wrap="wrap">
        {predefinedTechs.map(({ id, label, icon: Icon }) => {
          const active = project.tech?.includes(id);
          if (active)
            return (
              <div>
                <Tooltip label={label}>
                  <Icon size={18} />
                </Tooltip>
              </div>
            );
        })}
      </Group>
      </Container>
      <Paper
        shadow="sm"
        radius="md"
        p="xl"
        withBorder
        className="max-w-4xl mx-auto my-8"
      >
        <Tabs defaultValue="overview">
          <Tabs.List>
            <Tabs.Tab
              value="overview"
              leftSection={<IconMessageCircle size={18} />}
            >
              Overview
            </Tabs.Tab>
            <Tabs.Tab value="gallery" leftSection={<IconPhoto size={18} />}>
              Gallery
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="gallery">
            <Space h="xs" />
            {project.gallery.length > 0 ? (
            <SimpleGrid cols={3} spacing="sm">
              {project.gallery.map((img) => (
                <Image
                  key={img.id}
                  src={img.url} // should be the public URL
                  alt={img.alt || project.title}
                  radius="md"
                  onClick={() => {
                    setUrl(img.url.toString())
                    console.log("Img :" + img.url + " Set URL: " + setUrl);
                    setOpened(true);
                  }}
                />
              ))}
            </SimpleGrid>
          ) : (
            <Text color="dimmed">No images uploaded.</Text>
          )}
          </Tabs.Panel>

          <Tabs.Panel value="overview">
            <div dangerouslySetInnerHTML={{ __html: project.bodyContent }} />
            {/* {project.bodyContent} */}
          </Tabs.Panel>
        </Tabs>

        <Modal opened={opened} onClose={() => setOpened(false)} withCloseButton={false} size="lg">
        <Image src={url} alt="Full Size" fit="cover"/>
      </Modal>
      </Paper>
    </>
  );
}
