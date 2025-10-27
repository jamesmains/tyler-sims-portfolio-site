import { ActionIcon, Menu } from "@mantine/core";
import { IconAdjustments, IconFile, IconLogout2, IconFilePlus } from "@tabler/icons-react";

type Props = {
  logout: () => Promise<void>;
};

export function AdminActionsMenu({ logout: onLogout }: Props) {
  return (
    <Menu shadow="md" width={200} position="left-start">
      <Menu.Target>
        <ActionIcon
          variant="default"
          size="md"
          radius="lg"
          aria-label="Settings"
        >
          <IconAdjustments
            style={{ width: "70%", height: "70%" }}
            stroke={1.5}
          />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Application</Menu.Label>
        <Menu.Item
          leftSection={<IconFile size={14} />}
          component="a"
          href="/admin/dashboard"
        >
          Projects
        </Menu.Item>

        <Menu.Item
            leftSection={<IconFilePlus size={14}/>}
            component="a"
            href="/admin/manage/new"
        >
            Add Project
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>Danger zone</Menu.Label>
        <Menu.Item
          color="red"
          leftSection={<IconLogout2 size={14} />}
          onClick={onLogout}
        >
          Logout
          {/* <Button variant="default" onClick={onLogout}>Logout</Button> */}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
