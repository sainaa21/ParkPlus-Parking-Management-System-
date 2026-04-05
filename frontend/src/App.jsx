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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/map" component={SlotMap} />
      <Route path="/checkin" component={CheckIn} />
      <Route path="/checkout" component={CheckOut} />
      <Route path="/payments" component={Payments} />
      <Route path="/reports" component={Reports} />
      <Route path="/slots" component={ManageSlots} />
      <Route path="/employees" component={Employees} />
      <Route component={NotFound} />
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
