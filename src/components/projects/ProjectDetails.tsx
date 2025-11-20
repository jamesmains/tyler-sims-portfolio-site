import { Group, Paper, SimpleGrid, Tabs, Tooltip, Image, Text, Container, Modal, Space, Button, Anchor, Box, ActionIcon } from "@mantine/core";
import { PageTitle } from "../PageTitle";
import {
  predefinedTechs,
  prefedinedProjectExternalLinks,
  type Project,
} from "../../../types";
import { IconMessageCircle, IconPhoto, IconArrowBack, IconBrandYoutube, IconBrandItch } from "@tabler/icons-react";
import { useContext, useState } from "react";

type Props = {
  project: Project;
};

export function ProjectDetails({ project: projectToDisplay }: Props) {
  const icon = <IconArrowBack size={18} />;

  const debugYtIcon = <IconBrandYoutube size={18} />
  const debugItchIcon = <IconBrandItch size={18} />

  const project = projectToDisplay;
  const [opened, setOpened] = useState(false);
  const [gameOpened, setGameOpened] = useState(false);

  const [url, setUrl] = useState('')
  // let imageUrl = ''; 
  return (
    <>
      <PageTitle title={project.title} />
      <Container>
        <Group justify="space-between">
          {/* Tech Group */}
          <Group pb="xs">
            {predefinedTechs.map(({ id, label, icon: Icon }) => {
              const active = project.tech?.includes(id);
              if (active)
                return (
                  <Group align="center">
                    <Tooltip label={label}>
                      <Icon size={18} />
                    </Tooltip>
                  </Group>
                );
            })}
            {/* Attempt at simple return button, never looked correct... */}
            {/* <Box style={{ flex: 1 }} />*/}
          </Group>
          {/* External Link Group */}
          <Group justify="center">
    {prefedinedProjectExternalLinks.map(({ id, label, tooltip, icon: Icon }) => {
        
        // 1. Use .some() to check if ANY object in project.links has an id matching the current item's id.
        const active = project.links?.some(link => link.id === id); 
        
        // 2. Find the active link object to get its URL for the Anchor component
        const activeLink = project.links?.find(link => link.id === id);

        // Render only if the link type is active AND we have its URL
        if (active && activeLink)
            return (
                <Group key={id} align="center">
                    <Tooltip label={tooltip}>
                        {/* Use the specific URL from the activeLink object */}
                        <Anchor href={activeLink.url} target="_blank" rel="noopener noreferrer" pb="xs">
                            <Button variant="default" size="xs" leftSection={<Icon size={18} />}>
                                {label}
                            </Button>
                        </Anchor>
                    </Tooltip>
                </Group>
            );
    })}
</Group>
          {/* Return to Projects Listing */}
          <Group justify="center" align="center">
            <Tooltip label="Back to projects list">
              <Anchor href="/projects-listing">{icon}</Anchor>
            </Tooltip>
          </Group>
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
            {/* Testing out Embedded Gameplay */}
            {/* <Tabs.Tab value="test" leftSection={<IconBrandItch size={18}/>} onClick={ () => {
            setGameOpened(true);
            console.log(gameOpened);
          }}>
              Play
            </Tabs.Tab> */}
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

          {/* Testing out Embedded Gameplay */}
          {/* <Tabs.Panel value="test" >
            Play
          </Tabs.Panel> */}
        </Tabs>

        <Modal opened={opened} onClose={() => setOpened(false)} withCloseButton={false} size="lg">
          <Image src={url} alt="Full Size" fit="cover" />
        </Modal>

        {/* Testing out Embedded Gameplay */}
        {/* <Modal opened={gameOpened} onClose={() => setGameOpened(false)} withCloseButton={false} size="lg">
        <iframe frameBorder="0" src="https://itch.io/embed-upload/12641771?color=6C5A86" width="100%" height="100%"><a href="https://james-the-mains.itch.io/astro-m2">Play Astro M2 on itch.io</a></iframe>
      </Modal> */}
      </Paper>
      <Group justify="center" pt="lg">
        <Anchor href="/projects-listing"><Button leftSection={icon}>Back to Projects</Button></Anchor>
      </Group>
    </>
  );
}
