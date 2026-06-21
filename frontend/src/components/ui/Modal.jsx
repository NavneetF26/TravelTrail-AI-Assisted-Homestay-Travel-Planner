import { useEffect, useRef } from "react";

/**
 * Modal Component
 *
 * Popup window.
 *
 * Props:
 * - isOpen
 * - onClose
 * - title
 * - children
 */

function Modal({ isOpen, onClose, title, children }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Focus the modal when it opens
    modalRef.current?.focus();

    const handleKeyDown = (e) => {
      // Close on Escape
      if (e.key === "Escape") {
        onClose();
      }

      // Trap focus with Tab
      if (e.key === "Tab") {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, input, textarea, select, a[href], [tabindex]:not([tabindex="-1"])',
        );

        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="bg-sky-50 p-6 rounded-lg w-96 shadow-lg"
      >
        <h2 className="text-xl font-bold mb-4 text-black">{title}</h2>

        {children}

        <button
          onClick={onClose}
          className="mt-6 bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default Modal;
