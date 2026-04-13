import { useSlots } from "../hooks/use-slots";
import { cn } from "../lib/utils";
import { Car, Bike, Truck, Accessibility } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function SlotMap() {
  const { data: slots, isLoading } = useSlots();
  const [filter, setFilter] = useState("All");

  const vehicleIcons = {
    Car: Car,
    Bike: Bike,
    Truck: Truck,
    SUV: Car,
    Handicap: Accessibility,
    "EV Charging": Car,
    Bicycle: Bike,
    Scooter: Bike,
  };

  const filteredSlots =
    slots?.filter((slot) =>
      filter === "All" ? true : slot.slotType === filter
    ) || [];

  const slotTypes = ["All", ...(new Set(slots?.map((s) => s.slotType) || []))];

  return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Parking Map
            </h2>
            <p className="text-white/50">
              Visual representation of parking deck G.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {slotTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                  filter === type
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-white/60 border-white/10 hover:border-white/30"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-white/5 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {filteredSlots.map((slot, i) => {
              // ✅ FIX: normalize status
              const status = slot.status?.toLowerCase();
              const isAvailable = status === "available";

              const Icon = vehicleIcons[slot.slotType] || Car;

              return (
                <motion.div
                  key={slot.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className={cn(
                    "aspect-square rounded-2xl border p-4 flex flex-col items-center justify-between relative overflow-hidden group transition-all duration-300",
                    isAvailable
                      ? "bg-emerald-900/10 border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-900/20 cursor-pointer"
                      : "bg-red-900/10 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                  )}
                >
                  <div className="flex w-full justify-between items-start">
                    <span
                      className={cn(
                        "text-xs font-bold px-2 py-1 rounded-md",
                        isAvailable
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-red-500/20 text-red-400"
                      )}
                    >
                      {slot.slotNumber}
                    </span>
                  </div>

                  <div
                    className={cn(
                      "flex-1 flex items-center justify-center transition-transform duration-300",
                      isAvailable
                        ? "scale-75 opacity-50 group-hover:scale-90 group-hover:opacity-100"
                        : "scale-100"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-10 h-10",
                        isAvailable
                          ? "text-emerald-500"
                          : "text-red-500"
                      )}
                    />
                  </div>

                  <div className="text-center w-full">
                    <p className="text-[10px] uppercase tracking-wider text-white/40 font-medium truncate">
                      {slot.slotType}
                    </p>
                  </div>

                  {!isAvailable && (
                    <div className="absolute inset-0 bg-red-500/5 pointer-events-none" />
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
  );
}