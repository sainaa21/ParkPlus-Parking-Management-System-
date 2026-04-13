import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SlotMap from "./pages/SlotMap";
import CheckIn from "./pages/CheckIn";
import CheckOut from "./pages/CheckOut";
import Payments from "./pages/Payments";
import Reports from "./pages/Reports";
import ManageSlots from "./pages/ManageSlots";
import Employees from "./pages/Employees";
import NotFound from "./pages/not-found";

import { Layout } from "./components/Layout"; 

function Router() {
  return (
    <Switch>
      {/* LOGIN (NO SIDEBAR) */}
      <Route path="/" component={Login} />

      {/* ALL OTHER ROUTES WITH SIDEBAR */}
      
      <Route path="/dashboard">
        <Layout>
          <Dashboard />
        </Layout>
      </Route>

      <Route path="/map">
        <Layout>
          <SlotMap />
        </Layout>
      </Route>

      <Route path="/checkin">
        <Layout>
          <CheckIn />
        </Layout>
      </Route>

      <Route path="/checkout">
        <Layout>
          <CheckOut />
        </Layout>
      </Route>

      <Route path="/payments">
        <Layout>
          <Payments />
        </Layout>
      </Route>

      <Route path="/reports">
        <Layout>
          <Reports />
        </Layout>
      </Route>

      <Route path="/slots">
        <Layout>
          <ManageSlots />
        </Layout>
      </Route>

      <Route path="/employees">
        <Layout>
          <Employees />
        </Layout>
      </Route>

      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
