/**
 * Button Component
 *
 * Props:
 * - children: Button text/content
 * - variant: primary | secondary | outline
 * * - size: sm | md | lg
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
      "border border-sky-600 text-sky-600 hover:bg-sky-100 dark:border-sky-300 dark:text-sky-300 dark:hover:bg-gray-800 dark:hover:text-sky-100",
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
