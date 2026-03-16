import { FiBell, FiAlertTriangle, FiAward, FiInfo } from 'react-icons/fi';

export const PROGRESS_STATUS_LABELS = {
  not_started: 'Not Started',
  learning: 'Learning',
  practicing: 'Practicing',
  mastered: 'Mastered',
};

export const PROGRESS_STATUS_COLORS = {
  not_started: '#666',
  learning: '#ffa94d',
  practicing: '#6c63ff',
  mastered: '#51cf66',
};

export const PROGRESS_RING_COLOR = '#6c63ff';

export const READINESS_LEVELS = ['Not Started', 'Beginner', 'Learning', 'Practicing', 'Confident', 'Mastered'];

export const READINESS_LEVEL_COLORS = ['#666', '#ff6b6b', '#ffa94d', '#ffd43b', '#69db7c', '#51cf66'];

export const READINESS_EMPTY_CONFIDENCE_COLOR = '#edf1f8';

export const NOTIFICATION_TYPE_META = {
  info: { icon: FiInfo, color: '#6c63ff' },
  reminder: { icon: FiBell, color: '#ffa94d' },
  alert: { icon: FiAlertTriangle, color: '#ff6b6b' },
  achievement: { icon: FiAward, color: '#51cf66' },
};
