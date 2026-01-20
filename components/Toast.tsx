import { Toast } from "@/lib/hooks/useToast";
import { cn } from "@/lib/utils";

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "px-4 py-3 rounded-md shadow-md text-white animate-pulse",
            toast.type === "success" && "bg-green-500",
            toast.type === "error" && "bg-red-500",
            toast.type === "info" && "bg-blue-500"
          )}
        >
          <div className="flex items-center justify-between">
            <span>{toast.message}</span>
            <button
              onClick={() => onRemove(toast.id)}
              className="ml-4 text-white hover:opacity-75"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
