import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, JSX, ReactNode } from "react";
import { i18n, LANGUAGE_OPTIONS, resolveLanguage } from "../../../shared/i18n";
import { allPets } from "../../../shared/bundledPets";
import {
  DEFAULT_CUSTOM_REMINDER_COUNTDOWN_LEAD_MINUTES,
  DEFAULT_CUSTOM_REMINDER_DUE_SCALE_MULTIPLIER
} from "../../../shared/constants";
import type {
  CustomReminder,
  DemoTrigger,
  InstalledPet,
  PetdexStateId,
  PetRoamDirection,
  PetState,
  Settings,
  TodayStats
} from "../../../shared/types";
import { getSelectedPetAsset } from "../assets";
import { distractionHelp, formatDistractionState, formatTimer, formatTimestamp, localeFor } from "../format";
import { useNow, useSnapshot } from "../hooks";

type SettingsCopy = ReturnType<typeof i18n>["settings"];
type StatsRange = "day" | "month" | "all";
type PrefsPage = "home" | "focus" | "pets" | "stats" | "settings";
type StatsMetric = "breaksTaken" | "watersLogged" | "focusMinutes" | "focusWarnings";
type StatsTrendPoint = TodayStats & {
  label: string;
};
type StudioChatMessage = {
  role: "user" | "pet";
  text: string;
  ts: string;
};
type StudioTask = {
  id: string;
  title: string;
  done: boolean;
};
type FocusHeatmapDay = {
  date: string;
  tooltip: string;
  level: number;
};

type FocusHeatmapWeek = {
  startDate: Date;
  days: FocusHeatmapDay[];
};

type MonthMarker = {
  key: string;
  label: string;
  column: number;
};
const PETDEX_URL = "https://petdex.crafter.run/";
const HEATMAP_WEEK_COUNT = 53;
const CUSTOM_GIF_STATES: Array<{ state: PetdexStateId; previewState: PetState; label: string; hint: string }> = [
  { state: "idle", previewState: "idle", label: "\u5f85\u673a", hint: "\u684c\u5ba0\u9ed8\u8ba4\u7ad9\u7acb\u6216\u547c\u5438\u72b6\u6001\u3002" },
  { state: "running-right", previewState: "runningRight", label: "\u5411\u53f3\u79fb\u52a8", hint: "\u684c\u5ba0\u5411\u53f3\u79fb\u52a8\u65f6\u5c55\u793a\u3002" },
  { state: "running-left", previewState: "runningLeft", label: "\u5411\u5de6\u79fb\u52a8", hint: "\u684c\u5ba0\u5411\u5de6\u79fb\u52a8\u65f6\u5c55\u793a\u3002" },
  { state: "waving", previewState: "waving", label: "\u6253\u62db\u547c", hint: "\u7528\u4e8e\u6b22\u8fce\u3001\u5b8c\u6210\u4efb\u52a1\u7b49\u53cd\u9988\u3002" },
  { state: "jumping", previewState: "jumping", label: "\u5f00\u5fc3\u8df3\u8dc3", hint: "\u7528\u4e8e\u6b63\u5411\u53cd\u9988\u6216\u5f00\u5fc3\u4e92\u52a8\u3002" },
  { state: "failed", previewState: "sad", label: "\u96be\u8fc7", hint: "\u7528\u4e8e\u8bf7\u6c42\u5931\u8d25\u6216\u5f02\u5e38\u60c5\u51b5\u3002" },
  { state: "waiting", previewState: "thinking", label: "\u601d\u8003\u4e2d", hint: "\u7528\u4e8e\u7b49\u5f85\u3001\u804a\u5929\u6216 AI \u56de\u590d\u4e2d\u3002" },
  { state: "running", previewState: "breakRunning", label: "\u4f11\u606f\u5012\u8ba1\u65f6", hint: "\u7528\u4e8e\u5f3a\u5236\u4f11\u606f\u6216\u5012\u8ba1\u65f6\u573a\u666f\u3002" },
  { state: "review", previewState: "reviewing", label: "\u5f85\u786e\u8ba4", hint: "\u7528\u4e8e\u9700\u8981\u7528\u6237\u590d\u6838\u7684\u72b6\u6001\u3002" }
];

const PREF_NAV: Array<{ page: PrefsPage; label: string; icon: string; note: string }> = [
  { page: "home", label: "\u4e3b\u9875", icon: "\u2302", note: "AI \u804a\u5929\u4e0e\u4efb\u52a1" },
  { page: "focus", label: "\u4e13\u6ce8", icon: "\u25cc", note: "\u8ba1\u65f6\u4e0e\u63d0\u9192" },
  { page: "pets", label: "\u89d2\u8272", icon: "\u2606", note: "\u5f62\u8c61\u4e0e\u52a8\u4f5c" },
  { page: "stats", label: "\u7edf\u8ba1", icon: "\u2225", note: "\u6570\u636e\u770b\u677f" },
  { page: "settings", label: "\u8bbe\u7f6e", icon: "\u2699", note: "\u504f\u597d\u4e0e\u8bca\u65ad" }
];

const PRODUCT_BRIDGES = [
  { label: "AI \u804a\u5929", value: "DeepSeek", detail: "\u4e09\u51fb\u684c\u5ba0\u5373\u53ef\u95ee\u7b54" },
  { label: "\u89d2\u8272\u5e93", value: "Petdex", detail: "\u652f\u6301\u5bfc\u5165\u4e0e\u81ea\u5b9a\u4e49 GIF" },
  { label: "\u4e60\u60ef\u5b88\u62a4", value: "Focus", detail: "\u4f11\u606f\u3001\u559d\u6c34\u3001\u4e13\u6ce8\u4e00\u8d77\u7ba1" }
];

const PETDEX_RECOMMENDATIONS = [
  { name: "Chiikawa style", tone: "\u52aa\u529b\u7cfb", query: "chiikawa", color: "#f5a623" },
  { name: "Usagi style", tone: "\u6d3b\u529b\u7cfb", query: "usagi", color: "#f87eb5" },
  { name: "Hachiware style", tone: "\u966a\u4f34\u7cfb", query: "hachiware", color: "#7ab8f5" },
  { name: "Kuromi style", tone: "\u4e2a\u6027\u7cfb", query: "kuromi", color: "#9b59b6" },
  { name: "Cinnamoroll style", tone: "\u6cbb\u6108\u7cfb", query: "cinnamoroll", color: "#6bbde8" },
  { name: "Original cozy pets", tone: "\u539f\u521b\u7cfb", query: "cozy cheerful", color: "#5ac8a0" }
];

const FIGMA_CHARACTERS = [
  {
    id: "usagi",
    name: "\u4e4c\u8428\u5947",
    title: "Usagi",
    imageUrl: "/pets/usagi.webp",
    color: "#F87EB5",
    bg: "#FFF0F7",
    tag: "\u6e29\u67d4\u7cfb",
    description: "\u6765\u81ea Figma Make \u7684\u4eba\u6c14\u767d\u5154\u89d2\u8272\u7075\u611f\uff0c\u9002\u5408\u67d4\u548c\u966a\u4f34\u578b\u684c\u5ba0\u3002",
    query: "usagi"
  },
  {
    id: "kirby",
    name: "\u661f\u4e4b\u5361\u6bd4",
    title: "Kirby",
    imageUrl: "/pets/kirby.png",
    color: "#FF8FAB",
    bg: "#FFF0F4",
    tag: "\u5143\u6c14\u7cfb",
    description: "\u7c89\u8272\u5706\u6eda\u6eda\u7684\u5192\u9669\u7075\u611f\uff0c\u7528\u4e8e\u5f3a\u5316\u65b0\u7248 Figma \u89d2\u8272\u5e93\u7684\u89c6\u89c9\u8bed\u8a00\u3002",
    query: "kirby"
  },
  {
    id: "cinnamoroll",
    name: "\u7389\u6842\u72d7",
    title: "Cinnamoroll",
    imageUrl: "/pets/cinnamoroll.webp",
    color: "#7AB8F5",
    bg: "#EFF7FF",
    tag: "\u6cbb\u6108\u7cfb",
    description: "\u6d45\u84dd\u6cbb\u6108\u98ce\u89d2\u8272\u7075\u611f\uff0c\u9002\u5408\u559d\u6c34\u3001\u4f11\u606f\u548c\u60c5\u7eea\u5b89\u629a\u573a\u666f\u3002",
    query: "cinnamoroll"
  },
  {
    id: "kuromi",
    name: "\u5e93\u6d1b\u7c73",
    title: "Kuromi",
    imageUrl: "/pets/kuromi.webp",
    color: "#9B59B6",
    bg: "#F5F0FF",
    tag: "\u4e2a\u6027\u7cfb",
    description: "\u504f\u4e2a\u6027\u7684\u7d2b\u8272\u89d2\u8272\u7075\u611f\uff0c\u548c\u4e13\u6ce8\u72b6\u6001\u7684\u7d2b\u8272\u63a7\u4ef6\u4fdd\u6301\u4e00\u81f4\u3002",
    query: "kuromi"
  },
  {
    id: "chiikawa",
    name: "\u5409\u4f0a\u5361\u54c7",
    title: "Chiikawa",
    imageUrl: "/pets/chiikawa.webp",
    color: "#F5A623",
    bg: "#FFFBEB",
    tag: "\u52aa\u529b\u7cfb",
    description: "\u5c0f\u5c0f\u7684\u52aa\u529b\u7cfb\u89d2\u8272\u7075\u611f\uff0c\u9002\u5408\u4efb\u52a1\u5b8c\u6210\u548c\u8fde\u7eed\u6253\u5361\u53cd\u9988\u3002",
    query: "chiikawa"
  },
  {
    id: "nezuko",
    name: "\u7962\u8c46\u5b50",
    title: "Nezuko",
    imageUrl: "/pets/nezuko.webp",
    color: "#FF6B9D",
    bg: "#FFF0F6",
    tag: "\u5b88\u62a4\u7cfb",
    description: "\u5b88\u62a4\u578b\u89d2\u8272\u7075\u611f\uff0c\u4e0e\u5206\u5fc3\u68c0\u6d4b\u548c\u4e13\u6ce8\u5b88\u62a4\u529f\u80fd\u547c\u5e94\u3002",
    query: "nezuko"
  }
];

function Row({
  label,
  hint,
  control
}: {
  label: string;
  hint?: string;
  control: JSX.Element;
}): JSX.Element {
  return (
    <div className="pref-row">
      <div className="pref-row__label">
        <span>{label}</span>
        {hint ? <small>{hint}</small> : null}
      </div>
      <div className="pref-row__control">{control}</div>
    </div>
  );
}

function ToggleControl({
  checked,
  onChange,
  ariaLabel
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  ariaLabel: string;
}): JSX.Element {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      className={`pref-toggle${checked ? " is-on" : ""}`}
      onClick={() => onChange(!checked)}
    >
      <span className="pref-toggle__thumb" />
    </button>
  );
}

function NumberControl({
  value,
  min,
  max,
  step = 1,
  precision = 0,
  unit,
  onChange
}: {
  value: number;
  min: number;
  max: number;
  step?: number;
  precision?: number;
  unit: string;
  onChange: (next: number) => void;
}): JSX.Element {
  const formatValue = (next: number): string => next.toFixed(precision);
  const [draftValue, setDraftValue] = useState(formatValue(value));
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isEditing) setDraftValue(formatValue(value));
  }, [isEditing, precision, value]);

  function clamp(next: number): number {
    const clamped = Math.min(max, Math.max(min, next));
    const factor = 10 ** precision;
    return Math.round(clamped * factor) / factor;
  }

  function commit(raw: string): void {
    const trimmed = raw.trim();
    if (!trimmed) {
      setDraftValue(String(value));
      return;
    }

    const next = Number(trimmed);
    if (!Number.isFinite(next)) {
      setDraftValue(String(value));
      return;
    }

    const normalized = clamp(next);
    setDraftValue(formatValue(normalized));
    if (normalized !== value) onChange(normalized);
  }

  return (
    <div className="pref-stepper">
      <button
        type="button"
        className="pref-stepper__btn"
        aria-label="-"
        disabled={value <= min}
        onClick={() => {
          const next = clamp(value - step);
          setDraftValue(formatValue(next));
          onChange(next);
        }}
      >
        -
      </button>
      <input
        type="text"
        inputMode="numeric"
        value={draftValue}
        onBlur={() => {
          setIsEditing(false);
          commit(draftValue);
        }}
        onChange={(event) => setDraftValue(event.target.value)}
        onFocus={() => setIsEditing(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.currentTarget.blur();
          }
          if (event.key === "Escape") {
            setDraftValue(formatValue(value));
            event.currentTarget.blur();
          }
        }}
      />
      <span className="pref-stepper__unit">{unit}</span>
      <button
        type="button"
        className="pref-stepper__btn"
        aria-label="+"
        disabled={value >= max}
        onClick={() => {
          const next = clamp(value + step);
          setDraftValue(formatValue(next));
          onChange(next);
        }}
      >
        +
      </button>
    </div>
  );
}

function SelectControl({
  value,
  options,
  onChange
}: {
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}): JSX.Element {
  return (
    <select className="pref-select" value={value} onChange={(event) => onChange(event.target.value)}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function SegmentedControl<T extends string>({
  value,
  options,
  onChange
}: {
  value: T | null;
  options: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
}): JSX.Element {
  return (
    <div className="segmented-control" role="tablist">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={value === option.value}
          className={value === option.value ? "is-selected" : ""}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function ChipsControl({
  value,
  onChange,
  labels
}: {
  value: string[];
  onChange: (next: string[]) => void;
  labels: SettingsCopy;
}): JSX.Element {
  const [draft, setDraft] = useState("");

  function commit(raw: string): void {
    const trimmed = raw.trim().replace(/,$/, "").trim();
    if (!trimmed) return;
    if (value.some((entry) => entry.toLowerCase() === trimmed.toLowerCase())) {
      setDraft("");
      return;
    }
    onChange([...value, trimmed]);
    setDraft("");
  }

  return (
    <div className="pref-chips">
      <div className="pref-chips__list">
        {value.map((entry) => (
          <span key={entry} className="pref-chip">
            {entry}
            <button
              type="button"
              aria-label={labels.removeListItem(entry)}
              onClick={() => onChange(value.filter((item) => item !== entry))}
            >
              &times;
            </button>
          </span>
        ))}
        <input
          className="pref-chips__input"
          placeholder={labels.addListItem}
          value={draft}
          onChange={(event) => {
            const next = event.target.value;
            if (next.endsWith(",")) commit(next);
            else setDraft(next);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commit(draft);
            }
            if (event.key === "Backspace" && !draft && value.length) {
              onChange(value.slice(0, -1));
            }
          }}
          onBlur={() => commit(draft)}
        />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  unit
}: {
  label: string;
  value: number;
  unit?: string;
}): JSX.Element {
  return (
    <div className="stat-card">
      <span className="stat-card__label">{label}</span>
      <strong className="stat-card__value">
        {value}
        {unit ? <small>{unit}</small> : null}
      </strong>
    </div>
  );
}

function dateFromKey(date: string): Date {
  const parsed = new Date(`${date}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function dateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function startOfWeek(date: Date): Date {
  const next = new Date(date);
  next.setDate(next.getDate() - next.getDay());
  return next;
}

function daysBetweenInclusive(start: Date, end: Date): number {
  const startDate = dateFromKey(dateKey(start));
  const endDate = dateFromKey(dateKey(end));
  return Math.max(1, Math.floor((endDate.getTime() - startDate.getTime()) / 86_400_000) + 1);
}

function focusLevel(minutes: number): number {
  if (minutes <= 0) return 0;
  if (minutes < 25) return 1;
  if (minutes < 60) return 2;
  if (minutes < 120) return 3;
  return 4;
}

function formatTrendLabel(date: Date, language: Settings["language"]): string {
  return new Intl.DateTimeFormat(localeFor(language), {
    month: "numeric",
    day: "numeric"
  }).format(date);
}

function formatHeatmapMonth(date: Date, language: Settings["language"]): string {
  return new Intl.DateTimeFormat(localeFor(language), {
    month: "short"
  }).format(date);
}

function formatHeatmapDate(date: Date, language: Settings["language"]): string {
  return new Intl.DateTimeFormat(localeFor(language), {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}

function formatWeekdayLabel(dayIndex: number, language: Settings["language"]): string {
  const date = new Date(2026, 0, 4 + dayIndex);
  return new Intl.DateTimeFormat(localeFor(language), {
    weekday: "short"
  }).format(date);
}

function nextReminderDueAt(time: string, now: number): number | null {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return null;
  const [hours, minutes] = time.split(":").map(Number);
  const due = new Date(now);
  due.setHours(hours, minutes, 0, 0);
  if (due.getTime() <= now) due.setDate(due.getDate() + 1);
  return due.getTime();
}

function createReminderId(): string {
  return `reminder-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function buildTrendPoints(
  statsByDate: Record<string, TodayStats>,
  currentDate: string,
  range: StatsRange,
  language: Settings["language"]
): StatsTrendPoint[] {
  if (range === "all") {
    const dates = Object.keys(statsByDate).sort();
    return dates.map((date) => ({
      ...statsByDate[date],
      label: formatTrendLabel(dateFromKey(date), language)
    }));
  }

  const days = range === "month" ? 30 : 7;
  const end = dateFromKey(currentDate);
  return Array.from({ length: days }, (_, index) => {
    const date = addDays(end, index - days + 1);
    const key = dateKey(date);
    return {
      ...emptyStats(key),
      ...statsByDate[key],
      label: formatTrendLabel(date, language)
    };
  });
}

function StatsLineChart({
  title,
  unit,
  metric,
  points
}: {
  title: string;
  unit?: string;
  metric: StatsMetric;
  points: StatsTrendPoint[];
}): JSX.Element {
  const width = 320;
  const height = 132;
  const paddingX = 24;
  const paddingTop = 16;
  const paddingBottom = 24;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingTop - paddingBottom;
  const values = points.map((point) => point[metric]);
  const maxValue = Math.max(1, ...values);
  const stepX = points.length > 1 ? chartWidth / (points.length - 1) : 0;
  const coordinates = values.map((value, index) => {
    const x = paddingX + stepX * index;
    const y = paddingTop + chartHeight - (value / maxValue) * chartHeight;
    return { x, y, value };
  });
  const line = coordinates.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
  const latest = values.at(-1) ?? 0;
  const firstLabel = points[0]?.label ?? "";
  const lastLabel = points.at(-1)?.label ?? "";

  return (
    <article className="trend-card">
      <div className="trend-card__head">
        <span>{title}</span>
        <strong>
          {latest}
          {unit ? <small>{unit}</small> : null}
        </strong>
      </div>
      <svg className="trend-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title}>
        <line className="trend-chart__grid" x1={paddingX} x2={width - paddingX} y1={paddingTop} y2={paddingTop} />
        <line
          className="trend-chart__grid"
          x1={paddingX}
          x2={width - paddingX}
          y1={paddingTop + chartHeight / 2}
          y2={paddingTop + chartHeight / 2}
        />
        <line
          className="trend-chart__grid"
          x1={paddingX}
          x2={width - paddingX}
          y1={paddingTop + chartHeight}
          y2={paddingTop + chartHeight}
        />
        <polyline className="trend-chart__line" points={line} />
        {coordinates.map((point, index) => (
          <circle
            className="trend-chart__dot"
            key={`${points[index]?.date}-${metric}`}
            cx={point.x}
            cy={point.y}
            r={point.value === latest && index === coordinates.length - 1 ? 3.2 : 2.2}
          />
        ))}
        <text className="trend-chart__axis" x={paddingX} y={height - 6}>
          {firstLabel}
        </text>
        <text className="trend-chart__axis trend-chart__axis--end" x={width - paddingX} y={height - 6}>
          {lastLabel}
        </text>
      </svg>
    </article>
  );
}

function addStats(left: TodayStats, right: TodayStats): TodayStats {
  return {
    date: left.date || right.date,
    breaksTaken: left.breaksTaken + right.breaksTaken,
    watersLogged: left.watersLogged + right.watersLogged,
    focusMinutes: left.focusMinutes + right.focusMinutes,
    focusWarnings: left.focusWarnings + right.focusWarnings
  };
}

function emptyStats(date: string): TodayStats {
  return {
    date,
    breaksTaken: 0,
    watersLogged: 0,
    focusMinutes: 0,
    focusWarnings: 0
  };
}

function buildFocusHeatmap(
  statsByDate: Record<string, TodayStats>,
  currentDate: string,
  language: Settings["language"],
  labels: SettingsCopy
): FocusHeatmapWeek[] {
  const end = dateFromKey(currentDate);
  const start = addDays(startOfWeek(end), -(HEATMAP_WEEK_COUNT - 1) * 7);

  return Array.from({ length: HEATMAP_WEEK_COUNT }, (_, weekIndex) => {
    const weekStart = addDays(start, weekIndex * 7);
    return {
      startDate: weekStart,
      days: Array.from({ length: 7 }, (_, dayIndex) => {
        const date = addDays(weekStart, dayIndex);
        const key = dateKey(date);
        const focusMinutes = statsByDate[key]?.focusMinutes ?? 0;
        const dateLabel = formatHeatmapDate(date, language);
        return {
          date: key,
          tooltip: labels.focusHeatmapTooltip(focusMinutes, dateLabel),
          level: focusLevel(focusMinutes)
        };
      })
    };
  });
}

function buildMonthMarkers(weeks: FocusHeatmapWeek[], language: Settings["language"]): MonthMarker[] {
  return weeks.flatMap((week, index) => {
    const previous = weeks[index - 1]?.startDate;
    if (previous && previous.getMonth() === week.startDate.getMonth()) return [];
    return [
      {
        key: dateKey(week.startDate),
        label: formatHeatmapMonth(week.startDate, language),
        column: index + 1
      }
    ];
  });
}

function StatsCompanionship({
  days,
  weeks,
  monthMarkers,
  labels,
  language
}: {
  days: number;
  weeks: FocusHeatmapWeek[];
  monthMarkers: MonthMarker[];
  labels: SettingsCopy;
  language: Settings["language"];
}): JSX.Element {
  const weekdayRows = [
    { day: 1, label: formatWeekdayLabel(1, language) },
    { day: 3, label: formatWeekdayLabel(3, language) },
    { day: 5, label: formatWeekdayLabel(5, language) }
  ];
  const heatmapStyle = { "--week-count": weeks.length } as CSSProperties;
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const tooltipTimer = useRef<number | null>(null);

  function showTooltip(text: string, x: number, y: number): void {
    const safeX = Math.min(Math.max(x, 96), window.innerWidth - 96);
    setTooltip({ text, x: safeX, y });
  }

  function scheduleTooltip(text: string, element: HTMLElement): void {
    if (tooltipTimer.current) window.clearTimeout(tooltipTimer.current);
    const rect = element.getBoundingClientRect();
    tooltipTimer.current = window.setTimeout(() => {
      showTooltip(text, rect.left + rect.width / 2, rect.top);
      tooltipTimer.current = null;
    }, 140);
  }

  function hideTooltip(): void {
    if (tooltipTimer.current) {
      window.clearTimeout(tooltipTimer.current);
      tooltipTimer.current = null;
    }
    setTooltip(null);
  }

  return (
    <section className="companion-stats" aria-label={labels.companionDays}>
      <div className="companion-stats__summary">
        <span>{labels.companionDays}</span>
        <strong>
          {days}
          <small>{labels.dayUnit}</small>
        </strong>
      </div>
      <div className="focus-heatmap" aria-label={labels.focusHeatmap}>
        <div className="focus-heatmap__head">
          <span>{labels.focusHeatmap}</span>
          <div className="focus-heatmap__legend" aria-hidden="true">
            <span>{labels.heatmapLess}</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <i key={level} className={`focus-heatmap__legend-cell heat-${level}`} />
            ))}
            <span>{labels.heatmapMore}</span>
          </div>
        </div>
        <div className="focus-heatmap__scroller">
          <div className="focus-heatmap__canvas" style={heatmapStyle}>
            <div className="focus-heatmap__months" aria-hidden="true">
              {monthMarkers.map((marker) => (
                <span key={marker.key} style={{ gridColumn: marker.column }}>
                  {marker.label}
                </span>
              ))}
            </div>
            <div className="focus-heatmap__body">
              <div className="focus-heatmap__weekdays" aria-hidden="true">
                {weekdayRows.map((row) => (
                  <span key={row.day} style={{ gridRow: row.day + 1 }}>
                    {row.label}
                  </span>
                ))}
              </div>
              <div className="focus-heatmap__grid" role="img" aria-label={labels.focusHeatmap}>
                {weeks.flatMap((week) =>
                  week.days.map((day) => (
                    <span
                      key={day.date}
                      className={`focus-heatmap__day heat-${day.level}`}
                      aria-label={day.tooltip}
                      onMouseEnter={(event) => scheduleTooltip(day.tooltip, event.currentTarget)}
                      onMouseLeave={hideTooltip}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        {tooltip ? (
          <div
            className="focus-heatmap__tooltip"
            style={{ left: tooltip.x, top: tooltip.y }}
            role="tooltip"
          >
            {tooltip.text}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function SettingsView(): JSX.Element {
  const snapshot = useSnapshot();
  const { settings, stats } = snapshot;
  const [draft, setDraft] = useState(settings);
  const [settingsDirty, setSettingsDirty] = useState(false);
  const [statsRange, setStatsRange] = useState<StatsRange>("day");
  const [page, setPage] = useState<PrefsPage>("home");
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [newReminderTitle, setNewReminderTitle] = useState("");
  const [newReminderTime, setNewReminderTime] = useState("11:30");
  const [studioChatDraft, setStudioChatDraft] = useState("");
  const [studioChatSending, setStudioChatSending] = useState(false);
  const [studioChatMessages, setStudioChatMessages] = useState<StudioChatMessage[]>([
    {
      role: "pet",
      text: "\u55e8~\u6211\u662f\u4f60\u7684\u684c\u9762\u5c0f\u4f19\u4f34\uff01\u4eca\u5929\u60f3\u505a\u4ec0\u4e48\u5462\uff1f\u6709\u4efb\u52a1\u8981\u4e13\u6ce8\uff0c\u8fd8\u662f\u60f3\u804a\u5929\u90fd\u884c\u54e6 \uD83D\uDC3E",
      ts: "09:00"
    }
  ]);
  const [studioTasks, setStudioTasks] = useState<StudioTask[]>([]);
  const [studioTaskDraft, setStudioTaskDraft] = useState("");
  const now = useNow();
  const savedSettingsKey = JSON.stringify(settings);
  const language = resolveLanguage(draft.language);
  const labels = i18n(language).settings;
  const currentDate = stats.date || new Date(now).toISOString().slice(0, 10);
  const allStatsByDate = {
    ...snapshot.statsHistory,
    [currentDate]: stats
  };
  const monthPrefix = currentDate.slice(0, 7);
  const statsForRange = Object.values(allStatsByDate).reduce(
    (total, entry) => {
      if (statsRange === "day" && entry.date !== currentDate) return total;
      if (statsRange === "month" && !entry.date.startsWith(monthPrefix)) return total;
      return addStats(total, entry);
    },
    emptyStats(currentDate)
  );
  const trendPoints = useMemo(
    () => buildTrendPoints(allStatsByDate, currentDate, statsRange, language),
    [allStatsByDate, currentDate, language, statsRange]
  );
  const firstStatsDate = Object.keys(allStatsByDate).sort()[0] ?? currentDate;
  const companionDays = daysBetweenInclusive(dateFromKey(firstStatsDate), dateFromKey(currentDate));
  const focusHeatmapWeeks = useMemo(
    () => buildFocusHeatmap(allStatsByDate, currentDate, language, labels),
    [allStatsByDate, currentDate, labels, language]
  );
  const monthMarkers = useMemo(
    () => buildMonthMarkers(focusHeatmapWeeks, language),
    [focusHeatmapWeeks, language]
  );
  useEffect(() => {
    setDraft(settings);
    setSettingsDirty(false);
  }, [savedSettingsKey]);

  useEffect(() => {
    if (!settingsDirty) return;
    const timer = window.setTimeout(() => {
      window.mypets.updateSettings(draft);
      setSettingsDirty(false);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [draft, settingsDirty]);

  function updateDraft(partial: Partial<Settings>): void {
    setDraft((current) => ({ ...current, ...partial }));
    setSettingsDirty(true);
  }

  function updateCustomReminders(customReminders: CustomReminder[]): void {
    updateDraft({ customReminders });
  }

  function updateReminder(reminderId: string, partial: Partial<CustomReminder>): void {
    updateCustomReminders(
      draft.customReminders.map((reminder) =>
        reminder.id === reminderId ? { ...reminder, ...partial } : reminder
      )
    );
  }

  function addCustomReminder(): void {
    const title = newReminderTitle.trim() || labels.reminderUntitled;
    const time = /^([01]\d|2[0-3]):[0-5]\d$/.test(newReminderTime) ? newReminderTime : "11:30";
    updateCustomReminders([
      ...draft.customReminders,
      {
        id: createReminderId(),
        title,
        time,
        enabled: true,
        showCountdownOnPet: true,
        countdownLeadMinutes: DEFAULT_CUSTOM_REMINDER_COUNTDOWN_LEAD_MINUTES,
        enlargePetOnDue: false,
        duePetScaleMultiplier: DEFAULT_CUSTOM_REMINDER_DUE_SCALE_MULTIPLIER,
        createdAt: Date.now()
      }
    ]);
    setNewReminderTitle("");
  }

  function removeCustomReminder(reminderId: string): void {
    updateCustomReminders(draft.customReminders.filter((reminder) => reminder.id !== reminderId));
  }

  async function importPet(): Promise<void> {
    setImportStatus(null);
    const result = await window.mypets.importPetPackage();
    if (!result.ok) {
      if (result.error !== "import_cancelled") {
        setImportStatus(`${labels.importPetError}: ${result.error}`);
      }
      return;
    }
    setImportStatus(`${labels.importPetSuccess}: ${result.pet.manifest.displayName}`);
  }

  async function importCustomGif(state: PetdexStateId): Promise<void> {
    setImportStatus(null);
    const result = await window.mypets.importCustomGif(state);
    if (!result.ok) {
      if (result.error !== "import_cancelled") {
        setImportStatus(`GIF import failed: ${result.error}`);
      }
      return;
    }
    updateDraft({
      customGifPet: {
        enabled: true,
        gifs: {
          ...draft.customGifPet.gifs,
          [state]: result.path
        }
      }
    });
    setImportStatus("GIF imported successfully.");
  }

  function removeCustomGif(state: PetdexStateId): void {
    const { [state]: _removed, ...gifs } = draft.customGifPet.gifs;
    updateDraft({
      customGifPet: {
        enabled: Object.keys(gifs).length ? draft.customGifPet.enabled : false,
        gifs
      }
    });
  }

  function chatTimestamp(): string {
    return new Intl.DateTimeFormat(localeFor(language), {
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date());
  }

  async function sendStudioChat(text = studioChatDraft): Promise<void> {
    const message = text.trim();
    if (!message || studioChatSending) return;
    setStudioChatDraft("");
    setStudioChatMessages((current) => [...current, { role: "user", text: message, ts: chatTimestamp() }]);
    setStudioChatSending(true);
    const result = await window.mypets.petGptChatMessage(message);
    setStudioChatMessages((current) => [
      ...current,
      {
        role: "pet",
        text: result.ok ? result.message : `\u6211\u8fd9\u8fb9\u8fde\u4e0d\u4e0a\u804a\u5929\u670d\u52a1\uff1a${result.error}`,
        ts: chatTimestamp()
      }
    ]);
    setStudioChatSending(false);
  }

  function addStudioTask(): void {
    const title = studioTaskDraft.trim();
    if (!title) return;
    setStudioTasks((current) => [...current, { id: `${Date.now()}`, title, done: false }]);
    setStudioTaskDraft("");
  }

  function toggleStudioTask(taskId: string): void {
    setStudioTasks((current) =>
      current.map((task) => (task.id === taskId ? { ...task, done: !task.done } : task))
    );
  }

  function removeStudioTask(taskId: string): void {
    setStudioTasks((current) => current.filter((task) => task.id !== taskId));
  }

  function openProductBridge(bridge: (typeof PRODUCT_BRIDGES)[number]): void {
    if (bridge.value === "DeepSeek") {
      window.mypets.petChatRequested();
      return;
    }
    if (bridge.value === "Petdex") {
      setPage("pets");
      return;
    }
    setPage("focus");
  }

  function startImmersiveFocus(): void {
    if (!snapshot.focusActive) window.mypets.startFocus();
    window.mypets.closeSettings();
  }

  function toggleCompletionSound(): void {
    updateDraft({ agentCompletionSoundEnabled: !draft.agentCompletionSoundEnabled });
  }

  const selectablePets = useMemo(() => allPets(draft.installedPets), [draft.installedPets]);
  const activePet = selectablePets.find((pet) => pet.slug === draft.selectedPetId) ?? selectablePets[0];
  const activePetAsset = getSelectedPetAsset(
    activePet?.slug ?? draft.selectedPetId,
    draft.installedPets,
    "idle",
    draft.customGifPet
  );
  const pageTitle = PREF_NAV.find((item) => item.page === page)?.label ?? labels.title;
  const petName = activePet?.manifest.displayName ?? "\u68c9\u82b1\u7cd6";
  const focusTotalSeconds = Math.max(1, draft.focusDurationMinutes * 60);
  const focusSecondsLeft =
    snapshot.focusActive && snapshot.timers.focusEndsAt
      ? Math.max(0, Math.round((snapshot.timers.focusEndsAt - now) / 1000))
      : focusTotalSeconds;
  const focusClock = `${String(Math.floor(focusSecondsLeft / 60)).padStart(2, "0")}:${String(
    focusSecondsLeft % 60
  ).padStart(2, "0")}`;
  const focusProgress = snapshot.focusActive
    ? Math.min(1, Math.max(0, 1 - focusSecondsLeft / focusTotalSeconds))
    : 0;
  const focusPercent = Math.min(100, Math.round((statsForRange.focusMinutes / Math.max(1, 180)) * 100));
  const waterPercent = Math.min(100, Math.round((statsForRange.watersLogged / Math.max(1, 8)) * 100));
  const breakPercent = Math.min(100, Math.round((statsForRange.breaksTaken * 20 / Math.max(1, 60)) * 100));
  const petMood = snapshot.focusActive ? "\u4e13\u6ce8\u4e2d" : "\u5f85\u673a\u4e2d";
  const focusCycles = Math.min(4, Math.floor(stats.focusMinutes / Math.max(1, draft.focusDurationMinutes)));

  return (
    <main className="studio-shell" dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="studio-window studio-window--win">
        <aside className="studio-sidebar" aria-label="MyPets sections">
          <div className="studio-sidebar__avatar"><PetAssetPreview asset={activePetAsset} /></div>
          <nav className="studio-sidebar__nav">
            {PREF_NAV.map((item) => (
              <button key={item.page} type="button" className={`studio-nav-item${page === item.page ? " is-active" : ""}`} onClick={() => setPage(item.page)} title={item.note}>
                <span className="studio-nav-item__icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          <button className="studio-sidebar__bell" type="button" onClick={() => window.mypets.petChatRequested()}>{"\u25cc"}</button>
        </aside>

        <section className="studio-panel">
          <header className="studio-titlebar studio-titlebar--win">
            <div className="studio-app-title">
              <span className="studio-app-icon"><PetAssetPreview asset={activePetAsset} /></span>
              <h1>{page === "home" ? "MyPets \u00b7 \u4e3b\u9875" : pageTitle}</h1>
            </div>
            <div className="studio-status-pills">
              <span className="studio-pill studio-pill--pet"><span className="studio-pill__avatar"><PetAssetPreview asset={activePetAsset} /></span>{petName}</span>
              <span className="studio-pill">{petMood}</span>
            </div>
            <div className="studio-window-actions" aria-label="Window controls">
              <button type="button" aria-label="Minimize" onClick={() => window.mypets.minimizeSettings()}>_</button>
              <button type="button" aria-label="Maximize" onClick={() => window.mypets.toggleMaximizeSettings()}>{"\u25a1"}</button>
              <button type="button" aria-label="Close" onClick={() => window.mypets.closeSettings()}>{"\u00d7"}</button>
            </div>
          </header>

          <div className="studio-content studio-content--scroll">
            {page === "home" ? (
              <section className="studio-home">
                <div className="studio-home__left">
                  <article className="home-pet-card">
                    <span className="home-pet-card__badge">{petMood}</span>
                    <div className="home-pet-card__pet"><PetAssetPreview asset={activePetAsset} /></div>
                    <h2>{petName}</h2>
                    <p>{"\u6e29\u67d4\u7cfb"}</p>
                    <div className="home-pet-card__bubble">{"\u55e8\uff5e\u4eca\u5929\u6253\u7b97\u505a\u70b9\u4ec0\u4e48\u5417\uff1f"}</div>
                  </article>
                  <div className="home-actions">
                    <button type="button" onClick={() => window.mypets.triggerDemo("hydration")}>{"\u2667 \u559d\u6c34"}</button>
                    <button type="button" onClick={() => window.mypets.triggerDemo("break")}>{"\u25d2 \u4f11\u606f"}</button>
                  </div>
                  <div className="home-mini-stats">
                    <div><span>{"\u2699"}</span><small>{"\u4e13\u6ce8"}</small><strong>{stats.focusMinutes}{"\u5206"}</strong></div>
                    <div><span>{"\u2667"}</span><small>{"\u559d\u6c34"}</small><strong>{stats.watersLogged}{"\u676f"}</strong></div>
                    <div><span>{"\u25b2"}</span><small>{"\u8fde\u7eed"}</small><strong>{companionDays}{"\u5929"}</strong></div>
                  </div>
                  <div className="product-bridge-grid">
                    {PRODUCT_BRIDGES.map((bridge) => (
                      <button className="product-bridge-card" key={bridge.label} type="button" onClick={() => openProductBridge(bridge)}>
                        <span>{bridge.label}</span>
                        <strong>{bridge.value}</strong>
                        <small>{bridge.detail}</small>
                      </button>
                    ))}
                  </div>
                  <article className="home-task-card">
                    <div className="home-task-card__head"><strong>{"\u5f53\u524d\u4efb\u52a1"}</strong><button type="button" onClick={addStudioTask}>+</button></div>
                    <div className="home-task-input"><input value={studioTaskDraft} placeholder="点击 + 添加任务" onChange={(event) => setStudioTaskDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") addStudioTask(); }} /></div>
                    <div className="home-task-list">
                      {studioTasks.length ? studioTasks.map((task) => (
                        <div className={`home-task-item${task.done ? " is-done" : ""}`} key={task.id}>
                          <button type="button" onClick={() => toggleStudioTask(task.id)}><span>{task.done ? "\u2713" : ""}</span>{task.title}</button>
                          <button type="button" aria-label="Remove task" onClick={() => removeStudioTask(task.id)}>{"\u00d7"}</button>
                        </div>
                      )) : <p>{"\u70b9\u51fb + \u6dfb\u52a0\u4efb\u52a1"}</p>}
                    </div>
                  </article>
                </div>

                <article className="home-chat-card">
                  <header><strong>{"\u25cc \u548c"}{petName}{"\u804a\u804a"}</strong><span>{"AI \u95ee\u7b54 \u00b7 \u968f\u95ee\u968f\u7b54"}</span></header>
                  <div className="home-chat-log">
                    {studioChatMessages.map((message, index) => (
                      <div className={`home-chat-line ${message.role}`} key={`${message.role}-${index}`}>
                        {message.role === "pet" ? <span className="home-chat-avatar"><PetAssetPreview asset={activePetAsset} /></span> : null}
                        <div><p>{message.text}</p><small>{message.ts}</small></div>
                      </div>
                    ))}
                    {studioChatSending ? <div className="home-chat-line pet"><span className="home-chat-avatar"><PetAssetPreview asset={activePetAsset} /></span><div><p>{"\u6b63\u5728\u60f3\u4e00\u60f3..."}</p></div></div> : null}
                  </div>
                  <div className="home-chat-chips">
                    {["\u4eca\u5929\u5929\u6c14", "\u611f\u89c9\u6709\u70b9\u7d2f", "\u5e2e\u6211\u4e13\u6ce8", "\u9700\u8981\u5e2e\u52a9"].map((chip) => <button key={chip} type="button" onClick={() => void sendStudioChat(chip)}>{chip}</button>)}
                  </div>
                  <form className="home-chat-form" onSubmit={(event) => { event.preventDefault(); void sendStudioChat(); }}>
                    <input value={studioChatDraft} placeholder={`\u95ee\u95ee${petName}...`} disabled={studioChatSending} onChange={(event) => setStudioChatDraft(event.target.value)} />
                    <button type="submit" disabled={studioChatSending || !studioChatDraft.trim()}>{"\u2197"}</button>
                  </form>
                </article>
              </section>
            ) : null}

            {page === "focus" ? (
              <section className="studio-focus-page">
                <div className="focus-left-panel">
                  <input className="focus-goal-input" placeholder="今天要专注做什么？" value={studioTaskDraft} onChange={(event) => setStudioTaskDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") addStudioTask(); }} />
                  <div className="focus-ring" style={{ "--focus-progress": focusProgress } as CSSProperties}><div><span>{"\u4e13\u6ce8"}</span><strong>{focusClock}</strong><small>{"\u7b2c "}{Math.max(1, focusCycles + 1)}{" \u8f6e"}</small></div></div>
                  <div className="focus-controls"><button type="button" title="Reset" onClick={window.mypets.stopFocus}>{"\u21ba"}</button><button type="button" className="focus-controls__primary" onClick={snapshot.focusActive ? window.mypets.stopFocus : window.mypets.startFocus}>{snapshot.focusActive ? "\u2161" : "\u25b7"}</button><button type="button" title="Sound" onClick={toggleCompletionSound}>{draft.agentCompletionSoundEnabled ? "\u266a" : "\u266b"}</button></div>
                  <button type="button" className="focus-immersive" onClick={startImmersiveFocus}>{"\u2727 \u8fdb\u5165\u6c89\u6d78\u6a21\u5f0f"}</button>
                </div>
                <div className="focus-settings-panel">
                  <h2>{"\u65f6\u957f\u8bbe\u7f6e"}</h2>
                  <div className="focus-setting-card"><div><strong>{"\u4e13\u6ce8\u65f6\u957f"}</strong><span>{"5-60 \u5206\u949f"}</span></div><NumberControl value={draft.focusDurationMinutes} min={5} max={60} unit="" onChange={(focusDurationMinutes) => updateDraft({ focusDurationMinutes })} /></div>
                  <div className="focus-setting-card"><div><strong>{"\u77ed\u4f11\u606f"}</strong><span>{"5-30 \u5206\u949f"}</span></div><NumberControl value={Math.round(draft.screenBlockDurationSeconds / 60)} min={5} max={30} unit="" onChange={(value) => updateDraft({ screenBlockDurationSeconds: value * 60 })} /></div>
                  <h2>{"\u63d0\u9192\u8bbe\u7f6e"}</h2>
                  <div className="focus-toggle-card"><div><strong>{"\u4e13\u6ce8\u5f00\u59cb\u63d0\u9192"}</strong><span>{"\u5f00\u59cb\u8ba1\u65f6\u65f6\u901a\u77e5"}</span></div><ToggleControl checked={draft.agentCompletionSoundEnabled} onChange={(agentCompletionSoundEnabled) => updateDraft({ agentCompletionSoundEnabled })} ariaLabel="focus start" /></div>
                  <div className="focus-toggle-card"><div><strong>{"\u4f11\u606f\u5230\u70b9\u63d0\u9192"}</strong><span>{"\u8be5\u4f11\u606f\u65f6\u63a8\u9001\u6c14\u6ce1"}</span></div><ToggleControl checked={draft.breakReminderEnabled} onChange={(breakReminderEnabled) => updateDraft({ breakReminderEnabled })} ariaLabel="break reminder" /></div>
                  <div className="focus-toggle-card"><div><strong>{"\u559d\u6c34\u63d0\u9192"}</strong><span>{"\u6bcf\u5c0f\u65f6\u6e29\u67d4\u63d0\u9192\u4e00\u6b21"}</span></div><ToggleControl checked={draft.hydrationReminderEnabled} onChange={(hydrationReminderEnabled) => updateDraft({ hydrationReminderEnabled })} ariaLabel="water reminder" /></div>
                  <div className="focus-progress-card"><div><strong>{"\u4eca\u65e5\u5faa\u73af\u8fdb\u5ea6"}</strong><span>{focusCycles}/4</span></div><div>{[0, 1, 2, 3].map((item) => <i key={item} className={item < focusCycles ? "is-on" : ""} />)}</div></div>
                </div>
              </section>
            ) : null}

            {page === "pets" ? (
              <section className="studio-characters-page">
                <div className="studio-page-heading"><h2>{"\u9009\u62e9\u4f60\u7684\u5ba0\u7269\u89d2\u8272"}</h2><p>{"\u6bcf\u4e2a\u89d2\u8272\u90fd\u6709\u72ec\u7279\u7684\u966a\u4f34\u65b9\u5f0f\uff0c\u9009\u4e00\u4e2a\u6700\u5bf9\u4f60\u5fc3\u610f\u7684\u5427"}</p></div>
                <article className="character-feature-card"><div className="character-feature-card__preview"><PetAssetPreview asset={activePetAsset} /></div><div><span>{"\u6e29\u67d4\u7cfb"}</span><h3>{petName} <small>{activePet?.slug ?? "Mochi"}</small></h3><p>{activePet?.manifest.description ?? "\u84ec\u677e\u7684\u684c\u9762\u5c0f\u4f19\u4f34\uff0c\u4f1a\u966a\u4f60\u8bfb\u4e66\u3001\u4e13\u6ce8\u548c\u804a\u5929\u3002"}</p></div><strong>{"\u2713"}</strong></article>
                <div className="character-grid">{selectablePets.map((pet) => <PetCard key={pet.slug} pet={pet} label={pet.manifest.displayName} selected={draft.selectedPetId === pet.slug} onSelect={() => updateDraft({ selectedPetId: pet.slug })} />)}</div>
                <div className="character-actions"><button type="button" onClick={() => void importPet()}>{"\u5bfc\u5165\u89d2\u8272\u5305"}</button><button type="button" onClick={() => window.mypets.openExternal(PETDEX_URL)}>Petdex</button><span>{importStatus ?? "\u4e0a\u65b9\u662f\u5df2\u5b89\u88c5\u7684\u771f\u5b9e\u684c\u5ba0\uff0c\u9009\u62e9\u540e\u4f1a\u7acb\u5373\u5e94\u7528\u5230\u684c\u9762\u5ba0\u7269\u3002"}</span></div>
                <article className="figma-character-panel">
                  <div className="pref-block__head">
                    <div>
                      <strong>{"Figma Make \u89d2\u8272\u7075\u611f"}</strong>
                      <p>{"\u4fdd\u6301\u65b0\u7248 UI/UX \u7684\u56fe\u7247\u89d2\u8272\u5361\u7247\u6837\u5f0f\uff1b\u70b9\u51fb\u5361\u7247\u4f1a\u53bb Petdex \u641c\u7d22\u5bf9\u5e94\u89d2\u8272\uff0c\u4e0b\u8f7d\u540e\u518d\u5bfc\u5165\u6210\u771f\u5b9e\u684c\u5ba0\u3002"}</p>
                    </div>
                  </div>
                  <div className="figma-character-grid">
                    {FIGMA_CHARACTERS.map((character) => <FigmaCharacterCard key={character.id} character={character} />)}
                  </div>
                </article>
                <article className="petdex-showcase">
                  <div className="pref-block__head">
                    <div><strong>{"Petdex \u89d2\u8272\u7075\u611f"}</strong><p>{"\u4fdd\u7559\u5916\u90e8\u89d2\u8272\u641c\u7d22\u5165\u53e3\uff0c\u4e0d\u628a\u53d7\u7248\u6743\u7d20\u6750\u6253\u5305\u8fdb\u5e94\u7528\u3002"}</p></div>
                  </div>
                  <div className="petdex-grid">
                    {PETDEX_RECOMMENDATIONS.map((pick) => <PetdexPickCard key={pick.name} pick={pick} />)}
                  </div>
                </article>
                <article className="character-gif-panel"><div className="character-gif-panel__head"><div><strong>{"\u81ea\u5b9a\u4e49 GIF \u52a8\u4f5c"}</strong><p>{"\u4e3a\u5f85\u673a\u3001\u79fb\u52a8\u3001\u601d\u8003\u3001\u5931\u8d25\u7b49\u72b6\u6001\u4e0a\u4f20\u4e0d\u540c GIF\uff0c\u539f\u684c\u5ba0\u5f62\u8c61\u529f\u80fd\u4fdd\u7559\u3002"}</p></div><ToggleControl checked={draft.customGifPet.enabled} onChange={(enabled) => updateDraft({ customGifPet: { ...draft.customGifPet, enabled } })} ariaLabel="custom gif" /></div><div className="character-gif-grid">{CUSTOM_GIF_STATES.map((entry) => <CustomGifActionCard key={entry.state} entry={entry} gifPath={draft.customGifPet.gifs[entry.state]} enabled={draft.customGifPet.enabled} onImport={() => void importCustomGif(entry.state)} onRemove={() => removeCustomGif(entry.state)} />)}</div></article>
              </section>
            ) : null}

            {page === "stats" ? (
              <section className="studio-stats-page">
                <SegmentedControl
                  value={statsRange}
                  options={[
                    { value: "day", label: "\u4eca\u65e5" },
                    { value: "month", label: "\u672c\u6708" },
                    { value: "all", label: "\u5168\u90e8" }
                  ]}
                  onChange={setStatsRange}
                />
                <button type="button" className="pref-button" onClick={() => window.mypets.resetToday()}>{"\u91cd\u7f6e\u4eca\u65e5\u7edf\u8ba1"}</button>
                <div className="stats-rings-card">{[{ label: "\u4e13\u6ce8", value: statsForRange.focusMinutes, unit: "\u5206\u949f", pct: focusPercent, color: "#f571ad", icon: "\u2699" }, { label: "\u559d\u6c34", value: statsForRange.watersLogged, unit: "\u676f", pct: waterPercent, color: "#55c9a6", icon: "\u2667" }, { label: "\u4f11\u606f", value: statsForRange.breaksTaken * 20, unit: "\u5206\u949f", pct: breakPercent, color: "#ff9278", icon: "\u25d2" }].map((item) => <div className="stats-ring-item" key={item.label} style={{ "--ring-color": item.color, "--ring-pct": `${item.pct}%` } as CSSProperties}><div><span>{item.icon}</span><strong>{item.value}</strong><small>{item.unit}</small></div><b>{item.label}</b><em>{item.pct}% {"\u5b8c\u6210"}</em></div>)}</div>
                <div className="stats-summary-grid"><article><span>{"\u2699"}</span><div><small>{labels.focus}</small><strong>{statsForRange.focusMinutes}<em>{"\u5206\u949f"}</em></strong><p>{`${focusPercent}% \u5b8c\u6210`}</p></div></article><article><span>{"\u2667"}</span><div><small>{"\u559d\u6c34\u603b\u91cf"}</small><strong>{statsForRange.watersLogged}<em>{"\u676f"}</em></strong><p>{"\u5b8c\u6210\u7387 "}{waterPercent}%</p></div></article><article><span>{"\u25d2"}</span><div><small>{"\u4f11\u606f\u6b21\u6570"}</small><strong>{statsForRange.breaksTaken}<em>{"\u6b21"}</em></strong><p>{`${breakPercent}% \u5b8c\u6210`}</p></div></article><article><span>{"\u25b2"}</span><div><small>{"\u5f53\u524d\u8fde\u7eed\u5929\u6570"}</small><strong>{companionDays}<em>{"\u5929"}</em></strong><p>{"\u672c\u5730\u7edf\u8ba1"}</p></div></article></div>
                <StatsLineChart title={labels.focus} unit={labels.minuteUnit} points={trendPoints} metric="focusMinutes" />
                <StatsCompanionship days={companionDays} weeks={focusHeatmapWeeks} monthMarkers={monthMarkers} labels={labels} language={language} />
              </section>
            ) : null}

            {page === "settings" ? (
              <section className="studio-settings-page">
                <div className="studio-page-heading"><h2>{"\u504f\u597d\u8bbe\u7f6e"}</h2><p>{"\u4e2a\u6027\u5316\u4f60\u7684 MyPets \u4f53\u9a8c"}</p></div>
                <div className="settings-quick-grid"><div><strong>{"\u5ba0\u7269\u5927\u5c0f"}</strong><NumberControl value={Math.round(draft.petScale * 100)} min={30} max={150} unit="%" onChange={(value) => updateDraft({ petScale: value / 100 })} /></div><div><strong>{"\u6c14\u6ce1\u505c\u7559"}</strong><NumberControl value={draft.petBubbleDurationSeconds} min={0.1} max={10} step={0.1} precision={1} unit="秒" onChange={(petBubbleDurationSeconds) => updateDraft({ petBubbleDurationSeconds })} /></div><div><strong>{"\u684c\u5ba0\u6f2b\u6e38"}</strong><ToggleControl checked={draft.petRoamEnabled} onChange={(petRoamEnabled) => updateDraft({ petRoamEnabled })} ariaLabel="roam" /></div><div><strong>{"\u5206\u5fc3\u68c0\u6d4b"}</strong><ToggleControl checked={draft.distractionDetectionEnabled} onChange={(distractionDetectionEnabled) => updateDraft({ distractionDetectionEnabled })} ariaLabel="distraction" /></div></div>
                <div className="settings-list-card">
                  <Row label={labels.language} control={<SelectControl value={draft.language} options={LANGUAGE_OPTIONS} onChange={(language) => updateDraft({ language: language as Settings["language"] })} />} />
                  <Row label={labels.petRoamDirection} control={<SelectControl value={draft.petRoamDirection} options={[{ value: "both", label: labels.petRoamDirectionBoth }, { value: "vertical", label: labels.petRoamDirectionVertical }, { value: "diagonal", label: labels.petRoamDirectionDiagonal }, { value: "all", label: labels.petRoamDirectionAll }, { value: "left", label: labels.petRoamDirectionLeft }, { value: "right", label: labels.petRoamDirectionRight }]} onChange={(petRoamDirection) => updateDraft({ petRoamDirection: petRoamDirection as PetRoamDirection })} />} />
                  <Row label={labels.enableAgentActivity} hint={labels.agentActivityHelp} control={<ToggleControl checked={draft.agentActivityEnabled} onChange={(agentActivityEnabled) => updateDraft({ agentActivityEnabled })} ariaLabel={labels.enableAgentActivity} />} />
                  <Row label={labels.blockedApps} control={<ChipsControl value={draft.distractionBlockedApps} onChange={(distractionBlockedApps) => updateDraft({ distractionBlockedApps })} labels={labels} />} />
                  <Row label={labels.blockedKeywords} control={<ChipsControl value={draft.distractionBlockedKeywords} onChange={(distractionBlockedKeywords) => updateDraft({ distractionBlockedKeywords })} labels={labels} />} />
                </div>
                <article className="character-gif-panel">
                  <div className="character-gif-panel__head"><div><strong>{labels.reminderPageTitle}</strong><p>{labels.importPetHint}</p></div></div>
                  <div className="home-task-input">
                    <input value={newReminderTitle} placeholder={labels.reminderTitlePlaceholder} onChange={(event) => setNewReminderTitle(event.target.value)} />
                    <input type="time" value={newReminderTime} onChange={(event) => setNewReminderTime(event.target.value)} />
                    <button type="button" className="pref-button is-primary" onClick={addCustomReminder}>{labels.addReminder}</button>
                  </div>
                  <div className="home-task-list">
                    {draft.customReminders.length ? draft.customReminders.map((reminder) => (
                      <ReminderCard key={reminder.id} reminder={reminder} labels={labels} language={language} now={now} onChange={(partial) => updateReminder(reminder.id, partial)} onRemove={() => removeCustomReminder(reminder.id)} />
                    )) : <p>{labels.emptyReminders}</p>}
                  </div>
                </article>
                <button type="button" className="prefs__disclosure" onClick={() => setDiagnosticsOpen((open) => !open)}>
                  <span>{labels.diagnostics}</span>
                  <span className="prefs__disclosure-caret">{diagnosticsOpen ? "\u2212" : "+"}</span>
                </button>
                {diagnosticsOpen ? (
                  <div className="prefs__diag">
                    <DiagGroup title={labels.distraction}>
                      <DiagCard label={labels.status} value={formatDistractionState(snapshot.distraction.state, labels)} />
                      <DiagCard label={labels.app} value={snapshot.distraction.activeApp || "-"} />
                      <DiagCard label={labels.matched} value={snapshot.distraction.matchedRule || "-"} />
                      <DiagCard label={labels.checked} value={formatTimestamp(snapshot.distraction.lastCheckedAt, language, labels)} />
                    </DiagGroup>
                    <p className="prefs__diag-hint">{distractionHelp(snapshot, labels)}</p>
                  </div>
                ) : null}
                <div className="settings-tip">{"\u5feb\u6377\u64cd\u4f5c\uff1a\u4e13\u6ce8\u6a21\u5f0f\u4e0b\u53ef\u5c06\u5ba0\u7269\u62d6\u5230\u5c4f\u5e55\u8fb9\u7f18\u534a\u9690\u85cf\uff0c\u70b9\u51fb\u4e00\u4e0b\u5373\u53ef\u547c\u51fa\u3002"}</div>
              </section>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}

function ReminderCard({
  reminder,
  labels,
  language,
  now,
  onChange,
  onRemove
}: {
  reminder: CustomReminder;
  labels: SettingsCopy;
  language: Settings["language"];
  now: number;
  onChange: (partial: Partial<CustomReminder>) => void;
  onRemove: () => void;
}): JSX.Element {
  const dueAt = nextReminderDueAt(reminder.time, now);
  const nextLabel = formatTimer(dueAt, now, language, labels);

  return (
    <article className={`reminder-card${reminder.enabled ? "" : " is-disabled"}`}>
      <div className="reminder-card__main">
        <input
          type="text"
          className="reminder-input reminder-input--name"
          value={reminder.title}
          aria-label={labels.reminderTitle}
          onChange={(event) => {
            const title = event.target.value;
            if (title.trim()) onChange({ title });
          }}
        />
        <div className="reminder-card__meta">
          <label className="reminder-time-edit">
            <span>{labels.reminderTime}</span>
            <input
              type="time"
              className="reminder-input reminder-input--time"
              value={reminder.time}
              onChange={(event) => {
                if (event.target.value) onChange({ time: event.target.value });
              }}
            />
          </label>
          <span className="reminder-card__next">
            {labels.customReminderNextAt}: {nextLabel}
          </span>
        </div>
      </div>
      <div className="reminder-card__controls">
        <div className="reminder-toggle-row">
          <span>{labels.customReminderEnabled}</span>
          <ToggleControl
            checked={reminder.enabled}
            onChange={(enabled) => onChange({ enabled })}
            ariaLabel={labels.customReminderEnabled}
          />
        </div>
        <div className="reminder-toggle-row">
          <span>{labels.customReminderCountdown}</span>
          <ToggleControl
            checked={reminder.showCountdownOnPet}
            onChange={(showCountdownOnPet) => onChange({ showCountdownOnPet })}
            ariaLabel={labels.customReminderCountdown}
          />
        </div>
        {reminder.showCountdownOnPet ? (
          <div className="reminder-control-row reminder-control-row--number">
            <span>{labels.customReminderCountdownLead}</span>
            <NumberControl
              value={reminder.countdownLeadMinutes}
              min={1}
              max={1440}
              unit={labels.minuteUnit}
              onChange={(countdownLeadMinutes) => onChange({ countdownLeadMinutes })}
            />
          </div>
        ) : null}
        <div className="reminder-toggle-row">
          <span>{labels.customReminderEnlargeOnDue}</span>
          <ToggleControl
            checked={reminder.enlargePetOnDue}
            onChange={(enlargePetOnDue) => onChange({ enlargePetOnDue })}
            ariaLabel={labels.customReminderEnlargeOnDue}
          />
        </div>
        {reminder.enlargePetOnDue ? (
          <div className="reminder-control-row reminder-control-row--number">
            <span>{labels.customReminderEnlargeScale}</span>
            <NumberControl
              value={Math.round(reminder.duePetScaleMultiplier * 100)}
              min={100}
              max={300}
              step={10}
              unit="%"
              onChange={(duePetScalePercent) =>
                onChange({ duePetScaleMultiplier: duePetScalePercent / 100 })
              }
            />
          </div>
        ) : null}
        <button
          type="button"
          className="pref-chip-button reminder-card__remove"
          aria-label={labels.removeReminder(reminder.title)}
          onClick={onRemove}
        >
          &times;
        </button>
      </div>
    </article>
  );
}

function CustomGifActionCard({
  entry,
  gifPath,
  enabled,
  onImport,
  onRemove
}: {
  entry: { state: PetdexStateId; previewState: PetState; label: string; hint: string };
  gifPath?: string;
  enabled: boolean;
  onImport: () => void;
  onRemove: () => void;
}): JSX.Element {
  const gifUrl = gifPath ? window.mypets.assetUrl(gifPath) : null;
  return (
    <article className={`custom-gif-card${enabled ? "" : " is-disabled"}`}>
      <div className="custom-gif-card__preview">
        {gifUrl ? (
          <img src={gifUrl} alt={entry.label} draggable={false} />
        ) : (
          <span>{entry.label.slice(0, 2)}</span>
        )}
      </div>
      <div className="custom-gif-card__body">
        <strong>{entry.label}</strong>
        <small>{entry.hint}</small>
      </div>
      <div className="custom-gif-card__actions">
        <button type="button" className="pref-chip-button" onClick={onImport}>
          {gifPath ? "\u66f4\u6362" : "\u4e0a\u4f20"}
        </button>
        {gifPath ? (
          <button type="button" className="pref-chip-button" onClick={onRemove}>
            {"\u79fb\u9664"}
          </button>
        ) : null}
      </div>
    </article>
  );
}

function PetdexPickCard({
  pick
}: {
  pick: { name: string; tone: string; query: string; color: string };
}): JSX.Element {
  const searchUrl = `${PETDEX_URL}?q=${encodeURIComponent(pick.query)}`;
  return (
    <article className="petdex-pick" style={{ "--pick-color": pick.color } as CSSProperties}>
      <div className="petdex-pick__orb" aria-hidden="true">
        {pick.name.slice(0, 2)}
      </div>
      <div>
        <strong>{pick.name}</strong>
        <span>{pick.tone}</span>
      </div>
      <button
        type="button"
        className="pref-chip-button"
        onClick={() => window.mypets.openExternal(searchUrl)}
      >
        {"\u641c\u7d22"}
      </button>
    </article>
  );
}

function FigmaCharacterCard({
  character
}: {
  character: (typeof FIGMA_CHARACTERS)[number];
}): JSX.Element {
  const searchUrl = `${PETDEX_URL}?q=${encodeURIComponent(character.query)}`;
  return (
    <button
      type="button"
      className="figma-character-card"
      style={{ "--character-color": character.color, "--character-bg": character.bg } as CSSProperties}
      onClick={() => window.mypets.openExternal(searchUrl)}
      title={`${character.name} ${character.title}`}
    >
      <span className="figma-character-card__image">
        <img src={character.imageUrl} alt={character.name} draggable={false} />
      </span>
      <span className="figma-character-card__body">
        <strong>{character.name}</strong>
        <small>{character.tag}</small>
        <em>{character.title}</em>
        <span>{character.description}</span>
      </span>
    </button>
  );
}

function PetAssetPreview({ asset }: { asset: ReturnType<typeof getSelectedPetAsset> }): JSX.Element {
  if (asset.kind === "sprite") {
    return (
      <span
        className="sprite-pet sprite-pet--preview"
        style={
          {
            "--sprite-url": `url(${asset.src})`,
            "--sprite-row": asset.animation.row,
            "--sprite-frames": asset.animation.frames,
            "--sprite-duration": `${asset.animation.durationMs}ms`,
            "--sprite-frame-width": `${asset.frameWidth}px`,
            "--sprite-frame-height": `${asset.frameHeight}px`,
            "--sprite-sheet-width": `${asset.sheetWidth}px`,
            "--sprite-sheet-height": `${asset.sheetHeight}px`
          } as CSSProperties
        }
      />
    );
  }
  if (asset.kind === "gif") {
    return <img className="gif-pet gif-pet--preview" src={asset.src} alt="" draggable={false} />;
  }
  return (
    <span className="fallback-pet fallback-pet--preview" aria-hidden="true">
      <span className="fallback-pet__ear fallback-pet__ear--left" />
      <span className="fallback-pet__ear fallback-pet__ear--right" />
      <span className="fallback-pet__face">
        <span className="fallback-pet__eye fallback-pet__eye--left" />
        <span className="fallback-pet__eye fallback-pet__eye--right" />
        <span className="fallback-pet__nose" />
      </span>
      <span className="fallback-pet__tail" />
    </span>
  );
}

function PetCard({
  pet,
  label,
  selected,
  onSelect
}: {
  pet?: InstalledPet;
  label: string;
  selected: boolean;
  onSelect: () => void;
}): JSX.Element {
  const asset = useMemo(
    () => getSelectedPetAsset(pet?.slug ?? "boxcat", pet ? [pet] : [], "idle"),
    [pet]
  );
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      className={`pet-card${selected ? " is-selected" : ""}`}
      onClick={onSelect}
    >
      <span className="pet-card__preview">
        {asset.kind === "sprite" ? (
          <span
            className="sprite-pet sprite-pet--preview"
            style={
              {
                "--sprite-url": `url(${asset.src})`,
                "--sprite-row": asset.animation.row,
                "--sprite-frames": asset.animation.frames,
                "--sprite-duration": `${asset.animation.durationMs}ms`,
                "--sprite-frame-width": `${asset.frameWidth}px`,
                "--sprite-frame-height": `${asset.frameHeight}px`,
                "--sprite-sheet-width": `${asset.sheetWidth}px`,
                "--sprite-sheet-height": `${asset.sheetHeight}px`
              } as CSSProperties
            }
          />
        ) : asset.kind === "gif" ? (
          <img className="gif-pet gif-pet--preview" src={asset.src} alt="" draggable={false} />
        ) : (
          <span className="fallback-pet fallback-pet--preview" aria-hidden="true">
            <span className="fallback-pet__ear fallback-pet__ear--left" />
            <span className="fallback-pet__ear fallback-pet__ear--right" />
            <span className="fallback-pet__face">
              <span className="fallback-pet__eye fallback-pet__eye--left" />
              <span className="fallback-pet__eye fallback-pet__eye--right" />
              <span className="fallback-pet__nose" />
            </span>
            <span className="fallback-pet__tail" />
          </span>
        )}
      </span>
      <span className="pet-card__name">{label}</span>
    </button>
  );
}

function DemoChip({ trigger, label }: { trigger: DemoTrigger; label: string }): JSX.Element {
  return (
    <button
      type="button"
      className="pref-chip-button"
      onClick={() => window.mypets.triggerDemo(trigger)}
    >
      {label}
    </button>
  );
}

function DiagGroup({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <section className="diag-group">
      <h3 className="diag-group__title">{title}</h3>
      <div className="diag-group__grid">{children}</div>
    </section>
  );
}

function DiagCard({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <div className="diag-card">
      <span className="diag-card__label">{label}</span>
      <span className="diag-card__value">{value}</span>
    </div>
  );
}
