import { usePayments } from "../hooks/use-operations";

export default function Payments() {
  const { data: payments, isLoading, error } = usePayments();

  return (
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-3xl text-white font-bold">Payments</h2>

        {/* Loading */}
        {isLoading && (
          <p className="text-white/50">Loading payments...</p>
        )}

        {/* Error */}
        {error && (
          <p className="text-red-500">Failed to load payments</p>
        )}

        {/* Data */}
        {!isLoading && payments?.length === 0 && (
          <p className="text-white/50">No payments found</p>
        )}

        {payments?.map((p) => (
          <div
            key={p.id}
            className="p-4 bg-white/5 rounded-xl border border-white/10"
          >
            <div className="flex justify-between">
              <span className="text-white font-bold">
                {p.vehicle_number}
              </span>
              <span className="text-primary font-bold">
                ₹{p.amount}
              </span>
            </div>

            <div className="text-white/60 text-sm mt-1">
              Duration: {p.duration} hr
            </div>

            <div className="text-white/40 text-xs mt-1">
              {new Date(p.payment_time).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
  );
}