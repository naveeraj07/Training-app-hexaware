// course.js
// Renders the Course Content page.

import courseService from '../../services/courseService.js';

const coursePage = {
  render(container) {
    const course = courseService.getCourseData();

    container.innerHTML = `
      <div class="page-view course-container">
        
        <!-- Course Page Banner -->
        <div class="course-banner">
          
          <div class="course-banner-left">
            <div>
              <span class="course-breadcrumb">${course.category}</span>
              <h2 class="course-banner-title">${course.title}</h2>
            </div>
            
            <!-- Tabs -->
            <div class="course-tabs-wrapper">
              <a href="#course" class="course-tab active">${course.tabs[0]}</a>
              <a href="#course" class="course-tab inactive">${course.tabs[1]}</a>
            </div>
          </div>

          <!-- Progress Widget -->
          <div class="course-banner-right">
            
            <!-- Progress val -->
            <div class="course-banner-stat">
              <span class="course-banner-stat-lbl">PROGRESS</span>
              <span class="course-banner-stat-val">${course.progress}%</span>
              <div class="course-progress-track">
                <div class="course-progress-bar" style="width: ${course.progress}%;"></div>
              </div>
            </div>
            
            <!-- Current Day -->
            <div class="course-banner-stat">
              <span class="course-banner-stat-lbl">CURRENT DAY</span>
              <span class="course-banner-stat-val">${course.currentDay}/${course.totalDays}</span>
            </div>

          </div>

        </div>

        <!-- Modules Section -->
        <div class="modules-section">
          ${course.modules.map(module => {
            const isFirst = module.id === 1;
            const badgeClass = isFirst ? 'active-badge' : 'inactive-badge';
            
            return `
              <div class="module-group" id="module-${module.id}">
                <!-- Module Header -->
                <div class="module-header">
                  <div class="module-badge ${badgeClass}">${module.id}</div>
                  <div class="module-details">
                    <h3 class="module-title">${module.title}</h3>
                    <span class="module-day">
                      <i data-lucide="clock"></i>
                      <span>${module.dayLabel}</span>
                    </span>
                  </div>
                </div>

                <!-- Lessons List -->
                <div class="lessons-list">
                  ${module.lessons.map(lesson => `
                    <div class="lesson-card" id="lesson-${lesson.id}">
                      
                      <!-- Left side info -->
                      <div class="lesson-info">
                        <div class="lesson-title-row">
                          <h4 class="lesson-title">${lesson.title}</h4>
                          <span class="lesson-duration">${lesson.duration}</span>
                        </div>
                        
                        <!-- Lesson actions (buttons) -->
                        <div class="lesson-actions">
                          <button class="lesson-action-btn action-video">
                            <i data-lucide="play" style="fill: #ffffff;"></i>
                            <span>${lesson.videos} Videos</span>
                          </button>
                          
                          ${lesson.hasNotes ? `
                            <button class="lesson-action-btn action-notes">
                              <i data-lucide="file-text"></i>
                              <span>Notes</span>
                            </button>
                          ` : ''}
                        </div>
                      </div>

                      <!-- Checkbox status -->
                      <div class="lesson-checkbox-wrapper">
                        <div class="lesson-checkbox ${lesson.completed ? 'checkbox-checked' : 'checkbox-unchecked'}" data-lesson="${lesson.id}">
                          ${lesson.completed ? '<i data-lucide="check"></i>' : ''}
                        </div>
                      </div>

                    </div>
                  `).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>

      </div>
    `;

    // Add click handler to toggle checkbox completeness dynamically (for interactivity)
    const checkboxes = container.querySelectorAll('.lesson-checkbox');
    checkboxes.forEach(box => {
      box.addEventListener('click', () => {
        const isChecked = box.classList.contains('checkbox-checked');
        if (isChecked) {
          box.classList.remove('checkbox-checked');
          box.classList.add('checkbox-unchecked');
          box.innerHTML = '';
        } else {
          box.classList.remove('checkbox-unchecked');
          box.classList.add('checkbox-checked');
          box.innerHTML = '<i data-lucide="check"></i>';
          if (window.lucide) {
            window.lucide.createIcons();
          }
        }
      });
    });

    // Re-initialize lucide icons inside container
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
};

export default coursePage;
