import React from 'react';
import ReactDOM from 'react-dom/client';

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import { router } from './routeConfig.ts';
import { RouterProvider } from '@tanstack/react-router';

import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import './index.css';
import { SessionProvider } from './serviceProvider.tsx';


// Create a client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Wrap the everything with mantine */}
    <MantineProvider defaultColorScheme='auto'>
    {/* Wrap the app with the provider */}
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
        <RouterProvider router={router} /> 
        </SessionProvider>
      </QueryClientProvider>
    </MantineProvider>
  </React.StrictMode>
);