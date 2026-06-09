// home.js
// Renders the Home Dashboard page with mock data.

import dashboardService from '../../services/dashboardService.js';

const homePage = {
  render(container) {
    const stats = dashboardService.getOverviewStats();
    const keepGoing = dashboardService.getKeepGoingData();
    const timeSpent = dashboardService.getTimeSpentData();
    const progress = dashboardService.getCourseProgressData();

    // Map stats icons
    const iconMap = {
      'book-open': 'book-open',
      'check-circle': 'check-circle',
      'trending-up': 'trending-up',
      'alert-circle': 'alert-circle'
    };

    container.innerHTML = `
      <div class="page-view dashboard-container">
        
        <!-- Blue Banner -->
        <div class="dashboard-banner">
          <div class="banner-content">
            <h2 class="banner-greeting">Hii Name! 👋</h2>
            <span class="banner-subtitle">READY TO LEARN</span>
          </div>
        </div>

        <!-- Stats Grid (Overlapping) -->
        <div class="stats-cards-grid">
          ${stats.map(stat => `
            <div class="stat-card color-${stat.color}" id="stat-${stat.id}">
              <div class="stat-icon-wrapper">
                <i data-lucide="${iconMap[stat.icon]}" class="stat-icon"></i>
              </div>
              <span class="stat-title">${stat.title}</span>
              <span class="stat-label">${stat.label}</span>
            </div>
          `).join('')}
        </div>

        <!-- Mid Row (Keep Going & Time Spent) -->
        <div class="dashboard-row-mid">
          
          <!-- Keep Going Card -->
          <div class="keep-going-card">
            <div class="card-badge-pill">
              <i data-lucide="zap" style="width: 12px; height: 12px; fill: #ffdf40; stroke: #ffdf40;"></i>
              <span>${keepGoing.badge}</span>
            </div>
            
            <div class="keep-going-content">
              <h3 class="keep-going-title">${keepGoing.title}</h3>
              <p class="keep-going-desc">${keepGoing.description}</p>
            </div>
            
            <a href="#course" class="continue-btn">
              <span>${keepGoing.buttonText}</span>
              <i data-lucide="arrow-right" style="width: 16px; height: 16px;"></i>
            </a>
          </div>

          <!-- Time Spent Card -->
          <div class="time-spent-card">
            <div class="card-badge-pill time-spent-badge">
              <i data-lucide="zap" style="width: 12px; height: 12px; fill: #ffdf40; stroke: #ffdf40;"></i>
              <span>${timeSpent.badge}</span>
            </div>
            
            <div class="venn-container">
              <!-- Learning Contents Circle -->
              <div class="venn-circle circle-learning">
                <span class="venn-circle-title">${timeSpent.categories[0].title}</span>
                <span class="venn-circle-hours">${timeSpent.categories[0].hours}</span>
                <span class="venn-circle-label">${timeSpent.categories[0].label}</span>
              </div>
              
              <!-- Assessment Circle -->
              <div class="venn-circle circle-assessment">
                <span class="venn-circle-hours">${timeSpent.categories[1].hours}</span>
                <span class="venn-circle-label">${timeSpent.categories[1].label}</span>
              </div>
              
              <!-- Practice Circle -->
              <div class="venn-circle circle-practice">
                <span class="venn-circle-hours">${timeSpent.categories[2].hours}</span>
                <span class="venn-circle-label">${timeSpent.categories[2].label}</span>
              </div>
            </div>
          </div>

        </div>

        <!-- Bottom Row (Course Progress) -->
        <div class="course-progress-card">
          <div class="course-progress-header">
            <div class="course-progress-info">
              <div class="course-icon-bg">
                <i data-lucide="book-open" style="width: 20px; height: 20px;"></i>
              </div>
              <div class="course-title-sub">
                <h3>${progress.title}</h3>
                <span>${progress.subtitle}</span>
              </div>
            </div>
            <span class="progress-percent-label">${progress.percent}% Completed</span>
          </div>

          <!-- SVG Progress Chart -->
          <div class="line-chart-container">
            <svg viewBox="0 0 1000 120" class="chart-svg" preserveAspectRatio="none">
              <!-- Blue baseline tracker -->
              <line x1="100" y1="90" x2="900" y2="90" class="chart-baseline" style="stroke: #e2e8f0; stroke-width: 2;" />
              <line x1="100" y1="90" x2="900" y2="90" class="chart-baseline" />
              
              <!-- Completion Line curve -->
              <path d="M 100 80 Q 250 50 400 45 T 700 40 T 900 35" class="chart-line" />
              
              <!-- Interactive dots -->
              <circle cx="100" cy="80" r="5" class="chart-point" data-desc="Day 0: 0%" />
              <circle cx="400" cy="45" r="5" class="chart-point" data-desc="Day 4: 35%" />
              <circle cx="600" cy="41" r="5" class="chart-point" data-desc="Day 8: 40%" />
              <circle cx="800" cy="35" r="5" class="chart-point" data-desc="Day 12: 48%" />
              
              <!-- X axis scale labels -->
              <text x="100" y="112" class="chart-label" text-anchor="middle">0%</text>
              <text x="900" y="112" class="chart-label" text-anchor="middle">100%</text>
            </svg>
          </div>

          <!-- Date fields & view button -->
          <div class="course-progress-footer">
            <div class="date-ranges">
              <div class="date-item">
                <i data-lucide="calendar"></i>
                <div>
                  <span class="date-lbl">Start Date</span>
                  <span class="date-val">${progress.startDate}</span>
                </div>
              </div>
              
              <div class="date-separator"></div>
              
              <div class="date-item">
                <i data-lucide="calendar"></i>
                <div>
                  <span class="date-lbl">End Date</span>
                  <span class="date-val">${progress.endDate}</span>
                </div>
              </div>
            </div>
            
            <a href="#course" class="view-course-btn">View Course</a>
          </div>
        </div>

      </div>
    `;

    // Re-initialize lucide icons inside container
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
};

export default homePage;
