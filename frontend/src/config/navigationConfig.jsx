import {
  FiHome,
  FiCalendar,
  FiBook,
  FiBarChart2,
  FiFileText,
  FiCheckCircle,
  FiBell,
} from 'react-icons/fi';
import { ROUTE_PATHS } from './routeConfig';

export const PRIMARY_NAV_LINKS = [
  { to: ROUTE_PATHS.dashboard, icon: FiHome, label: 'Dashboard' },
  { to: ROUTE_PATHS.studyPlanner, icon: FiCalendar, label: 'Study Planner' },
  { to: ROUTE_PATHS.learningResources, icon: FiBook, label: 'Learning Resources' },
  { to: ROUTE_PATHS.progressAnalytics, icon: FiBarChart2, label: 'Progress & Analytics' },
  { to: ROUTE_PATHS.tests, icon: FiFileText, label: 'Mock Tests' },
  { to: ROUTE_PATHS.readinessCheck, icon: FiCheckCircle, label: 'Readiness Check' },
  { to: ROUTE_PATHS.reminders, icon: FiBell, label: 'Reminders' },
];

export const INTERVIEW_NAV_LINKS = [
  { to: '/interview/dashboard', label: 'Interview Dashboard' },
  { to: '/interview/question-bank', label: 'Interview Question Bank' },
  { to: '/interview/mock-interview', label: 'Mock Interview' },
  { to: '/interview/practice-topics', label: 'Interview Practice Topics' },
  { to: '/interview/resume-prep', label: 'Resume Preparation' },
  { to: '/interview/experience', label: 'Interview Experience' },
  { to: '/interview/performance', label: 'Performance Tracker' },
  { to: '/interview/readiness', label: 'Readiness Indicator' },
];
