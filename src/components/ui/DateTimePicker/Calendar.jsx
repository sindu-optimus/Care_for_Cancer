import { useState } from "react";
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

  const [hours, setHours] = useState(
    String(initialDate.getHours()).padStart(2, "0")
  );

  const [minutes, setMinutes] = useState(
    String(initialDate.getMinutes()).padStart(2, "0")
  );

  const [seconds, setSeconds] = useState(
    String(initialDate.getSeconds()).padStart(2, "0")
  );

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

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
      Math.min(23, Math.max(0, Number(hours || 0)))
    ).padStart(2, "0")}:${String(
      Math.min(59, Math.max(0, Number(minutes || 0)))
    ).padStart(2, "0")}:${String(
      Math.min(59, Math.max(0, Number(seconds || 0)))
    ).padStart(2, "0")}`;

    console.log("Selected DateTime:", formatted);

    onSelect(formatted);
  };

  return (
  <div className="absolute z-50 w-80 bg-white border border-gray-300 rounded-xl shadow-xl p-4">

    {/* Header */}
    <div className="flex items-center justify-between text-gray-400 mb-4">
      <button
        type="button"
        onClick={() =>
          setViewDate(new Date(year, month - 1, 1))
        }
      >
        <FaChevronLeft />
      </button>

      <div className="flex items-center gap-2">
        <span className="font-semibold text-primary">
          {viewDate.toLocaleString("default", {
            month: "long",
          })}
        </span>

        <input
          type="number"
          value={year}
          min={1900}
          max={2100}
          onChange={(e) =>
            setViewDate(
              new Date(
                Number(e.target.value),
                month,
                1
              )
            )
          }
          className="w-20 border border-primary rounded px-2 py-1 text-sm text-primary font-semibold focus:outline-none focus:ring-2 focus:ring-blue-200"
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
    <div className="grid grid-cols-7 mb-2">
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

        return (
          <button
            key={day}
            type="button"
            onClick={() =>
              handleDateSelect(day)
            }
            className={`
              h-9 w-9 rounded-md text-sm font-medium transition-colors
              ${
                isSelected
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
      <div className="border-t border-gray-200 mt-4 pt-4">
        <p className="text-xs text-gray-400 mb-3">
          TIME
        </p>

        <div className="flex items-center gap-2">
          {/* Hours */}
          <div>
            <p className="text-[10px] text-gray-400 mb-1">
              HH
            </p>

            <input
              type="number"
              min="0"
              max="23"
              step="1"
              value={hours}
              onChange={(e) =>
                setHours(e.target.value)
              }
              onBlur={() =>
                setHours(
                  String(
                    Math.min(
                      23,
                      Math.max(
                        0,
                        Number(hours || 0)
                      )
                    )
                  ).padStart(2, "0")
                )
              }
              className="w-16 h-10 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <span className="mt-4 font-semibold">
            :
          </span>

          {/* Minutes */}
          <div>
            <p className="text-[10px] text-gray-400 mb-1">
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
              className="w-16 h-10 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <span className="mt-4 font-semibold">
            :
          </span>

          {/* Seconds */}
          <div>
            <p className="text-[10px] text-gray-400 mb-1">
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
              className="w-16 h-10 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleDone}
          className="w-full mt-4 h-11 bg-primary text-white rounded-lg font-semibold hover:opacity-90"
        >
          Done
        </button>
      </div>
    )}
  </div>
);
}