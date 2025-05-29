
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ApplicationPreview from "./pages/ApplicationPreview";
import Index from "./pages/Index";
import Application from "./pages/Application";
import Admin from "./pages/Admin";
import PdfDemo from "./pages/PdfDemo";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/application" element={<Application />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/pdf-demo" element={<PdfDemo />} />
            <Route path="/login" element={<Login />} />
            <Route path="/application-preview/:id" element={<ApplicationPreview />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
