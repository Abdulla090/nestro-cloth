
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { SuggestionsProvider } from "@/contexts/SuggestionsContext";
import Index from "./pages/Index";
import Closet from "./pages/Closet";
import Suggestions from "./pages/Suggestions";
import AIChat from "./pages/AIChat";
import TodayOutfit from "./pages/TodayOutfit";
import OutfitPreview3D from "./pages/OutfitPreview3D";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SuggestionsProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/closet" element={<Closet />} />
              <Route path="/suggestions" element={<Suggestions />} />
              <Route path="/ai-chat" element={<AIChat />} />
              <Route path="/today-outfit" element={<TodayOutfit />} />
              <Route path="/outfit-preview" element={<OutfitPreview3D />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </SuggestionsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
