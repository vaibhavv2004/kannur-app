function Button({
  children,
  type = "button",
  variant = "primary",
  onClick,
  className = "",
}) {
  const variants = {
    primary:
      "bg-blue-800 text-white hover:bg-blue-900",
    secondary:
      "bg-green-700 text-white hover:bg-green-800",
    outline:
      "border border-blue-800 text-blue-800 hover:bg-blue-50",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        px-6
        py-3
        rounded-lg
        font-medium
        transition-all
        duration-300
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export default Button;