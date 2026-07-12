/**
 * Button Component
 *
 * Props:
 * - children: Button text/content
 * - variant: primary | secondary | outline | danger
 * - size: sm | md | lg
 * - disabled: true | false
 * - onClick: function
 */

function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
}) {
  const variants = {
    primary:
      "bg-teal-700 text-white hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700",
    secondary:
      "bg-violet-500 text-white hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-700",
    outline:
      "border border-teal-800 text-teal-700 hover:text-white hover:bg-teal-700 dark:border-teal-300 dark:text-teal-300 dark:hover:bg-teal-800 dark:hover:text-white",
    danger:
      "bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700",
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-lg font-medium transition
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {children}
    </button>
  );
}

export default Button;
