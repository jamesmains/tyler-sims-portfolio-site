import { Anchor, Box, Card, Group, Image, Pill, Text, Tooltip, Transition } from "@mantine/core";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { predefinedProjectTypes, predefinedTechs, type Project } from "../../../types";

export function ProjectCard({ project }: { project: Project }) {
  const [hovered, setHovered] = useState(false);

  return (
    
      <Card
        padding={0}
        withBorder
        radius="xl"
        shadow="lg"
        style={{
          position: "relative",
          overflow: "hidden",
          cursor: "pointer",
          transition: "transform 0.2s ease",
          transform: hovered ? "scale(1.02)" : "scale(1)",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Link
      to="/projects/$projectId"
      params={{ projectId: String(project.id) }}
      style={{ textDecoration: "none" }}
    >
        <Image
          src={project.showcase || "/placeholder.jpg"}
          alt={project.title}
          height={220}
          fit="cover"
          style={{ transition: "filter 0.3s ease", filter: hovered ? "brightness(20%)" : "brightness(100%)" }}
        />

        <Transition mounted={hovered} transition="fade-up" duration={400} timingFunction="cubic-bezier(.33,.13,.2,1)">
          {(styles) => (
            <div
              style={{
                ...styles,
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                // alignItems: "center",
                // justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              <Box p={"lg"}>
              <Text
                // ta="center"
                c="white"
                fw={500}
                size="xl"
                style={{
                  textShadow: "0 2px 8px rgba(0,0,0,0.7)",
                  letterSpacing: "0.05em",
                }}
              >
                {project.title}
              </Text>
              <Group pb="xs" wrap="wrap">
                {predefinedProjectTypes.map((value) => {
                        const active = project.type?.includes(value);
                        if (active)
                          return (
                            <Pill>
                                {value}
                            </Pill>
                          );
                      })}
              </Group>
              <Text
                // ta="center"
                c="white"
                fw={400}
                size="sm"
                pb="xs"
                style={{
                  textShadow: "0 2px 8px rgba(0,0,0,0.7)",
                  letterSpacing: "0.05em",
                }}
              >
                {project.description}
              </Text>
              <Group wrap="wrap">
                      {predefinedTechs.map(({ id, label, icon: Icon }) => {
                        const active = project.tech?.includes(id);
                        if (active)
                          return (
                            <div>
                                <Icon color="rgba(222, 222, 222, 1)" size={18} />
                            </div>
                          );
                      })}
                    </Group>
              </Box>

            </div>
          )}
        </Transition>
    </Link>
      </Card>
  );
}
