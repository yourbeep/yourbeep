import { CalendarDays } from "lucide-react";
import { formatPickerLongDate, parseYmdToLocalDate } from "../../utils/dateFormat";

type DatePickerProps = {
  value: string;
  onChange: (ymd: string) => void;
  minDate?: Date;
  name?: string;
  className?: string;
};

function toMinValue(value?: Date) {
  if (!value) return undefined;
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function DatePicker({
  value,
  onChange,
  minDate,
  name,
  className = "",
}: DatePickerProps) {
  const displayValue = value
    ? formatPickerLongDate(parseYmdToLocalDate(value))
    : "Select date";

  return (
    <label
      className={`flex h-11 w-full cursor-pointer items-center gap-3 rounded-2xl border border-[#dfe8d6] bg-[#fbfcf8] px-4 text-sm text-[#203321] transition focus-within:border-[#0d6e6e] focus-within:bg-white ${className}`.trim()}
    >
      <CalendarDays className="h-4 w-4 shrink-0 text-[#7b8a74]" />
      <div className="min-w-0 flex-1">
        <div className="truncate text-xs font-medium text-[#72806e]">Date</div>
        <div className="truncate font-medium text-[#203321]">{displayValue}</div>
      </div>
      <input
        type="date"
        name={name}
        value={value}
        min={toMinValue(minDate)}
        onChange={(event) => onChange(event.target.value)}
        className="w-[132px] rounded-xl border border-[#dfe8d6] bg-white px-2.5 py-2 text-sm text-[#203321] outline-none"
      />
    </label>
  );
}
