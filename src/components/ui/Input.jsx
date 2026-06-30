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
  disabled,
  required = false,
  badge = "",
  wrapperClassName = "",
  labelClassName = "",
  inputClassName = "",
}) {
  const hasError = error && touched;

  return (
    <div className={`mb-2 ${wrapperClassName}`}>
      <label className={`flex items-center mb-1.5 text-sm font-semibold ${labelClassName || "text-text"}`}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {badge && (
          <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-medium">
            {badge}
          </span>
        )}
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
          disabled={disabled}
          className={`
            w-full h-12 pr-4
            ${leftIcon ? "pl-12" : "pl-4"}
            border rounded-lg text-base
            placeholder:text-gray-400
            focus:outline-none focus:ring-2
            ${hasError
              ? "border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-200"
              : `${inputClassName || "border-gray-300"} focus:border-primary focus:ring-primary/20`
            }
          `}
        />
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-gray-400 cursor-pointer">
            {rightIcon}
          </span>
        )}
      </div>

      <div>
        <FieldError error={error} touched={touched} />
      </div>
    </div>
  );
}