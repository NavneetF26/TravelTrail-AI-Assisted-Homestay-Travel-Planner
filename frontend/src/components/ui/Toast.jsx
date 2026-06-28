import { useEffect } from "react";

/**
 * Toast Component
 *
 * Props:
 * - message
 * - variant: success | error | warning | info
 * - onClose
 */

function Toast({ message, variant = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const variants = {
    success: "bg-green-600",
    error: "bg-red-600",
    warning: "bg-amber-500",
    info: "bg-sky-600",
  };

  return (
    <div
      className={`
        fixed top-5 right-5
        flex items-center gap-4
        z-9999
        px-4 py-3
        rounded-lg
        text-white
        shadow-lg
        ${variants[variant]}
      `}
    >
      <span>{message}</span>

      <button onClick={onClose} className="font-bold hover:opacity-75">
        ×
      </button>
    </div>
  );
}

export default Toast;
