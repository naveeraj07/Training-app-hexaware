// progressService.js
// Service managing course requirements, milestones, certificate status, and assessment metrics.
import axios from 'axios';

// 💡 SET TO 'false' WHEN BACKEND IS DOWN TO USE LOCAL MOCK DATA
const IS_BACKEND_RUNNING = false; 

const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

const sleep = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

const progressService = {
  /**
   * Fetches overall requirement progress, modules completion stats, and quizzes.
   * Maps to your backend computation workflows when live.
   */
  async getProgressOverview(userId = 1) {
    if (!IS_BACKEND_RUNNING) {
      await sleep();
      return {
        percentage: 58,
        completedModules: 48,
        totalModules: 48,
        completedAssessments: 2,
        totalAssessments: 3,
        insights: [
          {
            title: "You learn best at 9:00 AM",
            description: "Based on your completion patterns"
          },
          {
            title: "20% ahead of average pace",
            description: "You're making excellent progress!"
          },
          {
            title: "Estimated completion: May 22, 2026",
            description: "2 days earlier than scheduled"
          }
        ],
        assessments: [
          {
            id: "java-basics",
            title: "Java Basics Quiz",
            status: "Passed",
            score: 85,
            total: 100,
            details: "Score: 85/100"
          },
          {
            id: "oop-mid",
            title: "OOP Mid-Assessment",
            status: "Passed",
            score: 78,
            total: 100,
            details: "Score: 78/100"
          },
          {
            id: "data-structures",
            title: "Data Structures Quiz",
            status: "Upcoming",
            score: null,
            total: null,
            details: "Not yet taken"
          }
        ]
      };
    }

    // When backend is running, fetch dynamically using your progress/course paths
    const response = await apiClient.get(`/progress/overview/user/${userId}`);
    return response.data;
  }
};

export default progressService;