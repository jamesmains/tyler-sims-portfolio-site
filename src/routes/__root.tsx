import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Base } from "../components/Base";
import { Box, Container } from "@mantine/core";
import { Footer } from "../components/Footer";

const MAX_CONTENT_WIDTH = "md";

const RootComponent = () => {
  // const rootProps = {
  //   h: 50,
  //   mt: "md",
  // };

  return (
    <Box
      mih="100vh"
      style={{
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
      }}
    >
      <Box component="header">
        <Container size={MAX_CONTENT_WIDTH} pt="md">
          <Base />
        </Container>
      </Box>

      <Box component="main">
        <Container size={MAX_CONTENT_WIDTH}>
          <Outlet />
        </Container>
      </Box>
      <Box component="footer">
        <Container size={MAX_CONTENT_WIDTH}>
          <Footer />
        </Container>
      </Box>
    </Box>
  );
};

// --- Root Route Definition ---
export const Route = createRootRoute({
  component: RootComponent,
});
