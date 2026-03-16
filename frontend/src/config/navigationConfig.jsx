import {
  FiHome,
  FiCalendar,
  FiLink,
  FiEdit3,
  FiBarChart2,
  FiFileText,
  FiCheckCircle,
  FiBell,
} from 'react-icons/fi';
import { ROUTE_PATHS } from './routeConfig';

export const PRIMARY_NAV_LINKS = [
  { to: ROUTE_PATHS.dashboard, icon: FiHome, label: 'Dashboard' },
  { to: ROUTE_PATHS.studyPlanner, icon: FiCalendar, label: 'Study Planner' },
  { to: ROUTE_PATHS.resourceHub, icon: FiLink, label: 'Resource Hub' },
  { to: ROUTE_PATHS.notes, icon: FiEdit3, label: 'Notes' },
  { to: ROUTE_PATHS.progressAnalytics, icon: FiBarChart2, label: 'Progress & Analytics' },
  { to: ROUTE_PATHS.tests, icon: FiFileText, label: 'Mock Tests' },
  { to: ROUTE_PATHS.readinessCheck, icon: FiCheckCircle, label: 'Readiness Check' },
  { to: ROUTE_PATHS.reminders, icon: FiBell, label: 'Reminders' },
];

export const INTERVIEW_NAV_LINKS = [
  { to: ROUTE_PATHS.interviewDashboard, label: 'Interview Dashboard' },
  { to: ROUTE_PATHS.interviewQuestionBank, label: 'Interview Question Bank' },
  { to: ROUTE_PATHS.interviewMock, label: 'Mock Interview' },
  { to: ROUTE_PATHS.interviewPracticeTopics, label: 'Interview Practice Topics' },
  { to: ROUTE_PATHS.interviewResumePrep, label: 'Resume Preparation' },
  { to: ROUTE_PATHS.interviewExperience, label: 'Interview Experience' },
  { to: ROUTE_PATHS.interviewPerformance, label: 'Performance Tracker' },
  { to: ROUTE_PATHS.interviewReadiness, label: 'Readiness Indicator' },
];
