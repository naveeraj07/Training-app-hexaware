// dashboardService.js
// Service providing home dashboard telemetry data (Enrolled courses, timeline charts, and cards).
import axios from 'axios';

// 💡 SET TO 'false' WHEN BACKEND IS DOWN TO USE LOCAL MOCK DATA
const IS_BACKEND_RUNNING = true; 

const API_BASE_URL = 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

const sleep = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

const dashboardService = {
  
  /**
   * CENTRAL DASHBOARD API: GET /dashboard/{user_id}
   * Fetches all aggregated metrics: courses, progress, timeline, and learning hours.
   */
  async getDashboardData(userId) {
    if (!IS_BACKEND_RUNNING) {
      await sleep();
      // Safe fallback data exactly matching the structure from Dashboard_Module_Full_Documentation.pdf
      return {
        employee_id: "EMP001",
        email: "empoo1@example.com",
        courses_enrolled: 1,
        current_course: {
          course_id: 1,
          course_name: "Java",
          current_day: 1,
          day_progress_percentage: 33.33,
          duration_days: 16,
          start_date: "2026-06-09",
          end_date: "2026-06-24",
          total_modules: 46,
          completed_modules: 1,
          remaining_modules: 45,
          progress_percentage: 2.54,
          learning_minutes_completed: 20,
          assessment_time_hours: 1,
          assignment_time_hours: 5,
          day_wise_progress: [
            { day: 1, progress_percentage: 20 },
            { day: 2, progress_percentage: 10 },
            { day: 3, progress_percentage: 0 },
            { day: 4, progress_percentage: 33.33 }
          ]
        }
      };
    }
    
    // Live Endpoint connection
    const response = await apiClient.get(`/dashboard/${userId}`);
    return response.data;
  },

  // ---------------------------------------------------------------------------
  // UI MAPPING HELPER FUNCTIONS 
  // These map the central API response (above) to your specific React components
  // ---------------------------------------------------------------------------

  async getUserProfile(userId) {
    const data = await this.getDashboardData(userId);
    return {
      name: data.employee_id, // Or use a name field if your backend adds one
      email: data.email
    };
  },

  async getOverviewStats(userId) {
    const data = await this.getDashboardData(userId);
    const course = data.current_course;
    
    return [
      { id: "current-course", title: course.course_name, label: "Course Enrolled", icon: "book-open", color: "blue" },
      { id: "modules-completed", title: course.completed_modules.toString(), label: "Modules Completed", icon: "check-circle", color: "green" },
      { id: "overall-completion", title: `${course.progress_percentage}%`, label: "Over All Completion", icon: "trending-up", color: "blue" },
      { id: "courses-enrolled", title: data.courses_enrolled.toString(), label: "Courses Enrolled", icon: "alert-circle", color: "red" }
    ];
  },

  async getTimeSpentData(userId) {
    const data = await this.getDashboardData(userId);
    const course = data.current_course;
    
    // Converting minutes to HH:MM format for UI
    const learningHours = Math.floor(course.learning_minutes_completed / 60);
    const learningMins = course.learning_minutes_completed % 60;
    
    return {
      badge: "Time spent",
      categories: [
        { 
          id: "learning-contents", 
          title: `Day ${course.current_day}`, 
          hours: `${learningHours.toString().padStart(2, '0')}:${learningMins.toString().padStart(2, '0')} hrs`, 
          label: "Learning Contents", 
          color: "#3563e9" 
        },
        { 
          id: "assessment", 
          title: "", 
          hours: `${course.assessment_time_hours.toString().padStart(2, '0')}:00 hrs`, 
          label: "Assessment", 
          color: "#5c6f84" 
        },
        { 
          id: "practice", 
          title: "", 
          hours: `${course.assignment_time_hours.toString().padStart(2, '0')}:00 hrs`, 
          label: "Practice", 
          color: "#0dcd94" 
        }
      ]
    };
  },

  async getKeepGoingData(userId) {
    const data = await this.getDashboardData(userId);
    const remaining = data.current_course.remaining_modules;
    
    return {
      badge: "Keep Going!",
      title: `${remaining} Modules Almost Done`,
      description: "You're making amazing progress! Finish your courses and unlock new achievements.",
      buttonText: "Continue Learning"
    };
  },

  async getCourseProgressData(userId) {
    const data = await this.getDashboardData(userId);
    const course = data.current_course;
    
    return {
      title: course.course_name,
      subtitle: `Day ${course.current_day} of ${course.duration_days}`,
      percent: course.progress_percentage,
      startDate: course.start_date,
      endDate: course.end_date,
      chartPoints: course.day_wise_progress
    };
  },

  // ---------------------------------------------------------------------------
  // 🆕 NEW FUNCTION ADDED BELOW FOR THE PROFILE VIEW
  // ---------------------------------------------------------------------------
  async getProfileViewData(userId) {
    try {
      const data = await this.getDashboardData(userId);
      return {
        name: data.employee_id || "Alex Mercer",
        email: data.email || "alex.mercer@devstudent.io"
      };
    } catch (error) {
      // Fallback structural safety layout
      return {
        name: "Alex Mercer",
        email: "alex.mercer@devstudent.io"
      };
    }
  }
};

export default dashboardService;