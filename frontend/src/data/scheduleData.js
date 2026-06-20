export const timeSlots = [
  { id: "slot1", start: "09:00", end: "10:30", label: "09:00 to 10:30" },
  { id: "slot2", start: "10:45", end: "12:15", label: "10:45 to 12:15" },
  { id: "slot3", start: "12:30", end: "14:00", label: "12:30 to 14:00" },
  { id: "slot4", start: "14:15", end: "15:45", label: "14:15 to 15:45" },
  { id: "slot5", start: "16:00", end: "17:30", label: "16:00 to 17:30" }
];

export const daysOfWeek = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY"
];

export const scheduleStats = [
  { label: "Modules", value: "64", dotColor: "blue" },
  { label: "Sections", value: "12", dotColor: "green" },
  { label: "Days", value: "12", dotColor: "yellow" },
  { label: "Total Hours/Week", value: "26 hrs", dotColor: null }
];

export const scheduleEvents = [
  {
    day: "MONDAY",
    slotId: "slot1",
    type: "LECTURE",
    title: "Data Structures & CS201",
    instructor: "Dr. Smith",
    colorClass: "card-blue"
  },
  {
    day: "TUESDAY",
    slotId: "slot1",
    type: "SECTION",
    title: "Web Developer CS110",
    instructor: "Prof. Johnson",
    colorClass: "card-green"
  },
  {
    day: "TUESDAY",
    slotId: "slot2",
    type: "LECTURE",
    title: "Software Engineering CS315",
    instructor: "Dr. Williams",
    colorClass: "card-blue"
  },
  {
    day: "THURSDAY",
    slotId: "slot2",
    type: "LECTURE",
    title: "Software Engineering CS315",
    instructor: "Dr. Williams",
    colorClass: "card-blue"
  },
  {
    day: "WEDNESDAY",
    slotId: "slot3",
    type: "LAB",
    title: "Database CS320",
    instructor: "Prof. Davis",
    colorClass: "card-purple"
  },
  {
    day: "MONDAY",
    slotId: "slot4",
    type: "LECTURE",
    title: "Machine Learning CS401",
    instructor: "Dr. Martinez",
    colorClass: "card-blue"
  },
  {
    day: "TUESDAY",
    slotId: "slot4",
    type: "SECTION",
    title: "Cloud Computing CS405",
    instructor: "Prof. Anderson",
    colorClass: "card-green"
  }
];
