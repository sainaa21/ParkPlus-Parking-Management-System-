import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useSlots() {
  return useQuery({
    queryKey: ["slots"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/api/slots", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch slots");
      return res.json();
    },
  });
}

export function useCreateSlot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await fetch("http://localhost:5000/api/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to create slot");
      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slots"] });
    },
  });
}

export function useUpdateSlot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const res = await fetch(
        `http://localhost:5000/api/slots/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Failed to update slot");
      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slots"] });
    },
  });
}