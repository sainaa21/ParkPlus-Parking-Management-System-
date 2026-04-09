import { useQuery } from "@tanstack/react-query";

export function usePreviewAmount(vehicleId) {
  return useQuery({
    queryKey: ["preview", vehicleId],
    queryFn: async () => {
      if (!vehicleId) return null;

      const res = await fetch(
        `http://localhost:5003/api/vehicles/preview/${vehicleId}`
      );

      if (!res.ok) throw new Error("Failed");

      return res.json();
    },
    enabled: !!vehicleId,
  });
}