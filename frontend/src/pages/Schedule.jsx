import React, { useState } from "react";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import { daysOfWeek, timeSlots, scheduleStats, scheduleEvents } from "../data/scheduleData";
import jsPDF from "jspdf";

export default function Schedule() {
  const [toastMessage, setToastMessage] = useState("");

  // Find event helper
  const getEventFor = (day, slotId) => {
    return scheduleEvents.find(e => e.day === day && e.slotId === slotId);
  };

  // Clipboard copy share function
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Hexaware Schedule",
        url: window.location.href,
      })
        .then(() => {
          setToastMessage("Schedule shared successfully!");
          setTimeout(() => setToastMessage(""), 3000);
        })
        .catch((err) => {
          console.error("Web Share failed: ", err);
          // fallback to clipboard copy
          navigator.clipboard
            .writeText(window.location.href)
            .then(() => {
              setToastMessage("Schedule link copied to clipboard!");
              setTimeout(() => setToastMessage(""), 3000);
            })
            .catch((cErr) => {
              console.error("Clipboard copy failed: ", cErr);
              setToastMessage("Could not share or copy link.");
              setTimeout(() => setToastMessage(""), 3000);
            });
        });
    } else {
      // Fallback for browsers without Web Share support
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          setToastMessage("Schedule link copied to clipboard!");
          setTimeout(() => setToastMessage(""), 3000);
        })
        .catch((err) => {
          console.error("Failed to copy link: ", err);
          setToastMessage("Could not copy link.");
          setTimeout(() => setToastMessage(""), 3000);
        });
    }
  };

    // PDF export function using jsPDF
  const handleExport = () => {
    try {
      const doc = new jsPDF();
      const margin = 15;
      const lineHeight = 7;
      let y = margin;

      // Title
      doc.setFontSize(16);
      doc.text('Hexaware Weekly Schedule', margin, y);
      y += lineHeight + 3;

      // Header row
      doc.setFontSize(12);
      const headers = ['Day', 'Time Slot', 'Type', 'Course Title', 'Instructor'];
      const headerLine = headers.join('   ');
      const pageWidth = doc.internal.pageSize.getWidth();
      const maxWidth = pageWidth - margin * 2;
      const headerLines = doc.splitTextToSize(headerLine, maxWidth);
      headerLines.forEach(line => {
        doc.text(line, margin, y);
        y += lineHeight;
      });
      y += 2; // small gap

      // Data rows
      scheduleEvents.forEach(event => {
        const slot = timeSlots.find(s => s.id === event.slotId);
        const timeLabel = slot ? slot.label : '';
        const row = [event.day, timeLabel, event.type, event.title, event.instructor]
          .join('   ');
        const rowLines = doc.splitTextToSize(row, maxWidth);
        rowLines.forEach(line => {
          if (y > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage();
            y = margin;
          }
          doc.text(line, margin, y);
          y += lineHeight;
        });
      });

      doc.save('hexaware_weekly_schedule.pdf');
      setToastMessage('PDF exported successfully!');
      setTimeout(() => setToastMessage(''), 3000);
    } catch (err) {
      console.error('PDF export error:', err);
      setToastMessage('PDF export failed. Check console.');
      setTimeout(() => setToastMessage(''), 4000);
    }
  };

  return (
    <div className="view-section" style={{ position: "relative" }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification">
          {toastMessage}
        </div>
      )}

      {/* Blue Banner Header */}
      <Header
        title="Weekly Schedule"
        subtitle="Check deadlines, class hours, and live session times"
        icon={
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        }
      >
        <button className="btn-translucent" onClick={handleShare}>
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742a3.001 3.001 0 110 4.516l-3.344-1.897m3.344-2.619l-3.344 1.897m3.344-1.897a3 3 0 113.882 3.882l-3.344-1.897m-3.344 1.897a3 3 0 11-3.882-3.882l3.344 1.897"></path>
          </svg>
          Share
        </button>
        <button className="btn-translucent" onClick={handleExport}>
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
          </svg>
          Export
        </button>
      </Header>

      {/* Statistics Cards Row */}
      <div className="schedule-stats-card">
        {scheduleStats.map((stat, i) => (
          <StatCard
            key={i}
            label={stat.label}
            value={stat.value}
            dotColor={stat.dotColor}
          />
        ))}
      </div>

      {/* Weekly Timetable Grid */}
      <div className="schedule-grid-container">
        <div className="schedule-grid">
          {/* Corner Cell */}
          <div className="grid-corner-cell">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V12h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>

          {/* Day Headers */}
          {daysOfWeek.map(day => (
            <div key={day} className="grid-header-cell">
              {day}
            </div>
          ))}

          {/* Timetable Slots Grid */}
          {timeSlots.map(slot => (
            <React.Fragment key={slot.id}>
              {/* Row Header - Time slot label */}
              <div className="grid-time-cell">
                {slot.start}
                {slot.end}
              </div>

              {/* Grid cell for each day of this slot */}
              {daysOfWeek.map(day => {
                const event = getEventFor(day, slot.id);
                return (
                  <div key={day} className="grid-cell">
                    {event ? (
                      <div className={`schedule-card ${event.colorClass}`}>
                        <span className="schedule-card-badge">{event.type}</span>
                        <span className="schedule-card-title">{event.title}</span>
                        <span className="schedule-card-instructor">{event.instructor}</span>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
