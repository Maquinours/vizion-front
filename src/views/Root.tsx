import { Outlet, ScrollRestoration } from '@tanstack/react-router';

export default function RootView() {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  );
}
