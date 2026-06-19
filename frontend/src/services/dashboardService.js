// dashboardService.js
// Service providing home dashboard telemetry data (Enrolled courses, timeline charts, and cards).
import axios from 'axios';

// 💡 SET TO 'false' WHEN BACKEND IS DOWN TO USE LOCAL MOCK DATA
const IS_BACKEND_RUNNING = false; 

const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

const sleep = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

const dashboardService = {
  async getUserProfile() {
    return {
      name: "Name",
      email: "h.tech@email.com"
    };
  },

  async getProfileData() {
    return {
      name: "Name",
      email: "hexaware.tech@email.com",
      sidebarEmail: "h.tech@email.com"
    };
  },

  async getOverviewStats() {
    if (!IS_BACKEND_RUNNING) {
      await sleep();
      return [
        { id: "current-course", title: "Core Java", label: "Course Enrolled", icon: "book-open", color: "blue" },
        { id: "modules-completed", title: "5", label: "Modules Completed", icon: "check-circle", color: "green" },
        { id: "overall-completion", title: "10.3%", label: "Over All Completion", icon: "trending-up", color: "blue" },
        { id: "courses-enrolled", title: "0", label: "Course Enrolled", icon: "alert-circle", color: "red" }
      ];
    }
    // Live Endpoint substitution mapping
    const response = await apiClient.get('/dashboard/stats');
    return response.data;
  },

  async getKeepGoingData() {
    return {
      badge: "Keep Going!",
      title: "61 Modules Almost Done",
      description: "You're making amazing progress! Finish your courses and unlock new achievements.",
      buttonText: "Continue Learning"
    };
  },

  async getTimeSpentData() {
    return {
      badge: "Time spent",
      categories: [
        { id: "learning-contents", title: "1 Day", hours: "05:00 hrs", label: "Learning Contents", color: "#3563e9" },
        { id: "assessment", title: "", hours: "00:03:20 hrs", label: "Assessment", color: "#5c6f84" },
        { id: "practice", title: "", hours: "00:01:40 hrs", label: "Practice", color: "#0dcd94" }
      ]
    };
  },

  // GET /courses/users/{user_id}
  async getCoursesByUser(userId) {
    if (!IS_BACKEND_RUNNING) {
      await sleep();
      return [
        { id: 101, title: "Core Java", description: "Java Core Architecture Plan", duration_days: 12 }
      ];
    }
    const response = await apiClient.get(`/courses/users/${userId}`);
    return response.data;
  },

  // GET /progress/course/{course_id}/user/{user_id}
  async getCourseProgress(courseId, userId) {
    if (!IS_BACKEND_RUNNING) {
      await sleep();
      return { percentage: 48, completed_units: 5, total_units: 46 };
    }
    const response = await apiClient.get(`/progress/course/${courseId}/user/${userId}`);
    return response.data;
  },

  // GET /progress/users/{user_id}/timeline
  async getProgressTimeline(userId) {
    if (!IS_BACKEND_RUNNING) {
      await sleep();
      return [
        { day: 1, completed_units: 2 },
        { day: 4, completed_units: 5 },
        { day: 8, completed_units: 8 },
        { day: 12, completed_units: 11 }
      ];
    }
    const response = await apiClient.get(`/progress/users/${userId}/timeline`);
    return response.data;
  }
};

export default dashboardService;