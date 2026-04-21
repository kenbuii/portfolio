import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import About from "@/pages/About";
import BookshelfPage from "@/pages/BookshelfPage";
import BookDetail from "@/pages/BookDetail";
import Inspirations from "@/pages/Inspirations";
import Music from "@/pages/Music";
import Experiments from "@/pages/Experiments";
import Admin from "@/pages/Admin";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/bookshelf" component={BookshelfPage} />
      <Route path="/book/:id" component={BookDetail} />
      <Route path="/inspirations" component={Inspirations} />
      <Route path="/music" component={Music} />
      <Route path="/experiments" component={Experiments} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // #region agent log
  fetch('http://127.0.0.1:7930/ingest/ed5d04fb-4661-4841-a613-4b72ade82e82',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'6e75e1'},body:JSON.stringify({sessionId:'6e75e1',location:'App.tsx:31',message:'App mounted',data:{host:window.location.hostname,protocol:window.location.protocol,href:window.location.href},hypothesisId:'H1-H4',timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
