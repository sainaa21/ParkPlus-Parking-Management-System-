import { useQuery } from "@tanstack/react-query";

export function useActiveVehicles() {
  return useQuery({
    queryKey: ["active-vehicles"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5003/api/vehicles/active");

      if (!res.ok) throw new Error("Failed");

      return res.json();
    },
  });
}