import {
  Drawer,
  ActionIcon,
  Stack,
  Text,
  useMantineTheme,
  Divider,
} from "@mantine/core";
import {
  IconMenu2,
  IconMail,
  IconBrandLinkedin,
  IconBrandGithub,
  IconFileCv,
  IconHome,
    IconArchive
} from "@tabler/icons-react";
import { useState } from "react";

export function NavActionsMenuMobile() {
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();

  const linkStyle = {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: theme.fontSizes.md,
    padding: "0.5rem 0",
    textDecoration: "none",
  } as const;

  return (
    <>
      <ActionIcon
        variant="light"
        size="lg"
        color="gray"
        onClick={() => setOpened(true)}
        aria-label="Open menu"
      >
        <IconMenu2 />
      </ActionIcon>

      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title={<Text fw={600}>Navigation</Text>}
        padding="md"
        size="sm"
        position="right"
      >
        <Stack>
          <a href="/" style={linkStyle}>
            <IconHome size={18} />
            <span>Home</span>
          </a>
          <a href="/projects-listing" style={linkStyle}>
            <IconArchive size={18} />
            <span>Projects</span>
          </a>

          <Divider label="Socials" labelPosition="center" />

          <a href="mailto:contact@tyler-sims.com" style={linkStyle}>
            <IconMail size={18} />
            <span>Contact Me</span>
          </a>

          <a
            href="https://www.linkedin.com/in/tyler-jim-sims/"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            <IconBrandLinkedin size={18} />
            <span>LinkedIn</span>
          </a>

          <a
            href="https://github.com/jamesmains"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            <IconBrandGithub size={18} />
            <span>GitHub</span>
          </a>

          <a
            href="/uploads/SimsTyler_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            <IconFileCv size={18} />
            <span>Resume</span>
          </a>
        </Stack>
      </Drawer>
    </>
  );
}
