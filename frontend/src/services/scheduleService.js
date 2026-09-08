import apiClient from "./apiClient";

const USE_MOCK_DATA = false;

function getSelectedCourseId() {
  const storedCourseId = Number(localStorage.getItem("selected_course_id"));
  return Number.isFinite(storedCourseId) && storedCourseId > 0 ? storedCourseId : null;
}

const mockScheduleData = {
  course_name: "Frontend Development Bootcamp",
  summary: {
    total_modules: 16,
    total_sections: 32,
    total_days: 28,
    total_hours: 96
  },
  weeks: [
    {
      label: "Week 1",
      range: "Jul 28 - Aug 03",
      days: [
        {
          name: "Monday",
          shortName: "Mon",
          date: "28",
          status: "inprogress",
          sessions: [
            {
              start_time: "09:00",
              end_time: "10:30",
              title: "React Fundamentals",
              learning_unit_id: 101,
              completed: false,
              description: "Introduction to components and JSX"
            },
            {
              start_time: "10:45",
              end_time: "12:15",
              title: "State Management",
              learning_unit_id: 102,
              completed: true,
              description: "Hooks and shared state patterns"
            }
          ]
        },
        {
          name: "Tuesday",
          shortName: "Tue",
          date: "29",
          status: "upcoming",
          sessions: [
            {
              start_time: "09:00",
              end_time: "10:30",
              title: "Component Design",
              learning_unit_id: 103,
              completed: true,
              description: "Reusable UI patterns"
            },
            {
              start_time: "14:15",
              end_time: "15:45",
              title: "API Integration",
              learning_unit_id: 104,
              completed: true,
              description: "Connecting the UI to REST services"
            }
          ]
        },
        {
          name: "Wednesday",
          shortName: "Wed",
          date: "30",
          status: "upcoming",
          sessions: [
            {
              start_time: "11:00",
              end_time: "12:30",
              title: "Testing Basics",
              learning_unit_id: 105,
              completed: false,
              description: "Unit testing with Vitest"
            }
          ]
        },
        {
          name: "Thursday",
          shortName: "Thu",
          date: "31",
          status: "upcoming",
          sessions: [
            {
              start_time: "15:00",
              end_time: "16:30",
              title: "Routing",
              learning_unit_id: 106,
              completed: false,
              description: "Page navigation and layouts"
            }
          ]
        },
        {
          name: "Friday",
          shortName: "Fri",
          date: "01",
          status: "upcoming",
          sessions: [
            {
              start_time: "09:00",
              end_time: "10:30",
              title: "Accessibility",
              learning_unit_id: 107,
              completed: false,
              description: "Inclusive UI practices"
            }
          ]
        },
        {
          name: "Saturday",
          shortName: "Sat",
          date: "02",
          status: "upcoming",
          sessions: []
        },
        {
          name: "Sunday",
          shortName: "Sun",
          date: "03",
          status: "upcoming",
          sessions: []
        }
      ]
    },
    {
      label: "Week 2",
      range: "Aug 04 - Aug 10",
      days: [
        {
          name: "Monday",
          shortName: "Mon",
          date: "04",
          status: "upcoming",
          sessions: [
            {
              start_time: "09:00",
              end_time: "10:30",
              title: "Forms and Validation",
              learning_unit_id: 201,
              completed: false,
              description: "Controlled inputs and validation"
            }
          ]
        },
        {
          name: "Tuesday",
          shortName: "Tue",
          date: "05",
          status: "upcoming",
          sessions: [
            {
              start_time: "10:45",
              end_time: "12:15",
              title: "Performance Tips",
              learning_unit_id: 202,
              completed: false,
              description: "Optimizing rendering and bundles"
            }
          ]
        },
        {
          name: "Wednesday",
          shortName: "Wed",
          date: "06",
          status: "upcoming",
          sessions: [
            {
              start_time: "13:00",
              end_time: "14:30",
              title: "Deployment",
              learning_unit_id: 203,
              completed: false,
              description: "Publishing your app"
            }
          ]
        },
        {
          name: "Thursday",
          shortName: "Thu",
          date: "07",
          status: "upcoming",
          sessions: []
        },
        {
          name: "Friday",
          shortName: "Fri",
          date: "08",
          status: "upcoming",
          sessions: []
        },
        {
          name: "Saturday",
          shortName: "Sat",
          date: "09",
          status: "upcoming",
          sessions: []
        },
        {
          name: "Sunday",
          shortName: "Sun",
          date: "10",
          status: "upcoming",
          sessions: []
        }
      ]
    },
    {
      label: "Week 3",
      range: "Aug 11 - Aug 17",
      days: [
        {
          name: "Monday",
          shortName: "Mon",
          date: "11",
          status: "upcoming",
          sessions: [
            {
              start_time: "09:30",
              end_time: "11:00",
              title: "Stateful Forms",
              learning_unit_id: 301,
              completed: false,
              description: "Designing advanced forms"
            }
          ]
        },
        {
          name: "Tuesday",
          shortName: "Tue",
          date: "12",
          status: "upcoming",
          sessions: [
            {
              start_time: "10:00",
              end_time: "11:30",
              title: "Animations",
              learning_unit_id: 302,
              completed: false,
              description: "Motion and transitions"
            }
          ]
        },
        {
          name: "Wednesday",
          shortName: "Wed",
          date: "13",
          status: "upcoming",
          sessions: [
            {
              start_time: "13:30",
              end_time: "15:00",
              title: "Auth Workflows",
              learning_unit_id: 303,
              completed: false,
              description: "Login, logout, and protected routes"
            }
          ]
        },
        {
          name: "Thursday",
          shortName: "Thu",
          date: "14",
          status: "upcoming",
          sessions: []
        },
        {
          name: "Friday",
          shortName: "Fri",
          date: "15",
          status: "upcoming",
          sessions: []
        },
        {
          name: "Saturday",
          shortName: "Sat",
          date: "16",
          status: "upcoming",
          sessions: []
        },
        {
          name: "Sunday",
          shortName: "Sun",
          date: "17",
          status: "upcoming",
          sessions: []
        }
      ]
    },
    {
      label: "Week 4",
      range: "Aug 18 - Aug 24",
      days: [
        {
          name: "Monday",
          shortName: "Mon",
          date: "18",
          status: "upcoming",
          sessions: [
            {
              start_time: "09:00",
              end_time: "10:30",
              title: "Project Setup",
              learning_unit_id: 401,
              completed: false,
              description: "Kickoff the capstone project"
            }
          ]
        },
        {
          name: "Tuesday",
          shortName: "Tue",
          date: "19",
          status: "upcoming",
          sessions: [
            {
              start_time: "10:30",
              end_time: "12:00",
              title: "Capstone Build",
              learning_unit_id: 402,
              completed: false,
              description: "Implementing project features"
            }
          ]
        },
        {
          name: "Wednesday",
          shortName: "Wed",
          date: "20",
          status: "upcoming",
          sessions: [
            {
              start_time: "14:00",
              end_time: "15:30",
              title: "Review and Feedback",
              learning_unit_id: 403,
              completed: false,
              description: "Peer review and refinements"
            }
          ]
        },
        {
          name: "Thursday",
          shortName: "Thu",
          date: "21",
          status: "upcoming",
          sessions: []
        },
        {
          name: "Friday",
          shortName: "Fri",
          date: "22",
          status: "upcoming",
          sessions: []
        },
        {
          name: "Saturday",
          shortName: "Sat",
          date: "23",
          status: "upcoming",
          sessions: []
        },
        {
          name: "Sunday",
          shortName: "Sun",
          date: "24",
          status: "upcoming",
          sessions: []
        }
      ]
    }
  ]
};

function transformScheduleResponse(api, weekNumber = 0) {
  let weeks = [];

  if (api.weeks) {
    weeks = api.weeks.map((week) => ({
      ...week,
      days: (week.days || []).map((day) => ({
        ...day,
        sessions: (day.sessions || []).map((session) => ({ ...session }))
      }))
    }));
  } else if (api.schedule) {
    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "";
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return `${months[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}`;
    };

    const days = (api.schedule || []).map((day) => {
      const dateValue = day.date ? new Date(day.date) : null;
      const dateParts = day.date ? String(day.date).split("-") : [];
      const dayDate = dateParts[2] ? dateParts[2].replace(/^0+/, "") : (dateValue ? String(dateValue.getDate()) : "");

      const shortWeekday = day.weekday ? day.weekday.substring(0, 3) : "";
      const frontendStatus = day.status === "current" ? "inprogress" : day.status;

      return {
        name: day.weekday,
        shortName: shortWeekday,
        date: dayDate,
        status: frontendStatus,
        sessions: (day.sessions || []).map((session) => ({
          ...session
        }))
      };
    });

    const totalWeekCount = Math.max(1, Math.ceil(days.length / 7));
    const safeWeekIndex = Math.min(Math.max(weekNumber, 0), totalWeekCount - 1);
    const startIndex = safeWeekIndex * 7;
    const selectedWeekDays = days.slice(startIndex, startIndex + 7);

    const startRange = selectedWeekDays.length > 0 && selectedWeekDays[0].date
      ? formatDate((api.schedule[startIndex] || api.schedule[0])?.date)
      : "";
    const endRange = selectedWeekDays.length > 0 && selectedWeekDays[selectedWeekDays.length - 1].date
      ? formatDate((api.schedule[Math.min(startIndex + selectedWeekDays.length - 1, api.schedule.length - 1)] || api.schedule[api.schedule.length - 1])?.date)
      : "";
    const range = startRange && endRange ? `${startRange} - ${endRange}` : "";

    weeks = [
      {
        label: `Week ${safeWeekIndex + 1}`,
        range,
        days: selectedWeekDays
      }
    ];
  }

  return {
    title: api.course_name,
    stats: [
      {
        label: "Modules",
        value: api.summary?.total_modules || 0,
        color: "#3563e9"
      },
      {
        label: "Sections",
        value: api.summary?.total_sections || 0,
        color: "#0dcd94"
      },
      {
        label: "Days",
        value: api.summary?.total_days || 0,
        color: "#ff9f43"
      },
      {
        label: "Total Hours",
        value: `${api.summary?.total_hours || 0} hrs`,
        color: "#1a202c"
      }
    ],
    weeks
  };
}

function getMockScheduleData(weekNumber = 0, courseId = null) {
  if (courseId) {
    const courseTitle = courseId === 1 ? "Java Training" : courseId === 2 ? "SQL Training" : "C# Training";
    return transformScheduleResponse({
      course_name: courseTitle,
      summary: {
        total_modules: 5,
        total_sections: 5,
        total_days: 5,
        total_hours: 7.5
      },
      weeks: [
        {
          label: `Week ${weekNumber + 1}`,
          range: "Jul 28 - Aug 01",
          days: [
            {
              name: "Monday",
              shortName: "Mon",
              date: "28",
              status: "completed",
              sessions: [
                {
                  start_time: "09:00",
                  end_time: "10:30",
                  title: courseId === 1 ? "Algorithm Basics" : courseId === 2 ? "SQL Joins" : "OOP Concepts",
                  learning_unit_id: courseId === 1 ? 1 : courseId === 2 ? 12 : 25,
                  completed: true,
                  course_id: courseId,
                  course_name: courseTitle
                }
              ]
            },
            {
              name: "Tuesday",
              shortName: "Tue",
              date: "29",
              status: "inprogress",
              sessions: [
                {
                  start_time: "09:00",
                  end_time: "10:30",
                  title: courseId === 1 ? "Control Structures" : courseId === 2 ? "Aggregations" : "Classes & Interfaces",
                  learning_unit_id: courseId === 1 ? 2 : courseId === 2 ? 13 : 26,
                  completed: false,
                  course_id: courseId,
                  course_name: courseTitle
                }
              ]
            },
            {
              name: "Wednesday",
              shortName: "Wed",
              date: "30",
              status: "upcoming",
              sessions: [
                {
                  start_time: "09:00",
                  end_time: "10:30",
                  title: courseId === 1 ? "OOP Principles" : courseId === 2 ? "Indexing" : "LINQ Queries",
                  learning_unit_id: courseId === 1 ? 3 : courseId === 2 ? 14 : 27,
                  completed: false,
                  course_id: courseId,
                  course_name: courseTitle
                }
              ]
            },
            {
              name: "Thursday",
              shortName: "Thu",
              date: "31",
              status: "upcoming",
              sessions: [
                {
                  start_time: "09:00",
                  end_time: "10:30",
                  title: courseId === 1 ? "Exception Handling" : courseId === 2 ? "Transactions" : "Async & Await",
                  learning_unit_id: courseId === 1 ? 4 : courseId === 2 ? 15 : 28,
                  completed: false,
                  course_id: courseId,
                  course_name: courseTitle
                }
              ]
            },
            {
              name: "Friday",
              shortName: "Fri",
              date: "01",
              status: "upcoming",
              sessions: [
                {
                  start_time: "09:00",
                  end_time: "10:30",
                  title: courseId === 1 ? "Collections Framework" : courseId === 2 ? "Stored Procedures" : "Entity Framework",
                  learning_unit_id: courseId === 1 ? 5 : courseId === 2 ? 16 : 29,
                  completed: false,
                  course_id: courseId,
                  course_name: courseTitle
                }
              ]
            }
          ]
        }
      ]
    }, weekNumber);
  }

  return transformScheduleResponse({
    course_name: "All Courses",
    summary: {
      total_modules: 15,
      total_sections: 15,
      total_days: 5,
      total_hours: 22.5
    },
    weeks: [
      {
        label: `Week ${weekNumber + 1}`,
        range: "Jul 28 - Aug 01",
        days: [
          {
            name: "Monday",
            shortName: "Mon",
            date: "28",
            status: "inprogress",
            sessions: [
              {
                start_time: "09:00",
                end_time: "10:30",
                title: "Algorithm Basics",
                learning_unit_id: 1,
                completed: true,
                course_id: 1,
                course_name: "Java Training"
              },
              {
                start_time: "10:45",
                end_time: "12:15",
                title: "SQL Joins",
                learning_unit_id: 12,
                completed: false,
                course_id: 2,
                course_name: "SQL Training"
              },
              {
                start_time: "12:30",
                end_time: "14:00",
                title: "OOP Concepts",
                learning_unit_id: 25,
                completed: false,
                course_id: 3,
                course_name: "C# Training"
              }
            ]
          },
          {
            name: "Tuesday",
            shortName: "Tue",
            date: "29",
            status: "upcoming",
            sessions: [
              {
                start_time: "09:00",
                end_time: "10:30",
                title: "Control Structures",
                learning_unit_id: 2,
                completed: false,
                course_id: 1,
                course_name: "Java Training"
              },
              {
                start_time: "10:45",
                end_time: "12:15",
                title: "Aggregations",
                learning_unit_id: 13,
                completed: false,
                course_id: 2,
                course_name: "SQL Training"
              },
              {
                start_time: "12:30",
                end_time: "14:00",
                title: "Classes & Interfaces",
                learning_unit_id: 26,
                completed: false,
                course_id: 3,
                course_name: "C# Training"
              }
            ]
          },
          {
            name: "Wednesday",
            shortName: "Wed",
            date: "30",
            status: "upcoming",
            sessions: [
              {
                start_time: "09:00",
                end_time: "10:30",
                title: "OOP Principles",
                learning_unit_id: 3,
                completed: false,
                course_id: 1,
                course_name: "Java Training"
              },
              {
                start_time: "10:45",
                end_time: "12:15",
                title: "Indexing & Optimization",
                learning_unit_id: 14,
                completed: false,
                course_id: 2,
                course_name: "SQL Training"
              },
              {
                start_time: "12:30",
                end_time: "14:00",
                title: "LINQ Queries",
                learning_unit_id: 27,
                completed: false,
                course_id: 3,
                course_name: "C# Training"
              }
            ]
          },
          {
            name: "Thursday",
            shortName: "Thu",
            date: "31",
            status: "upcoming",
            sessions: [
              {
                start_time: "09:00",
                end_time: "10:30",
                title: "Exception Handling",
                learning_unit_id: 4,
                completed: false,
                course_id: 1,
                course_name: "Java Training"
              },
              {
                start_time: "10:45",
                end_time: "12:15",
                title: "Transactions & Locks",
                learning_unit_id: 15,
                completed: false,
                course_id: 2,
                course_name: "SQL Training"
              },
              {
                start_time: "12:30",
                end_time: "14:00",
                title: "Async & Await",
                learning_unit_id: 28,
                completed: false,
                course_id: 3,
                course_name: "C# Training"
              }
            ]
          },
          {
            name: "Friday",
            shortName: "Fri",
            date: "01",
            status: "upcoming",
            sessions: [
              {
                start_time: "09:00",
                end_time: "10:30",
                title: "Collections Framework",
                learning_unit_id: 5,
                completed: false,
                course_id: 1,
                course_name: "Java Training"
              },
              {
                start_time: "10:45",
                end_time: "12:15",
                title: "Stored Procedures",
                learning_unit_id: 16,
                completed: false,
                course_id: 2,
                course_name: "SQL Training"
              },
              {
                start_time: "12:30",
                end_time: "14:00",
                title: "Entity Framework Core",
                learning_unit_id: 29,
                completed: false,
                course_id: 3,
                course_name: "C# Training"
              }
            ]
          }
        ]
      }
    ]
  }, weekNumber);
}

const clientScheduleCache = {};
const CLIENT_CACHE_TTL = 15000; // 15 seconds

const scheduleService = {
  async getScheduleData(userId = 1, weekNumber = 0, courseId = null) {
    const cacheKey = `c_sched_${userId}_${weekNumber}_${courseId || 'all'}`;
    const now = Date.now();
    if (clientScheduleCache[cacheKey] && (now - clientScheduleCache[cacheKey].timestamp < CLIENT_CACHE_TTL)) {
      return clientScheduleCache[cacheKey].data;
    }

    if (USE_MOCK_DATA) {
      const mockResult = getMockScheduleData(weekNumber, courseId);
      clientScheduleCache[cacheKey] = { data: mockResult, timestamp: now };
      return mockResult;
    }

    try {
      const response = await apiClient.get(`/schedule/${userId}`, {
        params: {
          week: weekNumber,
          ...(courseId ? { course_id: courseId } : {})
        }
      });
      const transformed = transformScheduleResponse(response.data, weekNumber);
      clientScheduleCache[cacheKey] = { data: transformed, timestamp: now };
      return transformed;
    } catch (error) {
      console.warn("Backend unavailable, using mock schedule data:", error);
      const mockResult = getMockScheduleData(weekNumber, courseId);
      clientScheduleCache[cacheKey] = { data: mockResult, timestamp: now };
      return mockResult;
    }
  }
};

export default scheduleService;