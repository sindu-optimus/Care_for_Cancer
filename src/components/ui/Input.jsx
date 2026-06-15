import FieldError from "./FieldError";

export default function Input({
  label,
  name,
  type,
  placeholder,
  leftIcon,
  rightIcon,
  value,
  onChange,
  onBlur,
  error,
  touched,
  maxLength,
}) {
  const hasError = error && touched;

  return (
    <div className="mb-2 md-mb-4">
      <label className="block mb-2 text-text font-semibold">
        {label}
      </label>
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-400">
            {leftIcon}
          </span>
        )}
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          maxLength={maxLength}
          className={`
            w-full h-12 pr-4
            ${leftIcon ? "pl-12" : "pl-4"}
            border rounded-lg text-base
            placeholder:text-gray-400
            focus:outline-none focus:ring-2
            ${hasError
              ? "border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-200"
              : "border-gray-300 focus:border-primary focus:ring-primary/20"
            }
          `}
        />
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-gray-400 cursor-pointer">
            {rightIcon}
          </span>
        )}
      </div>

      <div className="min-h-4">
        <FieldError error={error} touched={touched} />
      </div>
    </div>
  );
}