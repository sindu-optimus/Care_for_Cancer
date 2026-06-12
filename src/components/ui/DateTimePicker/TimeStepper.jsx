import { useState, useRef, useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";

import Calendar from "./Calendar";
import FieldError from "../FieldError";

export default function DateTimePicker({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder = "Select Date",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const formatDisplay = () => {
    if (!value) return "";

    return new Date(value).toLocaleDateString(
      "en-GB"
    );
  };

  return (
    <div className="mb-4" ref={pickerRef}>
      <label className="block mb-2 text-text font-semibold">
        {label}
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full h-12 px-4
            border rounded-lg
            flex items-center justify-between
            bg-white
            ${
              error && touched
                ? "border-red-400 bg-red-50"
                : "border-gray-300"
            }
          `}
        >
          <span
            className={
              value
                ? "text-text"
                : "text-gray-400"
            }
          >
            {formatDisplay() || placeholder}
          </span>

          <FaCalendarAlt className="text-gray-400" />
        </button>

        {isOpen && (
          <Calendar
            value={value}
            onSelect={(date) => {
              onChange({
                target: {
                  name,
                  value: date,
                },
              });

              onBlur?.({
                target: { name },
              });

              setIsOpen(false);
            }}
          />
        )}
      </div>

      <div className="min-h-4">
        <FieldError
          error={error}
          touched={touched}
        />
      </div>
    </div>
  );
}