'use client';

import { Toaster } from 'sonner';

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      richColors
      expand={true}
      duration={5000}
      toastOptions={{
        style: {
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
        },
        className: 'font-sans',
      }}
    />
  );
}