import { cn } from "../lib/utils";

export function StatsCard({ title, value, icon: Icon, trend, color = "default" }) {
  const colorStyles = {
    default: "bg-white/5 border-white/10 text-white",
    primary: "bg-primary/20 border-primary/20 text-white shadow-[0_0_30px_rgba(239,68,68,0.15)]",
    success: "bg-emerald-500/20 border-emerald-500/20 text-white shadow-[0_0_30px_rgba(16,185,129,0.15)]",
    warning: "bg-amber-500/20 border-amber-500/20 text-white shadow-[0_0_30px_rgba(245,158,11,0.15)]",
  };

  const iconStyles = {
    default: "text-white/50 bg-white/10",
    primary: "text-primary bg-primary/10",
    success: "text-emerald-500 bg-emerald-500/10",
    warning: "text-amber-500 bg-amber-500/10",
  };

  return (
    <div
      className={cn(
        "rounded-2xl p-6 backdrop-blur-xl border transition-all hover:scale-[1.02]",
        colorStyles[color]
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-white/60 mb-1">{title}</p>
          <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
          {trend && <p className="text-xs mt-2 text-white/40">{trend}</p>}
        </div>
        <div className={cn("p-3 rounded-xl", iconStyles[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}