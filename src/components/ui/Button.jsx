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
        inline-flex items-center justify-center
        px-4
        rounded-lg
        bg-primary
        text-white
        text-base sm:text-lg
        font-semibold
        text-center
        cursor-pointer
        hover:opacity-90
        transition
        disabled:cursor-not-allowed disabled:opacity-60
        ${className}
      `}
    >
      {children}
    </button>
  );
}
