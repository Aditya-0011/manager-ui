import { Suspense, lazy } from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { QueryClient, QueryClientProvider, QueryCache } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { toast } from "sonner";
import { FetchError } from "@/lib/objects";

const CONSOLE_URL = import.meta.env.VITE_CONSOLE_URL;

import { AuthProvider } from "@/contexts/AuthContext";
import { RootLayout } from "@/layouts/Root";
import { Loading } from "@/components/Loading";

const About = lazy(() => import("@/pages/About"));
const Technologies = lazy(() => import("@/pages/Technologies"));
const Projects = lazy(() => import("@/pages/Projects"));
const Experiences = lazy(() => import("@/pages/Experiences"));
const Messages = lazy(() => import("@/pages/Messages"));
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: { queries: { gcTime: 0 } },
  queryCache: new QueryCache({
    onSuccess: (data: unknown, query) => {
      const meta = query.meta as Record<string, unknown> | undefined;
      if (meta?.onSuccess && typeof meta.onSuccess === "function") meta.onSuccess(data);
      if (meta?.invalidateKey && Array.isArray(meta.invalidateKey)) {
        for (const key of meta.invalidateKey) {
          queryClient.invalidateQueries({ queryKey: key });
        }
      }
    },
    onError: (error, query) => {
      if (error instanceof FetchError) {
        const meta = query.meta as Record<string, unknown> | undefined;
        const { message, status } = error;
        if (status === 401 || status === 0) {
          if (!meta?.skipAuthErrorHandling) {
            queryClient.clear();
            if (meta?.logout && typeof meta.logout === "function") meta.logout();
            toast.error(message);
            window.location.href = `${CONSOLE_URL}/login?redirect=Manager`;
            return;
          }
        }
        toast.error(message);
      }
    },
  }),
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <AuthProvider>
        <BrowserRouter>
          <Suspense
            fallback={
              <div className="flex h-screen w-full items-center justify-center text-center">
                <Loading />
              </div>
            }
          >
            <Routes>
              <Route element={<RootLayout />}>
                <Route index element={<Navigate to="/messages" replace />} />
                <Route path="/about" element={<About />} />
                <Route path="/technologies" element={<Technologies />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/experiences" element={<Experiences />} />
                <Route path="/messages" element={<Messages />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
