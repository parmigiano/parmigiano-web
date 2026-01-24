import './index.css';
import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from 'react-error-boundary';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Router from '@/router';

import { ToastContainer } from 'react-toastify';

import '@/utils/i18n';
import ErrorFallback from './components/ErrorFallback';
import Fallback from './components/Fallback';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
  },
});

const App = () => {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <Suspense fallback={<Fallback />}>
        <Router />
      </Suspense>
    </ErrorBoundary>
  );
};

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ToastContainer
          position="top-center"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={true}
          closeButton={true}
          theme="light"
          limit={3}
        />
        <App />

        <ReactQueryDevtools initialIsOpen={true} />
      </QueryClientProvider>
    </HelmetProvider>
  </BrowserRouter>
);
