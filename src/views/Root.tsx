import { Outlet, ScrollRestoration } from '@tanstack/react-router';
import React, { Suspense } from 'react';
import { ToastContainer } from 'react-toastify';

const TanStackRouterDevtools = import.meta.env.PROD
  ? () => null // Render nothing in production
  : React.lazy(() =>
      // Lazy load in development
      import('@tanstack/router-devtools').then((res) => ({
        default: res.TanStackRouterDevtools,
        // For Embedded Mode
        // default: res.TanStackRouterDevtoolsPanel
      })),
    );

export default function RootView() {
  return (
    <>
      <ScrollRestoration />
      <ToastContainer position={'bottom-right'} hideProgressBar={true} theme={'colored'} autoClose={3000} />
      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
      <Outlet />
    </>
  );
}
