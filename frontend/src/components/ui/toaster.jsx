import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <ToastProvider>
      <ToastViewport />
      {toasts.map(function (toast) {
        return (
          <Toast key={toast.id} open={toast.open} onOpenChange={(open) => {
            if (!open) dismiss(toast.id);
          }}>
            <div className="grid gap-1">
              {toast.title ? <ToastTitle>{toast.title}</ToastTitle> : null}
              {toast.description ? <ToastDescription>{toast.description}</ToastDescription> : null}
            </div>
            <ToastClose />
          </Toast>
        );
      })}
    </ToastProvider>
  );
}
