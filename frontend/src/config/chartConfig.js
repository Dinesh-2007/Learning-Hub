export const LIGHT_CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#5f667b' } } },
  scales: {
    x: { ticks: { color: '#697089' }, grid: { color: 'rgba(31,36,48,0.08)' } },
    y: { ticks: { color: '#697089' }, grid: { color: 'rgba(31,36,48,0.08)' } },
  },
};

export const LIGHT_CHART_OPTIONS_WITH_ROTATED_X = {
  ...LIGHT_CHART_OPTIONS,
  scales: {
    ...LIGHT_CHART_OPTIONS.scales,
    x: {
      ...LIGHT_CHART_OPTIONS.scales.x,
      ticks: { ...LIGHT_CHART_OPTIONS.scales.x.ticks, maxRotation: 45 },
    },
  },
};

export const SCORE_DATASET_STYLES = {
  score: {
    label: 'Score',
    borderColor: '#6c63ff',
    backgroundColor: 'rgba(108,99,255,0.1)',
    fill: true,
    tension: 0.4,
  },
  accuracy: {
    label: 'Accuracy %',
    borderColor: '#51cf66',
    backgroundColor: 'rgba(81,207,102,0.1)',
    fill: true,
    tension: 0.4,
  },
};

export const SUBJECT_BREAKDOWN_DATASET_STYLES = {
  score: {
    label: 'Avg Score',
    backgroundColor: '#6c63ff88',
    borderColor: '#6c63ff',
    borderWidth: 1,
  },
  accuracy: {
    label: 'Avg Accuracy %',
    backgroundColor: '#51cf6688',
    borderColor: '#51cf66',
    borderWidth: 1,
  },
};

export const ANALYTICS_DATASET_STYLES = {
  studyHours: {
    label: 'Study Hours',
    borderColor: '#6c63ff',
    backgroundColor: 'rgba(108,99,255,0.15)',
    fill: true,
    tension: 0.4,
  },
  tasksCompleted: {
    label: 'Tasks Completed',
    backgroundColor: '#51cf66aa',
    borderColor: '#51cf66',
    borderWidth: 1,
  },
};

export const ACTIVITY_HEATMAP_COLORS = {
  none: '#edf1f8',
  low: '#1a472a',
  medium: '#2d6a3f',
  high: '#3da854',
  peak: '#51cf66',
};

export function getActivityHeatColor(hours) {
  if (hours === 0) return ACTIVITY_HEATMAP_COLORS.none;
  if (hours < 1) return ACTIVITY_HEATMAP_COLORS.low;
  if (hours < 2) return ACTIVITY_HEATMAP_COLORS.medium;
  if (hours < 4) return ACTIVITY_HEATMAP_COLORS.high;
  return ACTIVITY_HEATMAP_COLORS.peak;
}
