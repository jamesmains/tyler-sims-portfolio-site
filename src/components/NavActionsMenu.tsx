import { Anchor, rem, Box, Group } from "@mantine/core";
import {
  IconMail,
  IconBrandLinkedin,
  IconBrandGithub,
  IconFileCv,
  IconHome,
  IconArchive,
} from "@tabler/icons-react";

export function NavActionsMenu() {
  const externalLinks = [
    
    { href: "mailto:contact@tyler-sims.com", label: "Contact", icon: IconMail },
    {
      href: "https://www.linkedin.com/in/tyler-jim-sims/",
      label: "LinkedIn",
      icon: IconBrandLinkedin,
      external: true,
    },
    {
      href: "https://github.com/jamesmains",
      label: "GitHub",
      icon: IconBrandGithub,
      external: true,
    },
    {
      href: "/uploads/SimsTyler_Resume.pdf",
      label: "Resume",
      icon: IconFileCv,
      external: true,
    },
  ];

  const internalLinks = [
    { href: "/", label: "Home", icon: IconHome, external: false },
    { href: "/projects-listing", label: "Projects", icon: IconArchive, external: false },
  ]

  return (
    <Box>
    <Group justify="center">
      {externalLinks.map(({ href, label, icon: Icon, external }) => (
        <Anchor
          key={label}
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          style={{
            display: "flex",
            alignItems: "center",
            gap: rem(6),
            textDecoration: "none",
            fontWeight: 500,
            color: "inherit",
          }}
        >
          <Icon size={16} />
          {label}
        </Anchor>
      ))}
    </Group>

    <Group justify="center">
      {internalLinks.map(({ href, label, icon: Icon, external }) => (
        <Anchor
          key={label}
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          style={{
            display: "flex",
            alignItems: "center",
            gap: rem(6),
            textDecoration: "none",
            fontWeight: 500,
            color: "inherit",
          }}
        >
          <Icon size={16} />
          {label}
        </Anchor>
      ))}
    </Group>
    </Box>
  );
}
