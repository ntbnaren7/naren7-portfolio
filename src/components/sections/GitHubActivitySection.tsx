import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import snapshot from "../../data/github-activity.json";
import { sectionIntros } from "../../data/portfolio";

type Calendar = Omit<typeof snapshot, "username">;
type ContributionDay = Calendar["contributions"][number];
type DayTooltip = { text: string; left: number; top: number };

const calendarUrl = `https://github-contributions-api.jogruber.de/v4/${snapshot.username}?y=last`;
const formatDate = new Intl.DateTimeFormat("en", { dateStyle: "medium" });
const dayOffsets: Record<string, number> = {
  ArrowUp: -1,
  ArrowDown: 1,
  ArrowLeft: -7,
  ArrowRight: 7,
};

const cacheKey = `github-calendar:${snapshot.username}`;
const cacheMaxAge = 60 * 60 * 1000;

function isCalendar(data: unknown): data is Calendar {
  const calendar = data as Calendar | null;
  return (
    Number.isInteger(calendar?.total?.lastYear) &&
    Array.isArray(calendar?.contributions) &&
    calendar.contributions.length > 0
  );
}

// Last fetched calendar, kept in the visitor's browser so reloads render it
// instantly. Storage can be unavailable, so every access is guarded.
function readCachedCalendar() {
  try {
    const cached = JSON.parse(localStorage.getItem(cacheKey) ?? "null");
    if (!isCalendar(cached?.data) || typeof cached.savedAt !== "number") {
      return null;
    }
    return {
      data: cached.data,
      fresh: Date.now() - cached.savedAt < cacheMaxAge,
    };
  } catch {
    return null;
  }
}

function writeCachedCalendar(data: Calendar) {
  try {
    localStorage.setItem(
      cacheKey,
      JSON.stringify({ savedAt: Date.now(), data }),
    );
  } catch {
    /* The live calendar still renders without storage. */
  }
}

function dayDescription(day: ContributionDay) {
  return `${day.count} ${day.count === 1 ? "contribution" : "contributions"} on ${formatDate.format(new Date(`${day.date}T12:00:00`))}`;
}

export function GitHubActivitySection() {
  const calendarRef = useRef<HTMLDivElement>(null);
  const [cached] = useState(readCachedCalendar);
  const [liveCalendar, setLiveCalendar] = useState<Calendar | null>(
    cached?.data ?? null,
  );
  const [refreshFailed, setRefreshFailed] = useState(false);
  const [tooltip, setTooltip] = useState<DayTooltip | null>(null);
  const [focusedDate, setFocusedDate] = useState<string | null>(null);

  useEffect(() => {
    if (cached?.fresh) return;
    const controller = new AbortController();

    async function refreshCalendar() {
      try {
        const response = await fetch(calendarUrl, {
          cache: "no-store",
          signal: AbortSignal.any([
            controller.signal,
            AbortSignal.timeout(8000),
          ]),
        });
        if (!response.ok) throw new Error("Contribution calendar unavailable");

        const data: unknown = await response.json();
        if (!isCalendar(data)) {
          throw new Error("Invalid contribution calendar");
        }
        writeCachedCalendar(data);
        if (!controller.signal.aborted) setLiveCalendar(data);
      } catch {
        // A stale cached calendar is still better than the bundled snapshot.
        if (!controller.signal.aborted && !cached) setRefreshFailed(true);
      }
    }

    void refreshCalendar();
    return () => controller.abort();
  }, [cached]);

  // On phones the calendar scrolls sideways; start at the latest weeks.
  useEffect(() => {
    const el = calendarRef.current;
    if (el && el.scrollWidth > el.clientWidth) el.scrollLeft = el.scrollWidth;
  }, [liveCalendar]);

  const calendar = liveCalendar ?? snapshot;
  const days = calendar.contributions;
  const tabStop =
    days.find((day) => day.date === focusedDate)?.date ?? days.at(-1)?.date;
  const leadingDays = new Date(`${days[0].date}T12:00:00`).getDay();
  const months = days.filter(
    (day, i) => i === 0 || new Date(`${day.date}T12:00:00`).getDate() === 1,
  );

  function showDay(day: ContributionDay, cell: HTMLButtonElement) {
    const grid = cell.parentElement!.getBoundingClientRect();
    const rect = cell.getBoundingClientRect();
    const gutter = Math.min(126, window.innerWidth / 2);
    const center = Math.max(
      gutter,
      Math.min(window.innerWidth - gutter, rect.left + rect.width / 2),
    );
    setTooltip({
      text: dayDescription(day),
      left: center - grid.left,
      top: rect.top - grid.top,
    });
  }

  function onDayKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    if (event.key === "Escape") {
      setTooltip(null);
      return;
    }
    const offset = dayOffsets[event.key];
    if (offset === undefined) return;
    event.preventDefault();
    const next = Math.min(days.length - 1, Math.max(0, index + offset));
    event.currentTarget.parentElement
      ?.querySelector<HTMLButtonElement>(`[data-day-index="${next}"]`)
      ?.focus();
  }

  return (
    <section
      className="portfolio-section activity-section"
      aria-labelledby="activity-title"
    >
      <div className="section-heading full-divider">
        <h2 id="activity-title">GitHub Activity</h2>
        <span className="activity-total" role="status">
          {liveCalendar ? (
            <>
              {calendar.total.lastYear}
              <span className="activity-total-long"> GitHub</span> contributions
              <span className="activity-total-long"> in the last year</span>
            </>
          ) : refreshFailed ? (
            `${snapshot.total.lastYear} contributions (saved snapshot)`
          ) : (
            "Updating contributions…"
          )}
        </span>
      </div>
      <p className="section-callout">{sectionIntros.activity}</p>
      <div className="activity-calendar" ref={calendarRef}>
        <div className="calendar-months">
          {months.map((month) => (
            <span key={month.date}>
              {new Date(`${month.date}T12:00:00`).toLocaleString("en", {
                month: "short",
              })}
            </span>
          ))}
        </div>
        <div
          className="calendar-grid"
          role="group"
          aria-label={`Daily GitHub contributions for ${snapshot.username} over the last year`}
        >
          {Array.from({ length: leadingDays }, (_, index) => (
            <span aria-hidden="true" key={index} />
          ))}
          {days.map((day, index) => (
            <button
              type="button"
              className={`calendar-day level-${day.level}`}
              key={day.date}
              data-day-index={index}
              aria-label={dayDescription(day)}
              tabIndex={day.date === tabStop ? 0 : -1}
              onPointerEnter={(event) => showDay(day, event.currentTarget)}
              onPointerLeave={() => setTooltip(null)}
              onFocus={(event) => {
                setFocusedDate(day.date);
                showDay(day, event.currentTarget);
              }}
              onBlur={() => setTooltip(null)}
              onClick={(event) => showDay(day, event.currentTarget)}
              onKeyDown={(event) => onDayKeyDown(event, index)}
            />
          ))}
          {tooltip && (
            <span
              className="calendar-tooltip"
              aria-hidden="true"
              style={{ left: tooltip.left, top: tooltip.top }}
            >
              {tooltip.text}
            </span>
          )}
        </div>
        <div className="calendar-legend">
          <span>Less active</span>
          <div>
            {[0, 1, 2, 3, 4].map((level) => (
              <i key={level} className={`level-${level}`} />
            ))}
            <span>More active</span>
          </div>
        </div>
      </div>
    </section>
  );
}
