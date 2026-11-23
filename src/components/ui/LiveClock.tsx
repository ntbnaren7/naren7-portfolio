import { useEffect, useState } from "react";

function currentTime() {
  return new Date().toLocaleTimeString("en-GB");
}

export function LiveClock() {
  const [time, setTime] = useState(currentTime);

  useEffect(() => {
    const timer = window.setInterval(() => setTime(currentTime()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <time className="hero-clock" dateTime={time}>
      {time.replaceAll(":", ".")}
    </time>
  );
}
