import { useEffect, useState } from "react";
import snapshot from "../../data/github-activity.json";

type Calendar = Omit<typeof snapshot, "username">;

const calendarUrl = `https://github-contributions-api.jogruber.de/v4/${snapshot.username}?y=last`;

export function GitHubActivitySection() {
  const [liveCalendar, setLiveCalendar] = useState<Calendar | null>(null);
  const [refreshFailed, setRefreshFailed] = useState(false);

  useEffect(() => {
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

        const data: Calendar = await response.json();
        if (
          !Number.isInteger(data.total?.lastYear) ||
          !data.contributions?.length
        ) {
          throw new Error("Invalid contribution calendar");
        }
        if (!controller.signal.aborted) setLiveCalendar(data);
      } catch {
        if (!controller.signal.aborted) setRefreshFailed(true);
      }
    }

    void refreshCalendar();
    return () => controller.abort();
  }, []);

  const calendar = liveCalendar ?? snapshot;
  const days = calendar.contributions;
  const months = days.filter(
    (day, i) => i === 0 || new Date(`${day.date}T12:00:00`).getDate() === 1,
  );

  return (
    <section
      className="portfolio-section activity-section"
      aria-labelledby="activity-title"
    >
      <div className="section-heading full-divider">
        <h2 id="activity-title">GitHub Activity</h2>
        <span className="activity-total" role="status">
          {liveCalendar
            ? `${calendar.total.lastYear} GitHub contributions in the last year`
            : refreshFailed
              ? `${snapshot.total.lastYear} contributions (saved snapshot)`
              : "Updating contributions…"}
        </span>
      </div>
      <div className="activity-calendar">
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
          aria-label={`Daily GitHub contributions for ${snapshot.username} over the last year`}
        >
          {days.map((day) => (
            <div
              className={`calendar-day level-${day.level}`}
              key={day.date}
              title={`${day.count} contributions on ${day.date}`}
            />
          ))}
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
