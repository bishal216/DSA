import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

// Providers
import { TooltipProvider } from "@/components/ui/tooltip";
import ThemeProvider from "@/config/theme_provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 5000,
              style: {
                background: "#333",
                color: "#fff",
              },
            }}
          />
          <RouterProvider router={router} />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
