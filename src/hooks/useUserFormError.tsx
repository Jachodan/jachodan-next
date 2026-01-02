import { type FieldErrors } from "react-hook-form";
import { toast } from "sonner";

interface ToastConfig {
  title?: string;
  duration?: number;
}

export function useUserFormError<T extends Record<string, unknown>>(config?: ToastConfig) {
  const showErrors = (errors: FieldErrors<T>) => {
    const errorMessages = Object.values(errors)
      .map((error) => error?.message)
      .filter((msg): msg is string => typeof msg === "string");

    if (errorMessages.length === 0) return;

    toast.error(config?.title || "입력 정보를 확인해주세요", {
      description: (
        <ul className="mt-2 space-y-1">
          {errorMessages.map((message, index) => (
            <li key={index} className="text-sm">
              • {message}
            </li>
          ))}
        </ul>
      ),
      duration: config?.duration || 5000,
    });
  };

  return { showErrors };
}
