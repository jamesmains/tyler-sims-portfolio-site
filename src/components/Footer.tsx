import { Divider, Space, Text } from "@mantine/core";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        textAlign: "center",
        padding: "1rem",
        borderColor: "var(--mantine-color-gray-4)",
      }}
    >
      <Space h="xs" />
      <Divider size="sm" />
      <Space h="xs" />

      <Text size="sm" c="dimmed">
        © {year} Tyler Sims. All rights reserved.
      </Text>
    </footer>
  );
}
