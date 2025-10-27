import { Card, Image, Text, Transition } from "@mantine/core";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { type Project } from "../../types";

export function ProjectCard({ project }: { project: Project }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to="/projects/$projectId"
      params={{ projectId: String(project.id) }}
      style={{ textDecoration: "none" }}
    >
      <Card
        padding={0}
        withBorder
        radius="xl"
        shadow="lg"
        style={{
          position: "relative",
          overflow: "hidden",
          cursor: "pointer",
          transition: "transform 0.4s ease",
          transform: hovered ? "scale(1.03)" : "scale(1)",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Image
          src={project.showcase || "/placeholder.jpg"}
          alt={project.title}
          height={220}
          fit="cover"
          style={{ transition: "filter 0.3s ease", filter: hovered ? "brightness(50%)" : "brightness(100%)" }}
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
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              <Text
                ta="center"
                c="white"
                fw={700}
                size="xl"
                style={{
                  textShadow: "0 2px 8px rgba(0,0,0,0.7)",
                  fontFamily: "'Rubik', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
                  letterSpacing: "0.05em",
                }}
              >
                {project.title}
              </Text>
            </div>
          )}
        </Transition>
      </Card>
    </Link>
  );
}
