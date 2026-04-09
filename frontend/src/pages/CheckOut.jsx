import { Layout } from "../components/Layout";
import { useState } from "react";
import { useCheckOut } from "../hooks/use-operations";
import { usePreviewAmount } from "../hooks/usePreviewAmount";
import { useActiveVehicles } from "../hooks/useActiveVehicles";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Search,
  CreditCard,
  Clock,
  Receipt,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

export default function CheckOut() {
  const [search, setSearch] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const { data: vehicles, isLoading } = useActiveVehicles();
  const { data: preview } = usePreviewAmount(selectedVehicle?.id);
  const checkOut = useCheckOut();

  const handleCheckOut = () => {
    if (!selectedVehicle) return;

    checkOut.mutate(
      {
        vehicle_id: selectedVehicle.id,
      },
      {
        onSuccess: () => {
          setSearch("");
          setSelectedVehicle(null);
        },
      }
    );
  };

  // ✅ SAFE FILTER (prevents crash)
  const filteredVehicles = Array.isArray(vehicles)
    ? vehicles.filter((v) =>
        v.vehicle_number
          ?.toLowerCase()
          .includes(search.toLowerCase())
      )
    : [];

  return (
    <Layout>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Check-Out & Payment
          </h2>
          <p className="text-white/50">
            Process payments and release vehicles.
          </p>
        </div>

        {/* Search */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Vehicle Number..."
              className="glass-input pl-12 h-14 text-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vehicles List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white/80 px-1">
              Active Vehicles
            </h3>

            {isLoading ? (
              <div className="text-white/40 text-sm">Loading...</div>
            ) : filteredVehicles.length === 0 ? (
              <div className="glass-card p-8 rounded-2xl text-center text-white/30 border-dashed">
                No active vehicles found
              </div>
            ) : (
              filteredVehicles.map((vehicle) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => setSelectedVehicle(vehicle)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedVehicle?.id === vehicle.id
                      ? "bg-primary/20 border-primary/50 shadow-lg shadow-primary/10"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-white">
                      {vehicle.vehicle_number}
                    </span>
                    <span className="text-xs bg-white/10 px-2 py-1 rounded text-white/60">
                      #{vehicle.id}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm text-white/50">
                    <span>Car</span>
                    <span>Slot: {vehicle.slot_id}</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Payment Panel */}
          <AnimatePresence mode="wait">
            {selectedVehicle ? (
              <motion.div
                key="details"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card p-8 rounded-2xl border-white/10 h-fit sticky top-24"
              >
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Receipt className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Payment Details
                    </h3>
                    <p className="text-white/50 text-sm">
                      Review before processing
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {/* Check-in time */}
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Check-in Time
                    </span>
                    <span className="text-white font-mono">
                      {selectedVehicle?.entry_time
                        ? format(
                            new Date(selectedVehicle.entry_time),
                            "HH:mm dd/MM"
                          )
                        : "-"}
                    </span>
                  </div>

                  {/* Rate */}
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" /> Rate
                    </span>
                    <span className="text-white font-mono">
                      ₹20/hr
                    </span>
                  </div>

                  {/* Amount */}
                  <div className="p-4 bg-white/5 rounded-xl flex justify-between items-center mt-4">
                    <span className="text-lg font-medium text-white">
                      Total Amount
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      ₹{preview?.amount ?? 0}
                    </span>
                  </div>

                  {/* Duration */}
                  <p className="text-xs text-center text-white/30">
                    Duration: {preview?.duration ?? 0} hrs
                  </p>
                </div>

                <Button
                  onClick={handleCheckOut}
                  disabled={checkOut.isPending}
                  className="w-full h-14 text-lg bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-900/20"
                >
                  {checkOut.isPending
                    ? "Processing..."
                    : "Confirm Payment & Exit"}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center text-white/30 h-64 border-2 border-dashed border-white/10 rounded-2xl"
              >
                <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
                <p>Select a vehicle to proceed</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}