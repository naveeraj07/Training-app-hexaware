import React from "react";

export default function StatCard({ label, value, dotColor }) {
  return (
    <div className="schedule-stat-item">
      {dotColor && (
        <span className={`schedule-stat-dot ${dotColor}`}></span>
      )}
      <div className="schedule-stat-info">
        <span className="schedule-stat-label">{label}</span>
        <span className="schedule-stat-value">{value}</span>
      </div>
    </div>
  );
}
