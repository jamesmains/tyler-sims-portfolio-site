import {
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
  Box,
  Group,
  Container,
} from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";
import { NavActionsMenu } from "./NavActionsMenu";
import { NavActionsMenuMobile } from "./NavActionsMenuMobile";

export function Base() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  return (<Container size="lg">
        <Group justify="center" align="center">

          {/* Navigation */}
          <Group align="center" gap="sm">
            <Box hiddenFrom="sm">
              <NavActionsMenuMobile />
            </Box>

            <Box visibleFrom="sm">
              <NavActionsMenu />
            </Box>

            <ActionIcon
              onClick={() => setColorScheme(
                computedColorScheme === "light" ? "dark" : "light"
              )}
              variant="light"
              color={computedColorScheme === "light" ? "blue" : "yellow"}
              radius="xl"
              size="lg"
              aria-label="Toggle color scheme"
            >
              {computedColorScheme === "dark" ? (
                <IconSun size={18} />
              ) : (
                <IconMoon size={18} />
              )}
            </ActionIcon>
          </Group>
        </Group>
        
      </Container>
  );
}
