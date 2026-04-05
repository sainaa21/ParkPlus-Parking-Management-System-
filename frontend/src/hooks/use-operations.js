import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";

export function useCheckIn() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data) => {
      const res = await fetch("http://localhost:5000/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 409)
          throw new Error("Slot occupied or vehicle already checked in");
        throw new Error("Check-in failed");
      }

      return res.json();
    },

    onSuccess: (data) => {
      toast({
        title: "Check-in Successful",
        description: `Ticket #${data?.ticket?.id}`,
      });

      queryClient.invalidateQueries({ queryKey: ["slots"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },

    onError: (error) => {
      toast({
        title: "Check-in Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useSearchTickets(query) {
  return useQuery({
    queryKey: ["tickets", query],
    queryFn: async () => {
      if (!query) return [];

      const res = await fetch(
        `http://localhost:5000/api/tickets?query=${encodeURIComponent(query)}`,
        { credentials: "include" }
      );

      if (!res.ok) throw new Error("Search failed");
      return res.json();
    },
    enabled: query.length > 0,
  });
}

export function useTicketDetails(id) {
  return useQuery({
    queryKey: ["ticket", id],
    queryFn: async () => {
      if (!id) return null;

      const res = await fetch(
        `http://localhost:5000/api/tickets/${id}`,
        { credentials: "include" }
      );

      if (!res.ok) throw new Error("Ticket not found");
      return res.json();
    },
    enabled: !!id,
  });
}

export function useCheckOut() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data) => {
      const res = await fetch("http://localhost:5000/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Check-out failed");
      return res.json();
    },

    onSuccess: (data) => {
      toast({
        title: "Check-out Successful",
        description: `Payment processed`,
      });

      queryClient.invalidateQueries({ queryKey: ["slots"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },

    onError: (error) => {
      toast({
        title: "Check-out Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function usePayments() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/api/payments", {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch payments");
      return res.json();
    },
  });
}