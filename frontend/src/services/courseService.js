// courseService.js
// Service providing real API calls using Axios to connect the Course page to the backend database endpoints.
import axios from 'axios';

// Vite-safe environment variable lookup with standard local fallback
const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL)
  ? import.meta.env.VITE_API_BASE_URL
  : 'http://localhost:8000';

// Create a pre-configured Axios client instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const courseService = {
  // 1. Fetch full course relational structure (Course -> Days -> Units)
  // Endpoint: GET /courses/{course_id}/content
  async getCourseContent(courseId) {
    const response = await apiClient.get(`/courses/${courseId}/content`);
    return response.data;
  },

  // 2. Fetch current user progress tracking metrics for a specific course
  // Endpoint: GET /progress/course/{course_id}/user/{user_id}
  async getCourseProgress(courseId, userId) {
    const response = await apiClient.get(`/progress/course/${courseId}/user/${userId}`);
    return response.data;
  },

  // 3. Mark a learning topic unit as complete for a user
  // Endpoint: POST /progress/{user_id}/{learning_unit_id}/complete
  async markUnitComplete(userId, learningUnitId) {
    const response = await apiClient.post(`/progress/${userId}/${learningUnitId}/complete`);
    return response.data;
  },

  // 4. Revert a learning topic unit back to incomplete status
  // Endpoint: POST /progress/{user_id}/{learning_unit_id}/incomplete
  async markUnitIncomplete(userId, learningUnitId) {
    const response = await apiClient.post(`/progress/${userId}/${learningUnitId}/incomplete`);
    return response.data;
  },

  // 5. Query lecture streaming media files tied to a unit node
  // Endpoint: GET /courses/units/{learning_unit_id}/videos
  async getUnitVideos(learningUnitId) {
    const response = await apiClient.get(`/courses/units/${learningUnitId}/videos`);
    return response.data;
  },

  // 6. Pull theory notes or documentation summaries for a specific topic
  // Endpoint: GET /courses/units/{learning_unit_id}/notes
  async getUnitNotes(learningUnitId) {
    const response = await apiClient.get(`/courses/units/${learningUnitId}/notes`);
    return response.data;
  },

  // 7. Extract discussion forum/board records assigned to a learning segment
  // Endpoint: GET /courses/units/{learning_unit_id}/qa
  async getUnitQA(learningUnitId) {
    const response = await apiClient.get(`/courses/units/${learningUnitId}/qa`);
    return response.data;
  }
};

export default courseService;