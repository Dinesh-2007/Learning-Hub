export const MOCK_DASHBOARD_SUMMARY = {
  completion_percentage: 68,
  completed_topics: 124,
  total_topics: 182,
  tests_completed: 26,
  resources_count: 58,
  weekly_study_hours: 12.5,
  current_streak: 9,
  longest_streak: 21,
  total_points: 1840,
  today_tasks: [
    { id: 1, title: 'Dynamic Programming drills', subject: 'DSA', priority: 'high', is_completed: false },
    { id: 2, title: 'OS: Scheduling algorithms notes', subject: 'Operating Systems', priority: 'medium', is_completed: true },
    { id: 3, title: 'Mock test review', subject: 'Full Syllabus', priority: 'low', is_completed: false },
  ],
  upcoming_events: [
    { title: 'System Design mock', date: '2026-03-20', type: 'interview' },
    { title: 'GATE-style full length test', date: '2026-03-22', type: 'exam' },
    { title: 'Peer review session', date: '2026-03-25', type: 'interview' },
  ],
};

export const MOCK_PERFORMANCE = {
  total_tests: 26,
  average_score: 78,
  average_accuracy: 84,
  best_score: 94,
  scores_over_time: [
    { date: '2026-02-20', score: 66, accuracy: 74 },
    { date: '2026-02-27', score: 72, accuracy: 79 },
    { date: '2026-03-05', score: 80, accuracy: 85 },
    { date: '2026-03-10', score: 83, accuracy: 86 },
    { date: '2026-03-14', score: 88, accuracy: 90 },
    { date: '2026-03-17', score: 92, accuracy: 93 },
  ],
  weak_areas: [
    { subject: 'Computer Networks', avg_accuracy: 58 },
    { subject: 'DBMS', avg_accuracy: 54 },
    { subject: 'Probability & Stats', avg_accuracy: 49 },
  ],
};

export const MOCK_SUBJECT_BREAKDOWN = [
  { subject: 'Algorithms', avg_score: 82, avg_accuracy: 86 },
  { subject: 'Data Structures', avg_score: 84, avg_accuracy: 88 },
  { subject: 'OS', avg_score: 76, avg_accuracy: 79 },
  { subject: 'DBMS', avg_score: 69, avg_accuracy: 71 },
  { subject: 'CN', avg_score: 72, avg_accuracy: 74 },
];

export const MOCK_PRODUCTIVITY = {
  weekly_trend: [
    { label: 'Week 1', hours: 10, tasks: 18 },
    { label: 'Week 2', hours: 11.5, tasks: 21 },
    { label: 'Week 3', hours: 13, tasks: 24 },
    { label: 'Week 4', hours: 12.5, tasks: 22 },
  ],
  focus_by_day: [
    { day: 'Mon', deep: 3.2, review: 1.4 },
    { day: 'Tue', deep: 2.8, review: 1.1 },
    { day: 'Wed', deep: 3.5, review: 1.6 },
    { day: 'Thu', deep: 2.4, review: 1.9 },
    { day: 'Fri', deep: 2.9, review: 1.2 },
    { day: 'Sat', deep: 1.8, review: 2.1 },
    { day: 'Sun', deep: 1.2, review: 1.5 },
  ],
  milestones: [
    { title: 'Finish DP patterns', status: 'ahead', eta: 'Mar 19', confidence: 82 },
    { title: 'Revise DBMS joins', status: 'on-track', eta: 'Mar 21', confidence: 76 },
    { title: 'CN practice tests', status: 'at-risk', eta: 'Mar 24', confidence: 58 },
  ],
};
