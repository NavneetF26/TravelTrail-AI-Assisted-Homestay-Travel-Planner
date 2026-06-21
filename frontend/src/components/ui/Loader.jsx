/**
 * Loader Component
 *
 * Props:
 * - text (optional)
 */

function Loader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-6">
      {/* Spinner */}
      <div className="w-10 h-10 border-4 border-sky-300 border-t-gray-900 rounded-full animate-spin"></div>

      {/* Loading Text */}
      <p className="text-gray-700 font-medium">{text}</p>
    </div>
  );
}

export default Loader;
