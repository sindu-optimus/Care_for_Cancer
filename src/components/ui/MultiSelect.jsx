import { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import FieldError from "./FieldError";

export default function MultiSelect({
  label,
  options = [],
  selectedValues = [],
  onChange,
  placeholder = "Select Options",
  error,
  touched,
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const hasError = error && touched;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = (value) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((item) => item !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const selectedLabels = options
    .filter((option) => selectedValues.includes(option.value))
    .map((option) => option.label);

  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 font-semibold text-text">
          {label}
        </label>
      )}
      <div className="w-full" ref={dropdownRef}>
        {/* Trigger */}
        <div
          onClick={() => setOpen(!open)}
          className={`w-full h-12 px-4 border rounded-lg flex items-center justify-between cursor-pointer bg-white
            ${hasError
              ? "border-red-400 bg-red-50"
              : "border-gray-300"
            }`}
        >
          <span className={`truncate ${selectedLabels.length ? "text-slate-700" : "text-gray-500"}`}>
            {selectedLabels.length ? selectedLabels.join(", ") : placeholder}
          </span>
          <FaChevronDown
            className={`text-gray-400 transition-transform shrink-0 ${open ? "rotate-180" : ""}`}
          />
        </div>

        {/* Dropdown — inline */}
        {open && (
          <div className="mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-56 overflow-y-auto">
            {options.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
                  onChange={() => handleToggle(option.value)}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-slate-700">{option.label}</span>
              </label>
            ))}
          </div>
        )}

        {/* Error */}
        <div className="min-h-4">
          <FieldError error={error} touched={touched} />
        </div>
      </div>
    </div>
  );
}