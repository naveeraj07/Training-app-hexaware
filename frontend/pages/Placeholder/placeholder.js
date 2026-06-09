// placeholder.js
// Renders standard placeholder page layout for menu items that do not require full implementation.

const placeholderPage = {
  render(container, title, description) {
    let iconName = 'layout';
    if (title === 'Progress') iconName = 'star';
    else if (title === 'Notes') iconName = 'file-text';
    else if (title === 'Profile') iconName = 'user';
    else if (title === 'Logged Out') iconName = 'log-out';

    container.innerHTML = `
      <div class="page-view placeholder-page-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center; color: var(--text-medium); font-family: var(--font-family-body);">
        <div class="placeholder-icon-wrapper" style="width: 80px; height: 80px; border-radius: 20px; background-color: var(--primary-blue-light); color: var(--primary-blue); display: flex; align-items: center; justify-content: center; margin-bottom: 24px; box-shadow: var(--card-shadow);">
          <i data-lucide="${iconName}" style="width: 40px; height: 40px;"></i>
        </div>
        <h2 class="placeholder-title" style="font-family: var(--font-family-header); font-size: 28px; font-weight: 800; color: var(--text-dark); margin-bottom: 8px;">${title}</h2>
        <p class="placeholder-desc" style="font-size: 16px; color: var(--text-light); max-width: 400px; line-height: 1.5; margin-bottom: 32px;">${description}</p>
        
        <div class="placeholder-card" style="background: white; border: 1px solid var(--border-color); border-radius: 16px; padding: 24px 32px; box-shadow: var(--card-shadow); max-width: 480px; width: 100%;">
          <h4 style="font-family: var(--font-family-header); font-size: 16px; font-weight: 700; color: var(--text-dark); margin-bottom: 8px;">Development Notice</h4>
          <p style="font-size: 14px; color: var(--text-medium); line-height: 1.4;">This section represents a placeholder menu item. The Home, Course, and Schedule tabs are fully functional training environments.</p>
        </div>
      </div>
    `;
    
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
};

export default placeholderPage;
