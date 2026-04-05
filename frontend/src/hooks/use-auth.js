import { useMutation } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import { useLocation } from "wouter";

export function useLogin() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async (credentials) => {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401)
          throw new Error("Invalid username or password");
        throw new Error("Login failed");
      }

      return res.json();
    },

    onSuccess: (data) => {
      toast({
        title: "Welcome back",
        description: `Logged in as ${data.name}`,
      });

      localStorage.setItem("parking_user", JSON.stringify(data));
      setLocation("/dashboard");
    },

    onError: (error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useLogout() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  return () => {
    localStorage.removeItem("parking_user");
    toast({ title: "Logged out", description: "See you next time" });
    setLocation("/");
  };
}

export function useUser() {
  const userStr = localStorage.getItem("parking_user");

  try {
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
}