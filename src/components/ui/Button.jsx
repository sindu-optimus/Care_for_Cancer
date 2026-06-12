export default function Button({
  children,
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      {...props}
      className={`
        h-12
        rounded-lg
        bg-primary
        text-white
        text-lg
        font-semibold
        hover:opacity-90
        transition
        ${className}
      `}
    >
      {children}
    </button>
  );
}