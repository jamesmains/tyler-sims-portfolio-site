import { createFileRoute } from "@tanstack/react-router";
import {
  Avatar,
  Container,
  Stack,
  Title,
  Text,
  Group,
  Button,
} from "@mantine/core";
import {
    IconArchive,
  IconBrandGithub,
  IconBrandLinkedin,
  IconMail,
} from "@tabler/icons-react";
const HomePage = () => {
  return (
    <Container size="md" py="sm">
      <Stack
        align="center"
        justify="center"
        style={{ minHeight: "80vh" }}
      >
        {/* Avatar / Profile Picture */}
        <Avatar
          src="/uploads/profile-pic.jpg"
          size={200}
          radius={120}
          alt="Profile"
        />

        {/* Name / Title */}
        <Title order={1} style={{ fontFamily: "'Rubik', sans-serif" }}>
          Tyler Sims
        </Title>

          {/* Short bio */}
          <Text size="lg" color="dimmed" style={{ maxWidth: 600 }} ta={"center"}>
            I’m a software developer specializing in game development and web
            applications. I build projects that are both fun and functional,
            combining clean design with strong engineering principles.
          </Text>
        {/* Links */}
        <Group __size="md">
            <Button
            component="a"
            href="/projects-listing"
            leftSection={<IconArchive size={16} />}
            variant="outline"
          >
            Projects
          </Button>
          <Button
            component="a"
            href="mailto:contact@tyler-sims.com"
            leftSection={<IconMail size={16} />}
            variant="outline"
          >
            Contact
          </Button>
          <Button
            component="a"
            href="https://github.com/jamesmains"
            target="_blank"
            leftSection={<IconBrandGithub size={16} />}
            variant="outline"
          >
            GitHub
          </Button>
          <Button
            component="a"
            href="https://www.linkedin.com/in/tyler-jim-sims/"
            target="_blank"
            leftSection={<IconBrandLinkedin size={16} />}
            variant="outline"
          >
            LinkedIn
          </Button>
        </Group>
      </Stack>
    </Container>
  );
};

export const Route = createFileRoute("/")({
  component: HomePage,
});
