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
  showTime = false,
  minDate = null,
  maxDate = null,
  required = false,
  labelClassName = "",
  triggerClassName = "",
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

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    if (showTime) {
      return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    }

    return date.toLocaleDateString("en-GB");
  };

  const handleDateSelect = (date) => {
    onChange?.({
      target: {
        name,
        value: date,
      },
    });

    setIsOpen(false);
  };

  return (
    <div ref={pickerRef}>
      <label className={`block mb-1.5 text-sm font-semibold ${labelClassName || "text-text"}`}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative cursor-pointer">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`
            w-full h-12 px-4
            border rounded-lg
            flex items-center justify-between cursor-pointer
            ${
              error && touched
                ? "border-red-400 bg-red-50"
                : `${triggerClassName || "border-gray-300"}`
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
            onSelect={handleDateSelect}
            showTime={showTime}
            minDate={minDate}
            maxDate={maxDate}
          />
        )}
      </div>
      
      <div>
        <FieldError
          error={error}
          touched={touched}
        />
      </div>
    </div>
  );
}