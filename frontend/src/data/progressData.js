export const certificateData = {
  requirementsPercent: 58,
  checklist: [
    { id: "modules", text: "Complete all 48 modules", completed: true },
    { id: "assessments", text: "Pass all assessments (2/3 completed)", completed: false }
  ],
  isLocked: true
};

export const learningInsights = [
  {
    id: "insight-1",
    title: "You learn best at 9:00 AM",
    subtitle: "Based on your completion patterns"
  },
  {
    id: "insight-2",
    title: "20% ahead of average pace",
    subtitle: "You're making excellent progress!"
  },
  {
    id: "insight-3",
    title: "Estimated completion: May 22, 2026",
    subtitle: "2 days earlier than scheduled"
  }
];

export const assessmentResults = [
  {
    id: "java-basics",
    name: "Java Basics Quiz",
    score: 85,
    total: 100,
    status: "Passed",
    percent: 85
  },
  {
    id: "oop-mid",
    name: "OOP Mid-Assessment",
    score: 78,
    total: 100,
    status: "Passed",
    percent: 78
  },
  {
    id: "ds-quiz",
    name: "Data Structures Quiz",
    score: null,
    total: 100,
    status: "Upcoming",
    percent: 0
  }
];
