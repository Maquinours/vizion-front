import { Outlet, ScrollRestoration } from '@tanstack/react-router';
import { ToastContainer } from 'react-toastify';

export default function RootView() {
  return (
    <>
      <ScrollRestoration />
      <ToastContainer position={'bottom-right'} hideProgressBar={true} theme={'colored'} autoClose={3000} />
      <Outlet />
    </>
  );
}
