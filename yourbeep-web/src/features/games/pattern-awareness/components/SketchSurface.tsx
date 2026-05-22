import { Eraser, RotateCcw, Undo2 } from "lucide-react";
import { useMemo, useRef } from "react";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import MainButton from "@components/ui/MainButton";
import type { SketchPoint, SketchStroke } from "../types";
import { PATTERN_DRAWING_HEIGHT, PATTERN_DRAWING_MIN_H } from "./patternLayoutTokens";

type SketchSurfaceProps = {
  title: string;
  strokes: SketchStroke[];
  activeStroke: SketchPoint[];
  onStartStroke: (point: SketchPoint) => void;
  onAppendPoint: (point: SketchPoint) => void;
  onEndStroke: () => void;
  onClear: () => void;
  onUndo: () => void;
  canvasClassName?: string;
  boardClassName?: string;
  background?: ReactNode;
  footer?: ReactNode;
  embedded?: boolean;
};

const pointToString = (points: SketchPoint[]) =>
  points.map((point) => `${point.x},${point.y}`).join(" ");

const ToolButton = ({
  label,
  icon,
  onClick,
  compact = false,
}: {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  compact?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center justify-center rounded-[10px] border border-[#c9c9c9] bg-white text-[#13475a] shadow-[0_2px_6px_rgba(19,71,90,0.07)] transition-[box-shadow,border-color] duration-200 hover:border-[#b0b0b0] hover:shadow-[0_3px_10px_rgba(19,71,90,0.1)] ${
      compact ? "h-9 w-9" : "h-10 w-10 rounded-[12px]"
    }`}
    aria-label={label}
    title={label}
  >
    {icon}
  </button>
);

const SketchSurface = ({
  title,
  strokes,
  activeStroke,
  onStartStroke,
  onAppendPoint,
  onEndStroke,
  onClear,
  onUndo,
  canvasClassName = "",
  boardClassName = "",
  background,
  footer,
  embedded = false,
}: SketchSurfaceProps) => {
  const boardRef = useRef<HTMLDivElement | null>(null);

  const handlePoint = (
    event: ReactPointerEvent<HTMLDivElement>,
    callback: (point: SketchPoint) => void,
  ) => {
    const bounds = boardRef.current?.getBoundingClientRect();
    if (!bounds) {
      return;
    }

    callback({
      x: ((event.clientX - bounds.left) / bounds.width) * 1000,
      y: ((event.clientY - bounds.top) / bounds.height) * 700,
      time: Date.now(),
    });
  };

  const hasMarks = useMemo(
    () =>
      strokes.some((stroke) => stroke.points.length > 1) || activeStroke.length > 1,
    [activeStroke.length, strokes],
  );

  const board = (
    <div
      className={`${embedded ? "" : title ? "mt-4 sm:mt-5" : ""} flex w-full flex-col gap-2 sm:gap-3 md:grid md:grid-cols-[3.5rem_minmax(0,1fr)] md:grid-rows-[auto_auto] md:gap-x-3 md:gap-y-2 lg:grid-cols-[3.75rem_minmax(0,1fr)] lg:gap-x-3.5 ${PATTERN_DRAWING_MIN_H}`}
    >
      <div className="flex items-center justify-between gap-2 rounded-[14px] bg-[#d0cfd4] px-2.5 py-2 md:hidden">
        <div className="flex items-center gap-1.5">
          <ToolButton compact label="Undo" icon={<Undo2 size={16} strokeWidth={2} />} onClick={onUndo} />
          <ToolButton compact label="Clear board" icon={<Eraser size={16} strokeWidth={2} />} onClick={onClear} />
          <ToolButton compact label="Reset" icon={<RotateCcw size={16} strokeWidth={2} />} onClick={onClear} />
        </div>
        <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#0f3545]">
          Tools
        </p>
      </div>

      <div
        className={`hidden min-h-0 flex-col rounded-[18px] bg-[#d0cfd4] px-2 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] md:col-start-1 md:row-start-1 md:flex md:h-full md:items-center md:justify-between lg:rounded-[20px] lg:py-5 ${PATTERN_DRAWING_MIN_H}`}
      >
        <div className="flex flex-col items-center gap-2.5">
          <ToolButton label="Undo" icon={<Undo2 size={17} strokeWidth={2} />} onClick={onUndo} />
          <ToolButton label="Clear board" icon={<Eraser size={17} strokeWidth={2} />} onClick={onClear} />
          <ToolButton label="Reset" icon={<RotateCcw size={17} strokeWidth={2} />} onClick={onClear} />
        </div>
        <p
          className="mt-auto shrink-0 select-none px-0.5 text-center text-[9px] font-semibold uppercase leading-tight tracking-[0.1em] text-[#0f3545]"
          aria-hidden
        >
          Tools
        </p>
      </div>

      <div
        className={`min-w-0 md:col-start-2 md:row-start-1 md:h-full ${PATTERN_DRAWING_MIN_H} ${boardClassName}`}
      >
        <div
          ref={boardRef}
          className={`relative h-full w-full touch-none overflow-hidden rounded-[14px] border border-[#dad8cb] bg-[#f8f5ea] sm:rounded-[18px] md:rounded-[20px] ${PATTERN_DRAWING_HEIGHT} ${canvasClassName}`}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            handlePoint(event, onStartStroke);
          }}
          onPointerMove={(event) => {
            if ((event.buttons & 1) !== 1) {
              return;
            }
            handlePoint(event, onAppendPoint);
          }}
          onPointerUp={() => onEndStroke()}
          onPointerLeave={() => onEndStroke()}
        >
          {background}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 1000 700"
            preserveAspectRatio="none"
          >
            {strokes.map((stroke) => (
              <polyline
                key={stroke.id}
                fill="none"
                stroke="#21485f"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={pointToString(stroke.points)}
              />
            ))}
            {activeStroke.length > 1 ? (
              <polyline
                fill="none"
                stroke="#21485f"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={pointToString(activeStroke)}
              />
            ) : null}
          </svg>

          {!hasMarks ? (
            <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 text-center text-sm font-medium tracking-[0.01em] text-[#a6a4a8] sm:text-base">
              Draw Here
            </div>
          ) : null}
        </div>
      </div>

      {footer ? (
        <div className="mt-2 sm:mt-3 md:col-start-2 md:row-start-2 md:mt-0">{footer}</div>
      ) : null}
    </div>
  );

  if (embedded) {
    return board;
  }

  return (
    <section className="w-full min-w-0 overflow-x-hidden rounded-[20px] bg-[#f8f5ea] px-3 py-3 sm:rounded-[28px] sm:px-4 sm:py-4 md:px-5 md:py-5">
      {title ? (
        <h2 className="text-center text-lg font-bold leading-tight text-[#0d475d] sm:text-xl">
          {title}
        </h2>
      ) : null}
      {board}
    </section>
  );
};

export const PatternSurfaceActions = ({
  onBack,
  onSave,
  saveLabel,
  saveDisabled,
  saving,
}: {
  onBack: () => void;
  onSave: () => void;
  saveLabel: string;
  saveDisabled?: boolean;
  saving?: boolean;
}) => (
  <div className="flex w-full flex-col-reverse items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
    <button
      type="button"
      onClick={onBack}
      className="w-full py-1.5 text-center text-xs font-semibold text-[#143f56] transition hover:opacity-70 sm:w-auto sm:py-0 sm:text-[13px]"
    >
      Back
    </button>
    <MainButton
      onClick={onSave}
      disabled={saveDisabled}
      isLoading={saving}
      className="h-9 w-full min-w-0 bg-[#0f4d65] px-4 text-xs text-white shadow-[0_10px_22px_rgba(16,74,92,0.16)] sm:w-auto sm:min-w-[130px] sm:text-[13px]"
    >
      {saveLabel}
    </MainButton>
  </div>
);

export default SketchSurface;
