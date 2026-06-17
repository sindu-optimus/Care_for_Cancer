import { useState, useEffect } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const WEEKDAYS = [
  "Su",
  "Mo",
  "Tu",
  "We",
  "Th",
  "Fr",
  "Sa",
];

export default function Calendar({
  value,
  onSelect,
  showTime = false,
  minDate = null,
  maxDate = null,
}) {
  const selectedDate = value
    ? new Date(value)
    : new Date();

  const [viewDate, setViewDate] = useState(
    selectedDate
  );
  const initialDate = value
  ? new Date(value)
  : new Date();

  const now = new Date();

  const [hours, setHours] = useState(
    value
      ? String(initialDate.getHours()).padStart(2, "0")
      : String(now.getHours()).padStart(2, "0")
  );

  const [minutes, setMinutes] = useState(
    value
      ? String(initialDate.getMinutes()).padStart(2, "0")
      : String(now.getMinutes()).padStart(2, "0")
  );

  const [seconds, setSeconds] = useState(
    value
      ? String(initialDate.getSeconds()).padStart(2, "0")
      : String(now.getSeconds()).padStart(2, "0")
  );

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const [yearInput, setYearInput] = useState(String(year));

  useEffect(() => {
    setYearInput(String(year));
  }, [year]);

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const firstDay = new Date(
    year,
    month,
    1
  ).getDay();

  const [selectedDay, setSelectedDay] = useState(
    value ? new Date(value).getDate() : null
  );

  const handleDateSelect = (day) => {
    setSelectedDay(day);

    if (!showTime) {
      const formatted = `${year}-${String(
        month + 1
      ).padStart(2, "0")}-${String(day).padStart(
        2,
        "0"
      )}`;

      onSelect(formatted);
    }
  };

  const handleDone = () => {
    if (!selectedDay) return;

    const formatted = `${year}-${String(
      month + 1
    ).padStart(2, "0")}-${String(
      selectedDay
    ).padStart(2, "0")}T${String(
      Math.min(18, Math.max(8, Number(hours || 8)))
    ).padStart(2, "0")}:${String(
      Math.min(59, Math.max(0, Number(minutes || 0)))
    ).padStart(2, "0")}:${String(
      Math.min(59, Math.max(0, Number(seconds || 0)))
    ).padStart(2, "0")}`;

    console.log("Selected DateTime:", formatted);

    onSelect(formatted);
  };

  const totalMinutes =
    Number(hours || 0) * 60 +
    Number(minutes || 0);

  const isInvalidTime =
    totalMinutes < 8 * 60 ||
    totalMinutes > 18 * 60;

  const timeError =
    isInvalidTime
      ? "Meeting time must be between 08:00 and 18:00"
      : "";

  return (
  <div className="absolute right-0 z-50 w-70 bg-white border border-gray-300 rounded-lg shadow-lg p-3">

    {/* Header */}
    <div className="flex items-center justify-between text-gray-400 mb-2">
      <button
        type="button"
        onClick={() => {
          const prevMonth = new Date(year, month - 1, 1);

          if (
            !minDate ||
            prevMonth >= new Date(
              minDate.getFullYear(),
              minDate.getMonth(),
              1
            )
          ) {
            setViewDate(prevMonth);
          }
        }}
      >
        <FaChevronLeft />
      </button>

      <div className="flex items-center gap-2 min-w-0">
        <span className="font-semibold text-primary">
          {viewDate.toLocaleString("default", {
            month: "long",
          })}
        </span>

        <input
          type="number"
          value={yearInput}
          min={1900}
          max={2100}
          onChange={(e) => {
            setYearInput(e.target.value);
          }}
          onBlur={() => {
            const newYear = Number(yearInput);

            if (newYear >= 1900 && newYear <= 2100) {
              setViewDate(new Date(newYear, month, 1));
            } else {
              setYearInput(String(year));
            }
          }}
          className="w-16 border border-primary rounded p-0.5 text-sm text-primary font-semibold focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <button
        type="button"
        onClick={() =>
          setViewDate(new Date(year, month + 1, 1))
        }
      >
        <FaChevronRight />
      </button>
    </div>

    {/* Weekdays */}
    <div className="grid grid-cols-7 mb-1">
      {WEEKDAYS.map((day) => (
        <div
          key={day}
          className="text-center text-xs font-semibold text-text"
        >
          {day}
        </div>
      ))}
    </div>

    {/* Days */}
    <div className="grid grid-cols-7 gap-1">
      {Array(firstDay)
        .fill(null)
        .map((_, index) => (
          <div key={index} />
        ))}

      {Array.from(
        { length: daysInMonth },
        (_, i) => i + 1
      ).map((day) => {
        const isSelected = selectedDay === day;

        const today = new Date();

        const isToday =
          today.getDate() === day &&
          today.getMonth() === month &&
          today.getFullYear() === year;

        const currentDate = new Date(year, month, day);
          currentDate.setHours(0, 0, 0, 0);

        const min = minDate
          ? new Date(minDate)
          : null;

        const max = maxDate
          ? new Date(maxDate)
          : null;

        if (min) {
          min.setHours(0, 0, 0, 0);
        }

        if (max) {
          max.setHours(0, 0, 0, 0);
        }

        const isDisabled =
          (min && currentDate < min) ||
          (max && currentDate > max);

        return (
          <button
            key={day}
            type="button"
            disabled={isDisabled}
            onClick={() =>
              !isDisabled &&
              handleDateSelect(day)
            }
            className={`
              h-7 w-7 rounded-md text-sm font-medium transition-colors
              ${
                isDisabled
                  ? "text-gray-300 cursor-not-allowed"
                  : isSelected
                  ? "bg-primary text-white"
                  : isToday
                  ? "border-2 border-primary text-gray-500"
                  : "text-gray-500 hover:bg-slate-100"
              }
            `}
          >
            {day}
          </button>
        );
      })}
    </div>

    {/* Time Section */}
    {showTime && (
      <div className="border-t border-gray-200 pt-2">
        <p className="text-xs text-gray-600 mb-3">
          TIME
        </p>
        <p className="text-xs text-gray-500 mb-2">
          Meeting hours: 08:00 - 18:00
        </p>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {/* Hours */}
          <div>
            <p className="text-[10px] text-gray-600 mb-1">
              HH
            </p>

            <input
              type="number"
              min="8"
              max="18"
              step="1"
              value={hours}
              onChange={(e) =>
                setHours(e.target.value)
              }
              onBlur={() =>
                setHours(
                  String(
                    Math.min(
                      18,
                      Math.max(8, Number(hours || 8)
                      )
                    )
                  ).padStart(2, "0")
                )
              }
              className="w-12 h-8 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <span className="mt-4 font-semibold">
            :
          </span>

          {/* Minutes */}
          <div>
            <p className="text-[10px] text-gray-600 mb-1">
              MM
            </p>

            <input
              type="number"
              min="0"
              max="59"
              step="1"
              value={minutes}
              onChange={(e) =>
                setMinutes(e.target.value)
              }
              onBlur={() =>
                setMinutes(
                  String(
                    Math.min(
                      59,
                      Math.max(
                        0,
                        Number(minutes || 0)
                      )
                    )
                  ).padStart(2, "0")
                )
              }
              className="w-12 h-8 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <span className="mt-4 font-semibold">
            :
          </span>

          {/* Seconds */}
          <div>
            <p className="text-[10px] text-gray-600 mb-1">
              SS
            </p>

            <input
              type="number"
              min="0"
              max="59"
              step="1"
              value={seconds}
              onChange={(e) =>
                setSeconds(e.target.value)
              }
              onBlur={() =>
                setSeconds(
                  String(
                    Math.min(
                      59,
                      Math.max(
                        0,
                        Number(seconds || 0)
                      )
                    )
                  ).padStart(2, "0")
                )
              }
              className="w-12 h-8 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {timeError && (
          <p className="mt-2 text-xs text-red-500">
            {timeError}
          </p>
        )}

        <button
          type="button"
          onClick={handleDone}
          disabled={isInvalidTime}
          className={`w-full mt-2 h-11 rounded-lg font-semibold
            ${
              isInvalidTime
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-primary text-white hover:opacity-90"
            }`}
        >
          Done
        </button>
      </div>
    )}
  </div>
);
}
