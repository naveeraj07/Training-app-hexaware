// dashboardService.js
// Service providing mock data for the Home page dashboard.

const dashboardService = {
  getUserProfile() {
    return {
      name: "Name",
      email: "h.tech@email.com"
    };
  },

  getOverviewStats() {
    return [
      {
        id: "current-course",
        title: "Core Java",
        label: "Course Enrolled",
        icon: "book-open", // represented by a book-like SVG/icon
        color: "blue"
      },
      {
        id: "modules-completed",
        title: "5",
        label: "Modules Completed",
        icon: "check-circle",
        color: "green"
      },
      {
        id: "overall-completion",
        title: "10.3%",
        label: "Over All Completion",
        icon: "trending-up",
        color: "blue"
      },
      {
        id: "courses-enrolled",
        title: "0",
        label: "Course Enrolled",
        icon: "alert-circle",
        color: "red"
      }
    ];
  },

  getKeepGoingData() {
    return {
      badge: "Keep Going!",
      title: "61 Modules Almost Done",
      description: "You're making amazing progress! Finish your courses and unlock new achievements.",
      buttonText: "Continue Learning"
    };
  },

  getTimeSpentData() {
    return {
      badge: "Time spent",
      categories: [
        {
          id: "learning-contents",
          title: "5 Day",
          hours: "05:00 hrs",
          label: "Learning Contents",
          color: "#3563e9" // Primary Blue
        },
        {
          id: "assessment",
          title: "",
          hours: "02:03:30 hrs",
          label: "Assessment",
          color: "#5c6f84" // Charcoal Gray
        },
        {
          id: "practice",
          title: "",
          hours: "00:00:40 hrs",
          label: "Practice",
          color: "#0dcd94" // Accent Green
        }
      ]
    };
  },

  getCourseProgressData() {
    return {
      title: "Core Java",
      subtitle: "Day 7 of 12",
      percent: 48,
      startDate: "13 May, 26",
      endDate: "13 May, 26",
      chartPoints: [
        { day: 0, percentage: 0 },
        { day: 4, percentage: 35 },
        { day: 8, percentage: 40 },
        { day: 12, percentage: 48 }
      ]
    };
  }
};

export default dashboardService;
