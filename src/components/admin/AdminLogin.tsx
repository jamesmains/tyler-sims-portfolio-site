import React, { useEffect, useState } from "react";
import { useSetAtom, useAtomValue } from "jotai";
import { adminSecretAtom, isAdminLoggedInAtom } from "../../state/auth"; // Import the derived atom setter
import { adminLogin } from "../../api/projects"; // Import the new test function
import {
  TextInput,
  Button,
  Paper,
  Title,
  Text,
  Container,
} from "@mantine/core";
import { useRouter } from "@tanstack/react-router";

/**
 * AdminLogin Component
 * Provides a simple form to enter the admin secret key.
 */
export function AdminLogin() {
  // We now set the secret key in the atom (which also sets isAdminLoggedIn)
  const setAdminSecret = useSetAtom(adminSecretAtom);

  // Local state for the password input field
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const isAdmin = useAtomValue(isAdminLoggedInAtom);

  useEffect(() => {
    if (isAdmin) {
      router.navigate({ to: "/admin/dashboard" });
    }
  }, [isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const key = password.trim();

    if (!key) {
      setError("Please enter the Admin Secret Key.");
      setIsLoading(false);
      return;
    }

    try {
      // Call the secure worker function
      const isValid = await adminLogin(key);
      if (isValid) {
        // If server returns 200 OK, store the key and log in
        setAdminSecret(key);
        setPassword("");
        await router.navigate({
          to: "/admin/dashboard",
        });
      } else {
        // If server returns 401 Unauthorized, show error (The kickback!)
        setError("Authentication failed. Invalid secret key.");
      }
    } catch (err) {
      console.error("Login network error:", err);
      setError("A network error occurred. Check server connection.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <Container size={420} my={40}>
        <Title
          // align="center"
          order={2}
          // sx={(theme) => ({ fontFamily: `Inter, sans-serif` })}
        >
          Admin Access
        </Title>
        <Text color="dimmed" size="sm" /*align="center"*/ mt={5}>
          Enter your **Admin Secret Key** to manage projects.
        </Text>

        <Paper
          withBorder
          shadow="md"
          p={30}
          mt={30}
          radius="md"
          component="form"
          onSubmit={handleSubmit}
        >
          <TextInput
            label="Admin Secret Key"
            placeholder="********************"
            required
            type="password"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
            // icon={<LockIcon />}
          />

          {error && (
            <Text color="red" size="sm" mt="xs">
              {error}
            </Text>
          )}

          <Button fullWidth mt="xl" type="submit" loading={isLoading}>
            Log In
          </Button>
        </Paper>
      </Container>
    );
  } else
    return (
      <Container size={420} my={40}>
        <Title
          // align="center"
          order={2}
          // sx={(theme) => ({ fontFamily: `Inter, sans-serif` })}
        >
          Admin Access Granted
        </Title>
      </Container>
    );
}
