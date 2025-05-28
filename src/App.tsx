
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Application from "./pages/Application";
import Admin from "./pages/Admin";
import Applicants from "./pages/Applicants";
import Login from "./pages/Login";
import LazyPdfDemo from "./components/LazyPdfDemo";

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
            <Route path="/applicants" element={<Applicants />} />
            <Route path="/login" element={<Login />} />
            <Route path="/pdf-demo" element={<LazyPdfDemo />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
