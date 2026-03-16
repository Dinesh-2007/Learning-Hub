import { Line, Pie } from 'react-chartjs-2';
import { useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from 'chart.js';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LineChart,
  Line as ReLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  Legend as ReLegend,
  ResponsiveContainer,
} from 'recharts';
import {
  FiActivity,
  FiAlertTriangle,
  FiBarChart2,
  FiCheckCircle,
  FiClipboard,
  FiClock,
  FiEdit3,
  FiMic,
  FiTarget,
  FiTrendingUp,
} from 'react-icons/fi';
import Topbar from '../../components/Topbar';
import StatCard from '../../components/StatCard';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ChartTooltip, ChartLegend);
ChartJS.register(ArcElement);

const summaryMetrics = {
  solved: 64,
  accuracy: 78,
  avgSolveTimeMins: 18,
  streakDays: 5,
};

const topicPracticeData = [
  { topic: 'Arrays', solved: 12, total: 20, trend: '+3 this week', accuracy: 80 },
  { topic: 'Strings', solved: 8, total: 15, trend: '+2 this week', accuracy: 74 },
  { topic: 'Trees', solved: 6, total: 18, trend: '+1 this week', accuracy: 68 },
  { topic: 'Dynamic Programming', solved: 3, total: 12, trend: '+1 this week', accuracy: 51 },
  { topic: 'Graphs', solved: 5, total: 14, trend: '+2 this week', accuracy: 62 },
  { topic: 'Linked Lists', solved: 9, total: 14, trend: '+2 this week', accuracy: 77 },
  { topic: 'Stacks and Queues', solved: 11, total: 16, trend: '+3 this week', accuracy: 83 },
  { topic: 'Greedy Algorithms', solved: 10, total: 18, trend: '+2 this week', accuracy: 72 },
  { topic: 'Binary Search', solved: 14, total: 20, trend: '+3 this week', accuracy: 81 },
  { topic: 'Backtracking', solved: 7, total: 16, trend: '+1 this week', accuracy: 59 },
  { topic: 'Heap / Priority Queue', solved: 9, total: 17, trend: '+2 this week', accuracy: 66 },
  { topic: 'Bit Manipulation', solved: 8, total: 13, trend: '+2 this week', accuracy: 70 },
];

const difficultyPracticeData = [
  { level: 'Easy', solved: 30, total: 40, color: '#51cf66' },
  { level: 'Medium', solved: 24, total: 50, color: '#74c0fc' },
  { level: 'Hard', solved: 10, total: 25, color: '#ffa94d' },
];

const companyPracticeData = [
  { company: 'Amazon', solved: 15, total: 30, note: 'Frequently asks graphs and sliding window' },
  { company: 'Google', solved: 10, total: 25, note: 'Tree + DP heavy rounds' },
  { company: 'Microsoft', solved: 8, total: 20, note: 'Implementation and edge-case quality' },
  { company: 'TCS', solved: 12, total: 18, note: 'Core DS patterns and speed-based coding' },
  { company: 'Infosys', solved: 11, total: 19, note: 'Moderate-level DSA with optimization checks' },
  { company: 'Wipro', solved: 9, total: 16, note: 'Problem-solving speed and clean code style' },
  { company: 'Flipkart', solved: 7, total: 15, note: 'Array transformations and interval tasks' },
];

const recentPracticeData = [
  { title: 'Two Sum', topic: 'Arrays', difficulty: 'Easy', solvedWhen: 'Today' },
  {
    title: 'Longest Substring Without Repeating Characters',
    topic: 'Strings',
    difficulty: 'Medium',
    solvedWhen: 'Yesterday',
  },
  {
    title: 'Binary Tree Level Order Traversal',
    topic: 'Trees',
    difficulty: 'Medium',
    solvedWhen: '2 days ago',
  },
  {
    title: 'Course Schedule',
    topic: 'Graphs',
    difficulty: 'Medium',
    solvedWhen: '3 days ago',
  },
  {
    title: 'Merge K Sorted Lists',
    topic: 'Linked Lists',
    difficulty: 'Hard',
    solvedWhen: '4 days ago',
  },
  {
    title: 'Coin Change',
    topic: 'Dynamic Programming',
    difficulty: 'Medium',
    solvedWhen: '5 days ago',
  },
  {
    title: 'Median of Two Sorted Arrays',
    topic: 'Binary Search',
    difficulty: 'Hard',
    solvedWhen: '6 days ago',
  },
  {
    title: 'Subsets II',
    topic: 'Backtracking',
    difficulty: 'Medium',
    solvedWhen: '1 week ago',
  },
  {
    title: 'Top K Frequent Elements',
    topic: 'Heap / Priority Queue',
    difficulty: 'Medium',
    solvedWhen: '1 week ago',
  },
];

const codingTestTakenHistory = [
  { name: 'DSA Weekly Mock 12', questions: 12, score: '9/12', accuracy: 75, duration: '54 min', takenOn: 'Today' },
  { name: 'Company Mix Mock 08', questions: 10, score: '7/10', accuracy: 70, duration: '46 min', takenOn: 'Yesterday' },
  { name: 'Hard Focus Set 03', questions: 8, score: '5/8', accuracy: 63, duration: '58 min', takenOn: '2 days ago' },
  { name: 'Dynamic Programming Sprint', questions: 10, score: '6/10', accuracy: 60, duration: '49 min', takenOn: '4 days ago' },
  { name: 'Graph Marathon Set', questions: 14, score: '10/14', accuracy: 71, duration: '67 min', takenOn: '1 week ago' },
];

const weeklyPerformanceData = [10, 15, 20, 19, 24, 22];

const designConcepts = [
  {
    key: 'load-balancing',
    title: 'Load balancing',
    summary: 'Distribute traffic across services while preserving low latency and availability.',
    highlights: ['Round robin + weighted routing', 'Health checks and failover policy', 'Sticky sessions vs stateless sessions'],
  },
  {
    key: 'caching',
    title: 'Caching',
    summary: 'Reduce read latency and backend load with layered cache strategies.',
    highlights: ['Cache-aside and write-through', 'TTL + eviction strategy', 'Hot key and cache stampede handling'],
  },
  {
    key: 'db-indexing',
    title: 'Database indexing',
    summary: 'Use proper indexing to optimize query plans and throughput under load.',
    highlights: ['Primary and secondary indexes', 'Composite index ordering', 'Read gain vs write amplification'],
  },
  {
    key: 'api-design',
    title: 'API design',
    summary: 'Define stable interfaces that support versioning, pagination, and idempotency.',
    highlights: ['REST resource modeling', 'Versioning and backward compatibility', 'Rate limiting and error contracts'],
  },
];

const designProblems = [
  {
    key: 'url-shortener',
    title: 'Design a URL shortener',
    scope: 'High-write metadata service with redirect-heavy read traffic.',
    focus: ['ID generation strategy', 'Redirect latency optimization', 'Expiration and abuse prevention'],
  },
  {
    key: 'messaging-system',
    title: 'Design a messaging system',
    scope: 'Low-latency message delivery with ordering and retry guarantees.',
    focus: ['Fanout and queue architecture', 'Offline sync and read receipts', 'Delivery retry + dead letter flow'],
  },
  {
    key: 'ecommerce-platform',
    title: 'Design an e-commerce platform',
    scope: 'Catalog, cart, checkout, payment, and inventory consistency.',
    focus: ['Inventory reservation model', 'Checkout orchestration', 'Search and recommendation scale'],
  },
  {
    key: 'ride-sharing',
    title: 'Design a ride-sharing system',
    scope: 'Real-time matching, dispatch, ETA and surge computation.',
    focus: ['Geo-indexing and driver matching', 'Pricing + surge service', 'Trip state machine and notifications'],
  },
];

const evaluationMetrics = [
  {
    key: 'scalability-understanding',
    title: 'Scalability understanding',
    score: 72,
    note: 'Good horizontal scaling decisions, improve partitioning rationale depth.',
  },
  {
    key: 'architecture-clarity',
    title: 'Architecture clarity',
    score: 79,
    note: 'Clear service boundaries and data flow; mention failure modes earlier.',
  },
  {
    key: 'component-design',
    title: 'Component design',
    score: 68,
    note: 'Solid APIs, but needs stronger contract definitions around async workflows.',
  },
];

const aptitudeSummaryMetrics = {
  practicedQuestions: 142,
  accuracyRate: 76,
  avgTimePerQuestionSec: 42,
  quizzesCompleted: 18,
};

const aptitudeCategories = [
  { key: 'quant', title: 'Quantitative Aptitude', solved: 45, total: 80, color: '#6c63ff' },
  { key: 'logic', title: 'Logical Reasoning', solved: 31, total: 50, color: '#74c0fc' },
  { key: 'verbal', title: 'Verbal Ability', solved: 22, total: 40, color: '#51cf66' },
];

const aptitudeTopicBreakdown = {
  quant: [
    { topic: 'Percentages', total: 25, solved: 18, accuracy: 80 },
    { topic: 'Profit and Loss', total: 16, solved: 10, accuracy: 66 },
    { topic: 'Time and Work', total: 20, solved: 12, accuracy: 65 },
    { topic: 'Probability', total: 14, solved: 8, accuracy: 61 },
    { topic: 'Ratio and Proportion', total: 12, solved: 8, accuracy: 73 },
    { topic: 'Time Speed Distance', total: 11, solved: 6, accuracy: 58 },
    { topic: 'Simple and Compound Interest', total: 10, solved: 6, accuracy: 62 },
  ],
  logic: [
    { topic: 'Pattern Recognition', total: 15, solved: 10, accuracy: 70 },
    { topic: 'Logical Puzzles', total: 18, solved: 9, accuracy: 60 },
    { topic: 'Coding-Decoding', total: 12, solved: 8, accuracy: 72 },
    { topic: 'Blood Relations', total: 10, solved: 6, accuracy: 64 },
    { topic: 'Seating Arrangement', total: 14, solved: 7, accuracy: 57 },
    { topic: 'Series Completion', total: 11, solved: 7, accuracy: 69 },
  ],
  verbal: [
    { topic: 'Reading Comprehension', total: 20, solved: 12, accuracy: 68 },
    { topic: 'Vocabulary', total: 14, solved: 8, accuracy: 71 },
    { topic: 'Sentence Correction', total: 15, solved: 9, accuracy: 75 },
    { topic: 'Synonyms and Antonyms', total: 12, solved: 7, accuracy: 70 },
    { topic: 'Grammar Usage', total: 11, solved: 6, accuracy: 64 },
  ],
};

const aptitudeAccuracyTrend = [65, 68, 72, 76, 77, 79];

const aptitudeRecentActivity = [
  { title: 'Percentage Problem', category: 'Quantitative Aptitude', solvedWhen: 'Today' },
  { title: 'Coding-Decoding Puzzle', category: 'Logical Reasoning', solvedWhen: 'Yesterday' },
  { title: 'Reading Comprehension Passage', category: 'Verbal Ability', solvedWhen: '2 days ago' },
  { title: 'Time and Work MCQ', category: 'Quantitative Aptitude', solvedWhen: '3 days ago' },
  { title: 'Seating Arrangement Set', category: 'Logical Reasoning', solvedWhen: '4 days ago' },
  { title: 'Sentence Correction Drill', category: 'Verbal Ability', solvedWhen: '5 days ago' },
  { title: 'Profit and Loss Set', category: 'Quantitative Aptitude', solvedWhen: '6 days ago' },
  { title: 'Pattern Recognition Puzzle', category: 'Logical Reasoning', solvedWhen: '1 week ago' },
];

const aptitudeQuizConfig = {
  title: 'Aptitude Quiz',
  questions: 10,
  timeLimitMinutes: 10,
  difficulty: 'Medium',
  lastResult: { score: 7, total: 10, accuracy: 70, avgTimeSec: 38 },
};

const aptitudeWeakAreas = [
  { topic: 'Time and Work', accuracy: 52 },
  { topic: 'Logical Puzzles', accuracy: 48 },
  { topic: 'Reading Comprehension', accuracy: 55 },
];

const aptitudeRecommendations = [
  'Solve 5 Percentage problems',
  'Practice 3 Logical Puzzle questions',
  'Complete 1 Reading Comprehension passage',
  'Take one 10-minute mixed aptitude quiz',
  'Revise Time and Work shortcut techniques',
];

const aptitudeQuizTakenHistory = [
  { quiz: 'Quant Basics Quiz 04', score: '8/10', accuracy: 80, avgTime: '35 sec', takenOn: 'Today' },
  { quiz: 'Logical Sprint Quiz 02', score: '6/10', accuracy: 60, avgTime: '41 sec', takenOn: 'Yesterday' },
  { quiz: 'Verbal Booster Quiz 03', score: '7/10', accuracy: 70, avgTime: '39 sec', takenOn: '2 days ago' },
  { quiz: 'Mixed Aptitude Mock 07', score: '7/10', accuracy: 70, avgTime: '38 sec', takenOn: '4 days ago' },
  { quiz: 'Full Aptitude Assessment', score: '15/20', accuracy: 75, avgTime: '43 sec', takenOn: '1 week ago' },
];

const hrOverviewMetrics = {
  questionsPracticed: 18,
  responsesRecorded: 12,
  confidenceScore: 72,
  practiceStreakDays: 4,
};

const hrCategorySeed = [
  {
    id: 'tell-me-about-yourself',
    title: 'Tell Me About Yourself',
    questionCount: 5,
    practiced: 3,
    confidence: 70,
    question: 'Tell me about yourself.',
    sample: 'I am a final-year software student with hands-on experience in full-stack development and collaborative problem solving.',
  },
  {
    id: 'strengths-weaknesses',
    title: 'Strengths & Weaknesses',
    questionCount: 4,
    practiced: 2,
    confidence: 65,
    question: 'What are your strengths and weaknesses?',
    sample: 'My strength is ownership and clarity in communication. A weakness I am improving is over-polishing first drafts, so I now use time-boxing.',
  },
  {
    id: 'leadership-experience',
    title: 'Leadership Experience',
    questionCount: 4,
    practiced: 2,
    confidence: 60,
    question: 'Describe a time you showed leadership.',
    sample: 'During our capstone project, I coordinated task planning, managed blockers, and ensured sprint goals were met before review deadlines.',
  },
  {
    id: 'conflict-resolution',
    title: 'Conflict Resolution',
    questionCount: 3,
    practiced: 1,
    confidence: 55,
    question: 'Tell me about a conflict you resolved in a team.',
    sample: 'I helped align two team members by reframing the disagreement around deliverables and creating a shared implementation checklist.',
  },
  {
    id: 'career-goals',
    title: 'Career Goals',
    questionCount: 4,
    practiced: 2,
    confidence: 62,
    question: 'Where do you see yourself in five years?',
    sample: 'I aim to become a dependable software engineer who can own product features end to end and mentor junior teammates.',
  },
  {
    id: 'project-challenge',
    title: 'Project Challenge Story',
    questionCount: 3,
    practiced: 2,
    confidence: 66,
    question: 'Describe a challenging project and how you handled it.',
    sample: 'In a deadline-critical release, I reduced failure rates by introducing better logging, rollback checks, and pre-release test gates.',
  },
];

const hrRadarData = [
  { skill: 'Confidence', score: 72 },
  { skill: 'Clarity', score: 80 },
  { skill: 'Structure', score: 65 },
  { skill: 'Relevance', score: 78 },
  { skill: 'Communication', score: 74 },
];

const hrConfidenceTrend = [
  { week: 'Week 1', confidence: 55 },
  { week: 'Week 2', confidence: 63 },
  { week: 'Week 3', confidence: 70 },
  { week: 'Week 4', confidence: 72 },
  { week: 'Week 5', confidence: 75 },
  { week: 'Week 6', confidence: 77 },
];

const hrPracticeTimeline = [
  { period: 'Today', event: 'Answered "Tell me about yourself"' },
  { period: 'Yesterday', event: 'Recorded response "Strengths and weaknesses"' },
  { period: '2 days ago', event: 'Practiced "Leadership experience"' },
  { period: '4 days ago', event: 'Reviewed sample answer for "Career goals"' },
];

const hrRecommendations = [
  'Practice "Leadership Experience" with STAR format',
  'Improve answer structure for "Career Goals"',
  'Record audio response for "Strengths & Weaknesses"',
];

function progressPercent(solved, total) {
  return Math.round((solved / total) * 100);
}

export default function InterviewPractice() {
  const [activeModule, setActiveModule] = useState('coding');
  const [activeConcept, setActiveConcept] = useState(designConcepts[0].key);
  const [activeProblem, setActiveProblem] = useState(designProblems[0].key);
  const [activeEvaluation, setActiveEvaluation] = useState(evaluationMetrics[0].key);
  const [activeAptitudeCategory, setActiveAptitudeCategory] = useState('quant');
  const [hrCategories, setHrCategories] = useState(hrCategorySeed);
  const [selectedHrCategoryId, setSelectedHrCategoryId] = useState(hrCategorySeed[0].id);
  const [draggingHrId, setDraggingHrId] = useState(null);
  const [hrPracticeMode, setHrPracticeMode] = useState('write');
  const [hrAnswerText, setHrAnswerText] = useState('');
  const [isHrRecording, setIsHrRecording] = useState(false);
  const [hrSubmissionMessage, setHrSubmissionMessage] = useState('');

  const selectedConcept = designConcepts.find(item => item.key === activeConcept) || designConcepts[0];
  const selectedProblem = designProblems.find(item => item.key === activeProblem) || designProblems[0];
  const selectedEvaluation = evaluationMetrics.find(item => item.key === activeEvaluation) || evaluationMetrics[0];
  const selectedAptitudeCategory = aptitudeCategories.find(item => item.key === activeAptitudeCategory) || aptitudeCategories[0];
  const selectedAptitudeTopics = aptitudeTopicBreakdown[activeAptitudeCategory] || aptitudeTopicBreakdown.quant;
  const selectedHrCategory = hrCategories.find(item => item.id === selectedHrCategoryId) || hrCategories[0];
  const hrWordCount = hrAnswerText.trim() ? hrAnswerText.trim().split(/\s+/).length : 0;

  function onHrDragStart(event, categoryId) {
    setDraggingHrId(categoryId);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', categoryId);
  }

  function onHrDrop(event, targetId) {
    event.preventDefault();
    const sourceId = event.dataTransfer.getData('text/plain') || draggingHrId;
    setDraggingHrId(null);
    if (!sourceId || sourceId === targetId) {
      return;
    }

    setHrCategories(prev => {
      const sourceIndex = prev.findIndex(item => item.id === sourceId);
      const targetIndex = prev.findIndex(item => item.id === targetId);
      if (sourceIndex < 0 || targetIndex < 0) {
        return prev;
      }
      const reordered = [...prev];
      const [moved] = reordered.splice(sourceIndex, 1);
      reordered.splice(targetIndex, 0, moved);
      return reordered;
    });
  }

  function submitHrResponse() {
    setHrSubmissionMessage(`Response submitted for ${selectedHrCategory.title}.`);
  }

  const performanceChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        label: 'Problems solved',
        data: weeklyPerformanceData,
        borderColor: '#6c63ff',
        backgroundColor: 'rgba(108, 99, 255, 0.18)',
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const performanceChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#5f667b',
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#697089' },
        grid: { color: 'rgba(31, 36, 48, 0.08)' },
      },
      y: {
        ticks: { color: '#697089', stepSize: 5 },
        grid: { color: 'rgba(31, 36, 48, 0.08)' },
        beginAtZero: true,
      },
    },
  };

  const aptitudeTrendChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        label: 'Accuracy %',
        data: aptitudeAccuracyTrend,
        borderColor: '#51cf66',
        backgroundColor: 'rgba(81, 207, 102, 0.18)',
        fill: true,
        tension: 0.35,
      },
    ],
  };

  const aptitudeStrengthData = {
    labels: ['Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability'],
    datasets: [
      {
        data: [50, 30, 20],
        backgroundColor: ['#6c63ff', '#74c0fc', '#51cf66'],
        borderColor: ['#6c63ff', '#74c0fc', '#51cf66'],
        borderWidth: 1,
      },
    ],
  };

  const aptitudePieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#5f667b',
        },
      },
    },
  };

  return (
    <div className="page">
      <Topbar title="Interview Practice" />

      <div className="page-content interview-practice-page">
        <div className="card practice-module-switch-card">
          <div className="practice-module-switch-header">
            <h3>Interview Practice Modules</h3>
            <span className="mini-text">Select a module to view its content</span>
          </div>
          <div className="practice-module-switch-actions">
            <button
              type="button"
              className={`practice-module-btn ${activeModule === 'coding' ? 'active' : ''}`}
              onClick={() => setActiveModule('coding')}
            >
              Coding Interview Practice
            </button>
            <button
              type="button"
              className={`practice-module-btn ${activeModule === 'system-design' ? 'active' : ''}`}
              onClick={() => setActiveModule('system-design')}
            >
              System Design Practice
            </button>
            <button
              type="button"
              className={`practice-module-btn ${activeModule === 'aptitude' ? 'active' : ''}`}
              onClick={() => setActiveModule('aptitude')}
            >
              Aptitude Practice
            </button>
            <button
              type="button"
              className={`practice-module-btn ${activeModule === 'hr' ? 'active' : ''}`}
              onClick={() => setActiveModule('hr')}
            >
              HR Interview Practice
            </button>
          </div>
        </div>

        {activeModule === 'coding' && (
          <>
            <div className="card interview-intro-card">
              <h3>Coding Interview Practice</h3>
              <p className="interview-intro-text">
                Focus on algorithmic problem solving with topic coverage, difficulty progression, company-focused practice, and measurable consistency trends.
              </p>
              <div className="interview-tag-list">
                <span className="tag">Topic-based</span>
                <span className="tag">Difficulty-based</span>
                <span className="tag">Company-based</span>
                <span className="tag">Performance tracking</span>
              </div>
            </div>

            <div className="stats-grid interview-stats-grid">
              <StatCard
                icon={<FiCheckCircle />}
                label="Problems Solved"
                value={summaryMetrics.solved}
                sub="Total accepted solutions"
                trend={{ direction: 'up', text: '+9 this week' }}
                color="#6c63ff"
              />
              <StatCard
                icon={<FiTarget />}
                label="Accuracy Rate"
                value={`${summaryMetrics.accuracy}%`}
                sub="Last 30-day accuracy"
                trend={{ direction: 'up', text: '+3%' }}
                color="#51cf66"
              />
              <StatCard
                icon={<FiClock />}
                label="Avg Solve Time"
                value={`${summaryMetrics.avgSolveTimeMins} min`}
                sub="Average accepted runtime"
                trend={{ direction: 'down', text: '-2 min' }}
                color="#ffa94d"
              />
              <StatCard
                icon={<FiActivity />}
                label="Active Practice Streak"
                value={`${summaryMetrics.streakDays} days`}
                sub="Consecutive daily practice"
                color="#74c0fc"
              />
            </div>

            <div className="practice-columns">
              <div className="card">
                <h3>Topic-Based Practice</h3>
                <div className="practice-topic-grid">
                  {topicPracticeData.map(item => {
                    const pct = progressPercent(item.solved, item.total);
                    return (
                      <div key={item.topic} className="practice-progress-row">
                        <div className="practice-progress-meta">
                          <strong>{item.topic}</strong>
                          <span>{pct}%</span>
                        </div>
                        <div className="practice-note">Solved: {item.solved} / {item.total}</div>
                        <div className="practice-progress-bar">
                          <div className="practice-progress-fill" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #6c63ff, #74c0fc)' }} />
                        </div>
                        <div className="practice-topic-footer">
                          <span>{item.trend}</span>
                          <span>Accuracy {item.accuracy}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="card">
                <h3>Difficulty-Based Practice</h3>
                <div className="practice-difficulty-grid">
                  {difficultyPracticeData.map(item => {
                    const pct = progressPercent(item.solved, item.total);
                    return (
                      <div key={item.level} className="practice-difficulty-card">
                        <div className="practice-progress-meta">
                          <strong>{item.level} Problems</strong>
                          <span>{item.solved} / {item.total}</span>
                        </div>
                        <div className="practice-progress-bar">
                          <div className="practice-progress-fill" style={{ width: `${pct}%`, background: item.color }} />
                        </div>
                        <p className="practice-note">Progress {pct}%</p>
                      </div>
                    );
                  })}
                </div>

                <h3 className="practice-section-spacing">Company-Based Practice</h3>
                <div className="practice-company-grid">
                  {companyPracticeData.map(item => (
                    <div key={item.company} className="practice-company-card">
                      <div className="practice-company-header">
                        <h5>{item.company}</h5>
                        <span className="practice-company-total">{item.solved}</span>
                      </div>
                      <p className="practice-note">Questions solved: {item.solved} / {item.total}</p>
                      <p className="practice-note">{item.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="practice-columns">
              <div className="card">
                <h3>Recent Practice Activity</h3>
                <div className="practice-activity-list">
                  {recentPracticeData.map(item => (
                    <div key={item.title} className="practice-activity-item">
                      <div className="practice-activity-main">
                        <h4>{item.title}</h4>
                        <p>Topic: {item.topic} | Difficulty: {item.difficulty}</p>
                      </div>
                      <span className="practice-activity-time">Solved {item.solvedWhen}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3>Performance Visualization</h3>
                <p className="practice-note">Weekly solved-problem trend showing consistency improvement over time.</p>
                <div className="chart-container practice-chart-container">
                  <Line data={performanceChartData} options={performanceChartOptions} />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>Consistency Snapshot</h3>
                <span className="mini-text">Helps identify momentum and plateaus</span>
              </div>
              <div className="practice-consistency-grid">
                <div className="practice-consistency-item">
                  <FiTrendingUp />
                  <div>
                    <strong>Peak Week: 24 solves</strong>
                    <p>Highest completed week in the current cycle</p>
                  </div>
                </div>
                <div className="practice-consistency-item">
                  <FiBarChart2 />
                  <div>
                    <strong>Week-over-week average: 18 solves</strong>
                    <p>Steady growth with minimal drop-offs</p>
                  </div>
                </div>
                <div className="practice-consistency-item">
                  <FiTarget />
                  <div>
                    <strong>Target adherence: 82%</strong>
                    <p>Achieved daily plan in 23 of the last 28 days</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>Test Taken History</h3>
                <span className="mini-text">Recent coding mock test attempts</span>
              </div>
              <div className="practice-activity-list">
                {codingTestTakenHistory.map(item => (
                  <div key={item.name} className="practice-activity-item">
                    <div className="practice-activity-main">
                      <h4>{item.name}</h4>
                      <p>Questions: {item.questions} | Score: {item.score} | Accuracy: {item.accuracy}%</p>
                      <p>Duration: {item.duration}</p>
                    </div>
                    <span className="practice-activity-time">Taken {item.takenOn}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeModule === 'system-design' && (
          <>
            <div className="card interview-intro-card">
              <h3>System Design Practice</h3>
              <p className="interview-intro-text">
                System design interviews evaluate your ability to design scalable systems with clear architecture, strong component boundaries, and trade-off awareness.
              </p>
              <div className="interview-tag-list">
                <span className="tag">Load balancing</span>
                <span className="tag">Caching</span>
                <span className="tag">Database indexing</span>
                <span className="tag">API design</span>
              </div>
            </div>

            <div className="card system-design-module-card">
              <div className="card-header">
                <h3>System Design Practice</h3>
                <span className="mini-text">Clickable parameters for concept prep and case-based design rounds</span>
              </div>
              <div className="system-design-grid">
                <div className="system-design-block">
                  <h4>Basic Design Concepts</h4>
                  <div className="practice-chip-group">
                    {designConcepts.map(item => (
                      <button
                        key={item.key}
                        type="button"
                        className={`practice-chip ${activeConcept === item.key ? 'active' : ''}`}
                        onClick={() => setActiveConcept(item.key)}
                      >
                        {item.title}
                      </button>
                    ))}
                  </div>
                  <div className="system-design-detail-card">
                    <h5>{selectedConcept.title}</h5>
                    <p>{selectedConcept.summary}</p>
                    <ul className="interview-list">
                      {selectedConcept.highlights.map(item => (
                        <li key={item}><span className="interview-list-dot" /> <span>{item}</span></li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="system-design-block">
                  <h4>System Design Problems</h4>
                  <div className="practice-chip-group">
                    {designProblems.map(item => (
                      <button
                        key={item.key}
                        type="button"
                        className={`practice-chip ${activeProblem === item.key ? 'active' : ''}`}
                        onClick={() => setActiveProblem(item.key)}
                      >
                        {item.title}
                      </button>
                    ))}
                  </div>
                  <div className="system-design-detail-card">
                    <h5>{selectedProblem.title}</h5>
                    <p>{selectedProblem.scope}</p>
                    <ul className="interview-list">
                      {selectedProblem.focus.map(item => (
                        <li key={item}><span className="interview-list-dot" /> <span>{item}</span></li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="system-design-block">
                  <h4>Design Evaluation</h4>
                  <div className="practice-chip-group">
                    {evaluationMetrics.map(item => (
                      <button
                        key={item.key}
                        type="button"
                        className={`practice-chip ${activeEvaluation === item.key ? 'active' : ''}`}
                        onClick={() => setActiveEvaluation(item.key)}
                      >
                        {item.title}
                      </button>
                    ))}
                  </div>
                  <div className="system-design-detail-card">
                    <div className="practice-progress-meta">
                      <h5>{selectedEvaluation.title}</h5>
                      <strong>{selectedEvaluation.score}%</strong>
                    </div>
                    <div className="practice-progress-bar">
                      <div
                        className="practice-progress-fill"
                        style={{ width: `${selectedEvaluation.score}%`, background: 'linear-gradient(90deg, #6c63ff, #51cf66)' }}
                      />
                    </div>
                    <p>{selectedEvaluation.note}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeModule === 'aptitude' && (
          <>
            <div className="card interview-intro-card">
              <h3>Aptitude Practice</h3>
              <p className="interview-intro-text">
                Prepare for pre-technical aptitude rounds with quantitative, logical reasoning, and verbal practice modules supported by timed quizzes and weak-area tracking.
              </p>
              <div className="interview-tag-list">
                <span className="tag">Quantitative Aptitude</span>
                <span className="tag">Logical Reasoning</span>
                <span className="tag">Verbal Ability</span>
                <span className="tag">Timed Quiz Mode</span>
              </div>
            </div>

            <div className="stats-grid interview-stats-grid">
              <StatCard icon={<FiCheckCircle />} label="Total Questions Practiced" value={aptitudeSummaryMetrics.practicedQuestions} sub="Across aptitude categories" trend={{ direction: 'up', text: '+21 this week' }} color="#6c63ff" />
              <StatCard icon={<FiTarget />} label="Accuracy Rate" value={`${aptitudeSummaryMetrics.accuracyRate}%`} sub="Average across all aptitude topics" trend={{ direction: 'up', text: '+4%' }} color="#51cf66" />
              <StatCard icon={<FiClock />} label="Average Time per Question" value={`${aptitudeSummaryMetrics.avgTimePerQuestionSec} sec`} sub="Question-level solve speed" trend={{ direction: 'down', text: '-3 sec' }} color="#ffa94d" />
              <StatCard icon={<FiActivity />} label="Completed Quizzes" value={aptitudeSummaryMetrics.quizzesCompleted} sub="Timed quiz attempts completed" color="#74c0fc" />
            </div>

            <div className="card">
              <h3>Aptitude Categories</h3>
              <div className="aptitude-categories-grid">
                {aptitudeCategories.map(item => {
                  const pct = progressPercent(item.solved, item.total);
                  return (
                    <button
                      key={item.key}
                      type="button"
                      className={`aptitude-category-card ${activeAptitudeCategory === item.key ? 'active' : ''}`}
                      onClick={() => setActiveAptitudeCategory(item.key)}
                    >
                      <div className="practice-progress-meta">
                        <strong>{item.title}</strong>
                        <span>{pct}%</span>
                      </div>
                      <p className="practice-note">Solved: {item.solved} / {item.total}</p>
                      <div className="practice-progress-bar">
                        <div className="practice-progress-fill" style={{ width: `${pct}%`, background: item.color }} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>Topic-Level Breakdown</h3>
                <span className="mini-text">{selectedAptitudeCategory.title}</span>
              </div>
              <div className="aptitude-topic-grid">
                {selectedAptitudeTopics.map(item => (
                  <div key={item.topic} className="practice-progress-row">
                    <div className="practice-progress-meta">
                      <strong>{item.topic}</strong>
                      <span>{item.accuracy}%</span>
                    </div>
                    <p className="practice-note">Questions: {item.total} | Solved: {item.solved}</p>
                    <div className="practice-progress-bar">
                      <div className="practice-progress-fill" style={{ width: `${progressPercent(item.solved, item.total)}%`, background: 'linear-gradient(90deg, #6c63ff, #74c0fc)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="practice-columns">
              <div className="card">
                <h3>Practice Performance Visualization</h3>
                <p className="practice-note">Accuracy trend progression from Week 1 to Week 6.</p>
                <div className="chart-container practice-chart-container">
                  <Line data={aptitudeTrendChartData} options={performanceChartOptions} />
                </div>
              </div>
              <div className="card">
                <h3>Topic Strength Distribution</h3>
                <p className="practice-note">Practice focus split by aptitude category.</p>
                <div className="chart-container aptitude-pie-container">
                  <Pie data={aptitudeStrengthData} options={aptitudePieOptions} />
                </div>
              </div>
            </div>

            <div className="practice-columns">
              <div className="card">
                <h3>Recent Practice Activity</h3>
                <div className="practice-activity-list">
                  {aptitudeRecentActivity.map(item => (
                    <div key={item.title} className="practice-activity-item">
                      <div className="practice-activity-main">
                        <h4>{item.title}</h4>
                        <p>Topic: {item.category}</p>
                      </div>
                      <span className="practice-activity-time">Solved {item.solvedWhen}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3>Timed Quiz Practice</h3>
                <div className="practice-difficulty-card">
                  <div className="practice-progress-meta">
                    <strong>{aptitudeQuizConfig.title}</strong>
                    <span>{aptitudeQuizConfig.difficulty}</span>
                  </div>
                  <p className="practice-note">Questions: {aptitudeQuizConfig.questions}</p>
                  <p className="practice-note">Time Limit: {aptitudeQuizConfig.timeLimitMinutes} minutes</p>
                </div>
                <div className="practice-difficulty-card practice-section-spacing">
                  <div className="practice-progress-meta">
                    <strong>Latest Result</strong>
                    <span>{aptitudeQuizConfig.lastResult.score}/{aptitudeQuizConfig.lastResult.total}</span>
                  </div>
                  <p className="practice-note">Accuracy: {aptitudeQuizConfig.lastResult.accuracy}%</p>
                  <p className="practice-note">Average Time: {aptitudeQuizConfig.lastResult.avgTimeSec} sec per question</p>
                </div>
                <div className="practice-difficulty-card practice-section-spacing">
                  <div className="card-header">
                    <h4>Quiz Taken History</h4>
                    <span className="mini-text">Last attempts</span>
                  </div>
                  <div className="practice-activity-list">
                    {aptitudeQuizTakenHistory.map(item => (
                      <div key={item.quiz} className="practice-activity-item">
                        <div className="practice-activity-main">
                          <h4>{item.quiz}</h4>
                          <p>Score: {item.score} | Accuracy: {item.accuracy}% | Avg Time: {item.avgTime}</p>
                        </div>
                        <span className="practice-activity-time">Taken {item.takenOn}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="practice-columns">
              <div className="card">
                <h3>Weak Area Detection</h3>
                <ul className="interview-list">
                  {aptitudeWeakAreas.map(item => (
                    <li key={item.topic}><span className="interview-list-dot" /> <span>{item.topic} (Accuracy {item.accuracy}%)</span></li>
                  ))}
                </ul>
              </div>
              <div className="card">
                <h3>Recommended Practice Tasks</h3>
                <ul className="interview-list">
                  {aptitudeRecommendations.map(item => (
                    <li key={item}><span className="interview-list-dot" /> <span>{item}</span></li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}

        {activeModule === 'hr' && (
          <>
            <div className="card interview-intro-card">
              <h3>HR Interview Practice</h3>
              <p className="interview-intro-text">
                Practice common behavioral interview questions, submit written or recorded responses, and track confidence growth with analytics.
              </p>
              <div className="interview-tag-list">
                <span className="tag">Questions + Recording</span>
                <span className="tag">Drag Priority</span>
                <span className="tag">Radar Evaluation</span>
                <span className="tag">Progress Tracking</span>
              </div>
            </div>

            <div className="hr-section-title">HR PRACTICE OVERVIEW</div>
            <div className="stats-grid interview-stats-grid">
              <StatCard icon={<FiClipboard />} label="Questions Practiced" value={hrOverviewMetrics.questionsPracticed} sub="Behavioral question attempts" color="#6c63ff" />
              <StatCard icon={<FiMic />} label="Responses Recorded" value={hrOverviewMetrics.responsesRecorded} sub="Voice responses captured" color="#74c0fc" />
              <StatCard icon={<FiBarChart2 />} label="Confidence Score" value={`${hrOverviewMetrics.confidenceScore}%`} sub="Latest self-evaluation average" color="#51cf66" />
              <StatCard icon={<FiTrendingUp />} label="Practice Streak" value={`${hrOverviewMetrics.practiceStreakDays} Days`} sub="Consecutive active practice days" color="#ffa94d" />
            </div>

            <div className="hr-section-title">QUESTION CATEGORY CARDS (DRAGGABLE GRID)</div>
            <div className="card hr-category-card-wrap">
              <div className="card-header">
                <h3>HR Question Categories</h3>
                <span className="mini-text">Drag cards to reprioritize your practice order</span>
              </div>
              <div className="hr-category-grid">
                {hrCategories.map(category => (
                  <button
                    key={category.id}
                    type="button"
                    draggable
                    onDragStart={event => onHrDragStart(event, category.id)}
                    onDragOver={event => event.preventDefault()}
                    onDrop={event => onHrDrop(event, category.id)}
                    onClick={() => setSelectedHrCategoryId(category.id)}
                    className={`hr-category-tile ${selectedHrCategoryId === category.id ? 'active' : ''}`}
                  >
                    <h4>{category.title}</h4>
                    <p>Questions: {category.questionCount}</p>
                    <p>Practiced: {category.practiced}</p>
                    <p>Confidence: {category.confidence}%</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="hr-section-title">QUESTION PRACTICE PANEL</div>
            <div className="card">
              <div className="card-header">
                <h3>Question Practice Panel</h3>
                <span className="mini-text">Selected category: {selectedHrCategory.title}</span>
              </div>

              <div className="hr-question-box">
                <h4>Question</h4>
                <p>{selectedHrCategory.question}</p>
              </div>

              <div className="hr-practice-options">
                <button
                  type="button"
                  className={`practice-chip ${hrPracticeMode === 'write' ? 'active' : ''}`}
                  onClick={() => setHrPracticeMode('write')}
                >
                  <FiEdit3 /> Write Answer
                </button>
                <button
                  type="button"
                  className={`practice-chip ${hrPracticeMode === 'record' ? 'active' : ''}`}
                  onClick={() => setHrPracticeMode('record')}
                >
                  <FiMic /> Record Audio
                </button>
                <button
                  type="button"
                  className={`practice-chip ${hrPracticeMode === 'sample' ? 'active' : ''}`}
                  onClick={() => setHrPracticeMode('sample')}
                >
                  View Sample
                </button>
              </div>

              {hrPracticeMode === 'write' && (
                <div className="hr-answer-editor">
                  <textarea
                    value={hrAnswerText}
                    onChange={event => setHrAnswerText(event.target.value)}
                    placeholder="Write your HR response here..."
                    rows={6}
                  />
                  <span className="mini-text">Word Count: {hrWordCount} words</span>
                </div>
              )}

              {hrPracticeMode === 'record' && (
                <div className="hr-audio-panel">
                  <p>{isHrRecording ? 'Recording in progress...' : 'Ready to record your answer.'}</p>
                  <button type="button" className="btn-secondary" onClick={() => setIsHrRecording(prev => !prev)}>
                    <FiMic /> {isHrRecording ? 'Stop Recording' : 'Start Recording'}
                  </button>
                </div>
              )}

              {hrPracticeMode === 'sample' && (
                <div className="hr-sample-panel">
                  <h4>Sample Answer</h4>
                  <p>{selectedHrCategory.sample}</p>
                </div>
              )}

              <button type="button" className="btn-primary" onClick={submitHrResponse}>Submit Response</button>
              {hrSubmissionMessage && <p className="practice-note">{hrSubmissionMessage}</p>}
            </div>

            <div className="hr-section-title">EVALUATION + ANALYTICS</div>
            <div className="practice-columns">
              <div className="card">
                <h3>Evaluation Radar</h3>
                <div className="chart-container hr-chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={hrRadarData}>
                      <PolarGrid stroke="rgba(31, 36, 48, 0.12)" />
                      <PolarAngleAxis dataKey="skill" tick={{ fill: '#697089', fontSize: 12 }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#697089', fontSize: 11 }} />
                      <Radar dataKey="score" stroke="#6c63ff" fill="rgba(108, 99, 255, 0.3)" fillOpacity={0.6} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card">
                <h3>HR Confidence Progress</h3>
                <div className="chart-container hr-chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={hrConfidenceTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(31, 36, 48, 0.08)" />
                      <XAxis dataKey="week" tick={{ fill: '#697089', fontSize: 11 }} />
                      <YAxis domain={[45, 100]} tick={{ fill: '#697089', fontSize: 11 }} />
                      <ReTooltip />
                      <ReLegend />
                      <ReLine type="monotone" dataKey="confidence" stroke="#51cf66" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="practice-columns">
              <div className="card">
                <h3>Practice Activity Timeline</h3>
                <div className="hr-timeline-list">
                  {hrPracticeTimeline.map(item => (
                    <div key={`${item.period}-${item.event}`} className="hr-timeline-item">
                      <div className="hr-timeline-dot" />
                      <div>
                        <strong>{item.period}</strong>
                        <p>{item.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3>Recommended Practice</h3>
                <div className="hr-recommendation-list">
                  {hrRecommendations.map(item => (
                    <div key={item} className="hr-recommendation-item">
                      <FiAlertTriangle />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
