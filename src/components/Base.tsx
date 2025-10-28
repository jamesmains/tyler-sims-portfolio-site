import { Box, Group, Container } from "@mantine/core";
import { NavActionsMenu } from "./NavActionsMenu";
import { NavActionsMenuMobile } from "./NavActionsMenuMobile";
import { ColorSchemeButton } from "./ColorSchemeButton";

export function Base() {
  return (
    <Container size="lg">
      <Group justify="right" align="right" hiddenFrom="sm">
        <ColorSchemeButton />
        <NavActionsMenuMobile />
      </Group>
      <Group justify="center" align="center" visibleFrom="sm">
        <NavActionsMenu />
        <ColorSchemeButton />
      </Group>
    </Container>
  );
}
