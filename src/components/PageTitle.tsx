import { Box, Container, Divider, Space } from "@mantine/core";

export function PageTitle(header: {title:string}) {
  return (
    <Box>
      <Space h="xs" />
      <Divider size="sm" />
      <Container>
        <h1>{header.title}</h1>
      </Container>
      <Divider size="sm" />
      <Space h="xs" />
    </Box>
  );
}
