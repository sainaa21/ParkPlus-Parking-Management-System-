import { StatsCard } from "../components/StatsCard";
import { useDashboard } from "../hooks/use-dashboard"; 
import {
  Car,
  CheckCircle2,
  CircleDollarSign,
  ParkingSquare,
} from "lucide-react";
import { Link } from "wouter";
import { cn } from "../lib/utils";

const quickActions = [
  {
    label: "New Check-In",
    href: "/checkin",
    color: "bg-emerald-500/20 text-emerald-500 border-emerald-500/20",
  },
  {
    label: "Check-Out",
    href: "/checkout",
    color: "bg-amber-500/20 text-amber-500 border-amber-500/20",
  },
  {
    label: "View Map",
    href: "/map",
    color: "bg-blue-500/20 text-blue-500 border-blue-500/20",
  },
  {
    label: "Add Employee",
    href: "/employees",
    color: "bg-purple-500/20 text-purple-500 border-purple-500/20",
  },
];

export default function Dashboard() {
  const { data: stats, isLoading } = useDashboard(); // ✅ correct hook

  if (isLoading) {
    return (
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-48 bg-white/10 rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-white/5 rounded-2xl"></div>
            ))}
          </div>
        </div>
    );
  }

  return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Dashboard Overview
          </h2>
          <p className="text-white/50">
            Welcome to the parking control center.
          </p>
        </div>

        {/* ✅ FIXED DATA MAPPING */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Slots"
            value={stats?.total || 0}
            icon={ParkingSquare}
            color="default"
          />

          <StatsCard
            title="Free Slots"
            value={stats?.available || 0}
            icon={CheckCircle2}
            color="success"
            trend={`${Math.round(
              ((stats?.available || 0) / (stats?.total || 1)) * 100
            )}% Available`}
          />

          <StatsCard
            title="Occupied"
            value={stats?.occupied || 0}
            icon={Car}
            color="warning"
          />

          <StatsCard
            title="Today's Revenue"
            value={`₹${stats?.revenue || 0}`}
            icon={CircleDollarSign}
            color="primary"
            trend="Gross income"
          />
        </div>

        {/* Quick Actions + Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <Link key={action.href} href={action.href}>
                  <div
                    className={cn(
                      "p-4 rounded-xl border transition-all cursor-pointer hover:scale-[1.02] flex items-center justify-center font-medium h-24 text-center",
                      action.color
                    )}
                  >
                    {action.label}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Car className="w-8 h-8 text-white/40" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              System Status
            </h3>
            <p className="text-white/50 text-sm max-w-xs">
              System is running optimally. All payment gateways are connected.
            </p>
          </div>
        </div>
      </div>
  );
}