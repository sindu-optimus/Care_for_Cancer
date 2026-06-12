import { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import FieldError from "./FieldError";

export default function Select({
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select",
  error,
  touched,
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const hasError = error && touched;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find((o) => String(o.value) === String(value))?.label;

  const handleSelect = (optionValue) => {
    onChange({ target: { name, value: optionValue } });
    setOpen(false);
  };

  return (
    <div className="w-full" ref={dropdownRef}>
      {/* Trigger */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full h-12 px-4 border rounded-lg flex items-center justify-between cursor-pointer bg-white
          ${hasError
            ? "border-red-400 bg-red-50"
            : "border-gray-300"
          }`}
      >
        <span className={selectedLabel ? "text-slate-700" : "text-gray-500"}>
          {selectedLabel || placeholder}
        </span>
        <FaChevronDown
          className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </div>

      {/* Dropdown — inline */}
      {open && (
        <div className="mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-56 overflow-y-auto">
          <div
            onClick={() => handleSelect("")}
            className="px-4 py-2 text-gray-400 hover:bg-slate-50 cursor-pointer"
          >
            {placeholder}
          </div>
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`px-4 py-2 cursor-pointer hover:bg-slate-50
                ${String(option.value) === String(value)
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-slate-700"
                }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      <div className="min-h-4">
        <FieldError error={error} touched={touched} />
      </div>
    </div>
  );
}