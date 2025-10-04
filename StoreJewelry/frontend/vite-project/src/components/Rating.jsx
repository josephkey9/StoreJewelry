import { useMemo } from "react";
import "../App.css";

function Rating({ value }) {
  const numeric = useMemo(() => {
    const v = Number(value);
    if (!Number.isFinite(v)) return 0;
    if (v <= 1) return Math.round(v * 5 * 10) / 10;
    if (v > 5) return Math.round((v / 100) * 5 * 10) / 10;
    return Math.round(v * 10) / 10;
  }, [value]);

  const stars = useMemo(() => {
    const full = Math.floor(numeric);
    const half = value - full >= 0.5;
    return Array.from({ length: 5 }, (_, i) => {
      if (i < full) return "full";
      if (i === full && half) return "half";
      return "empty";
    });
  }, [numeric, value]);

  return (
    <div className="rating" aria-label={`Rating ${value} out of 5`}>
      {stars.map((t, i) => (
        <span key={i} className={`star ${t}`} />
      ))}
      <span className="rating-text">{numeric.toFixed(1)}/5</span>
    </div>
  );
}

export default Rating;
