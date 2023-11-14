'use client';

import { ToastContainer } from 'react-toastify';

export default function ToastProvider() {
  return (
    <ToastContainer
      position="top-center"
      autoClose={false}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
}
