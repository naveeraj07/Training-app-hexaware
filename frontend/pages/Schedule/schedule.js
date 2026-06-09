// schedule.js
// Renders the Weekly Schedule page.

import scheduleService from '../../services/scheduleService.js';

const schedulePage = {
  render(container) {
    const data = scheduleService.getScheduleData();

    // Map Lucide icons for stats
    const statsIcons = {
      'Modules': 'book-open',
      'Sections': 'layers',
      'Days': 'calendar',
      'Total Hours/Week': 'clock'
    };

    container.innerHTML = `
      <div class="page-view schedule-container">
        
        <!-- Schedule Page Banner -->
        <div class="schedule-banner">
          
          <div class="schedule-banner-left">
            <i data-lucide="calendar"></i>
            <h2 class="schedule-banner-title">${data.title}</h2>
          </div>

          <div class="schedule-banner-right">
            <button class="schedule-banner-btn" id="btn-share">
              <i data-lucide="share-2"></i>
              <span>Share</span>
            </button>
            <button class="schedule-banner-btn" id="btn-export">
              <i data-lucide="download"></i>
              <span>Export</span>
            </button>
          </div>

          <!-- Statistics Overlay Card -->
          <div class="schedule-stats-card">
            ${data.stats.map(stat => `
              <div class="schedule-stat-item">
                ${stat.label !== 'Total Hours/Week' ? `
                  <div class="schedule-stat-icon-circle" style="background-color: ${stat.color};"></div>
                ` : ''}
                <div class="schedule-stat-info">
                  <span class="schedule-stat-lbl">${stat.label}</span>
                  <span class="schedule-stat-val">${stat.value}</span>
                </div>
              </div>
            `).join('')}
          </div>

        </div>

        <!-- Timetable Outer Wrapper -->
        <div class="timetable-outer-container">
          <div class="timetable-grid">
            
            <!-- Table Headers -->
            <div class="timetable-header-cell">
              <i data-lucide="clock"></i>
            </div>
            ${data.days.map(day => `
              <div class="timetable-header-cell">${day}</div>
            `).join('')}

            <!-- Timetable Rows -->
            ${data.timeSlots.map(slot => {
              // Time cell content: split \n to <br>
              const timeHtml = slot.replace(/\n/g, '<br>');
              
              // For each day, look up matching event
              const cellsHtml = data.days.map(day => {
                const event = data.events.find(e => e.day === day && e.timeSlot === slot);
                
                if (event) {
                  // Category bullet symbol (•)
                  return `
                    <div class="timetable-grid-cell">
                      <div class="schedule-event-card ${event.colorClass}" id="event-${event.code}-${event.day}">
                        <span class="event-type-badge">• ${event.type}</span>
                        <h4 class="event-title">${event.title}</h4>
                        <span class="event-code">${event.code}</span>
                        <span class="event-instructor">${event.instructor}</span>
                      </div>
                    </div>
                  `;
                } else {
                  return `<div class="timetable-grid-cell"></div>`;
                }
              }).join('');

              return `
                <!-- Time slot indicator cell -->
                <div class="timetable-time-cell">${timeHtml}</div>
                <!-- Day cells -->
                ${cellsHtml}
              `;
            }).join('')}

          </div>
        </div>

      </div>
    `;

    // Add click events for sharing/exporting feedback (just visual alert)
    const shareBtn = container.querySelector('#btn-share');
    const exportBtn = container.querySelector('#btn-export');
    
    shareBtn.addEventListener('click', () => {
      alert('Sharing schedule schedule_export.json link copied!');
    });
    
    exportBtn.addEventListener('click', () => {
      alert('Downloading schedule schedule_export.json...');
    });

    // Re-initialize lucide icons inside container
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
};

export default schedulePage;
