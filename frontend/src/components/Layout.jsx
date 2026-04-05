import { Link, useLocation } from "wouter";
import { useLogout, useUser } from "../hooks/use-auth";
import {
  LayoutDashboard,
  Map,
  LogIn,
  LogOut,
  CreditCard,
  Users,
  BarChart3,
  Settings,
  Car,
} from "lucide-react";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";

export function Layout({ children }) {
  const [location] = useLocation();
  const logout = useLogout();
  const user = useUser();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/map", label: "Slot Map", icon: Map },
    { href: "/checkin", label: "Check-In", icon: LogIn },
    { href: "/checkout", label: "Check-Out", icon: LogOut },
    { href: "/payments", label: "Payments", icon: CreditCard },
    { href: "/reports", label: "Reports", icon: BarChart3 },
    { href: "/slots", label: "Manage Slots", icon: Settings },
    { href: "/employees", label: "Employees", icon: Users },
  ];

  // TEMP BYPASS
// if (!user && location !== "/") {
//   window.location.href = "/";
//   return null;
// }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-black/60 backdrop-blur-xl border-r border-white/10 flex flex-col fixed md:sticky top-0 h-auto md:h-screen z-50">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-primary to-red-900 rounded-lg shadow-lg shadow-primary/20">
            <Car className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white text-lg leading-none">PMS</h1>
            <p className="text-xs text-white/50 mt-1">Parking System</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                  isActive
                    ? "bg-primary/20 text-white font-medium shadow-[0_0_20px_rgba(239,68,68,0.15)] border border-primary/20"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                )}
                <item.icon
                  className={cn(
                    "w-5 h-5",
                    isActive ? "text-primary" : "group-hover:text-white"
                  )}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="glass-card p-4 rounded-xl mb-4">
            <p className="text-xs text-white/40 mb-1">Logged in as</p>
            <p className="text-sm font-semibold text-white">
              {user?.name || "Admin"}
            </p>
            <p className="text-xs text-primary mt-1">
              {user?.role || "Manager"}
            </p>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-7xl mx-auto"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}