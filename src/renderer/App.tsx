/* eslint-disable react/no-unescaped-entities */
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { WithAction } from './pages/layout';
import { BasicStatistics } from './pages/dashboard';
import { MultistepForm } from './pages/new-investigation-file';

const router = createBrowserRouter([
  {
    path: '/',
    element: <WithAction />,
    children: [
      {
        path: '/index.html',
        element: <BasicStatistics />,
      },
      {
        path: '/stats',
        element: <BasicStatistics />,
      },
      {
        path: '/new-investigation-file',
        element: <MultistepForm />,
      },
    ],
  },
]);

export default function App() {
  return (
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  );
}
