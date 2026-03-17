import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../../components/Topbar';
import api from '../../api/axios';
import { FiPlay, FiClock, FiBarChart2 } from 'react-icons/fi';
import { MOCK_TESTS } from '../../data/mockTests';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

const DIFF_COLORS = { easy: '#51cf66', medium: '#ffa94d', hard: '#ff6b6b' };

const FILTER_INSIGHT_FALLBACK = {
  all: {
    radarData: [
      { platform: 'Subject Core', score: 76 },
      { platform: 'Aptitude', score: 71 },
      { platform: 'Coding', score: 68 },
      { platform: 'Time Mgmt', score: 64 },
      { platform: 'Consistency', score: 73 },
    ],
    strong: [
      { label: 'Subject Theory', value: 76 },
      { label: 'Consistency', value: 73 },
      { label: 'Aptitude Speed', value: 71 },
    ],
    weak: [
      { label: 'Coding Accuracy', value: 68 },
      { label: 'Time Management', value: 64 },
      { label: 'Revision Habit', value: 62 },
    ],
  },
  subject: {
    radarData: [
      { platform: 'Data Structures', score: 78 },
      { platform: 'DBMS', score: 72 },
      { platform: 'OS', score: 64 },
      { platform: 'CN', score: 61 },
      { platform: 'Problem Solving', score: 75 },
    ],
    strong: [
      { label: 'Data Structures', value: 78 },
      { label: 'Problem Solving', value: 75 },
      { label: 'DBMS', value: 72 },
    ],
    weak: [
      { label: 'Computer Networks', value: 61 },
      { label: 'Operating Systems', value: 64 },
      { label: 'Advanced SQL', value: 66 },
    ],
  },
  aptitude: {
    radarData: [
      { platform: 'Quant', score: 74 },
      { platform: 'Reasoning', score: 69 },
      { platform: 'Verbal', score: 66 },
      { platform: 'Speed', score: 71 },
      { platform: 'Accuracy', score: 68 },
    ],
    strong: [
      { label: 'Quant Fundamentals', value: 74 },
      { label: 'Speed in Easy Sets', value: 71 },
      { label: 'Logical Basics', value: 69 },
    ],
    weak: [
      { label: 'Verbal Accuracy', value: 66 },
      { label: 'Puzzle Consistency', value: 64 },
      { label: 'Long Set Time Mgmt', value: 62 },
    ],
  },
  coding: {
    radarData: [
      { platform: 'Arrays', score: 79 },
      { platform: 'Strings', score: 75 },
      { platform: 'Trees', score: 66 },
      { platform: 'Graphs', score: 59 },
      { platform: 'DP', score: 57 },
      { platform: 'Debugging', score: 70 },
    ],
    strong: [
      { label: 'Arrays & Strings', value: 79 },
      { label: 'Debugging', value: 70 },
      { label: 'Tree Basics', value: 66 },
    ],
    weak: [
      { label: 'Dynamic Programming', value: 57 },
      { label: 'Graph Traversal', value: 59 },
      { label: 'Edge-case Handling', value: 61 },
    ],
  },
};

export default function MockTests() {
  const [allTests, setAllTests] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [activeTest, setActiveTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQ, setCurrentQ] = useState(0);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/tests')
      .then(r => setAllTests(r.data && r.data.length ? r.data : MOCK_TESTS))
      .catch(() => setAllTests(MOCK_TESTS));
  }, []);

  useEffect(() => {
    api.get('/tests/submissions/history').then(r => setSubmissions(r.data)).catch(() => setSubmissions([]));
  }, []);

  const tests = useMemo(() => {
    if (filter === 'all') return allTests;
    return allTests.filter(test => test.test_type === filter);
  }, [allTests, filter]);

  const performanceAnalytics = useMemo(() => {
    const testMap = new Map(tests.map(test => [test.id, test]));
    const conceptStats = {};
    const platformStats = {};

    submissions.forEach(submission => {
      const test = testMap.get(submission.test_id);
      if (!test) {
        return;
      }

      const platform = test.subject || test.test_type || 'General';
      if (!platformStats[platform]) {
        platformStats[platform] = { label: platform, totalAccuracy: 0, attempts: 0 };
      }
      platformStats[platform].totalAccuracy += Number(submission.accuracy || 0);
      platformStats[platform].attempts += 1;

      const questions = test.questions || [];
      questions.forEach(question => {
        const questionId = String(question.id ?? '');
        const answer = submission.answers?.[questionId];
        if (answer === undefined) {
          return;
        }

        const concept =
          question.concept ||
          question.topic ||
          question.tag ||
          test.subject ||
          `${test.test_type} concepts`;

        if (!conceptStats[concept]) {
          conceptStats[concept] = { concept, attempted: 0, correct: 0 };
        }

        conceptStats[concept].attempted += 1;
        if (answer === question.correct_answer) {
          conceptStats[concept].correct += 1;
        }
      });
    });

    const concepts = Object.values(conceptStats)
      .map(item => ({
        ...item,
        accuracy: Math.round((item.correct / item.attempted) * 100),
      }))
      .sort((a, b) => b.attempted - a.attempted);

    const platformRows = Object.values(platformStats)
      .map(item => ({
        label: item.label,
        value: Math.round(item.totalAccuracy / item.attempts),
      }))
      .sort((a, b) => b.value - a.value);

    let radarData = platformRows.slice(0, 6).map(item => ({
      platform: item.label.length > 16 ? `${item.label.slice(0, 16)}...` : item.label,
      score: item.value,
    }));

    let strong = platformRows.slice(0, 3);
    let weak = [...platformRows].sort((a, b) => a.value - b.value).slice(0, 3);

    if (radarData.length === 0) {
      const fallback = FILTER_INSIGHT_FALLBACK[filter] || FILTER_INSIGHT_FALLBACK.all;
      radarData = fallback.radarData;
      strong = fallback.strong;
      weak = fallback.weak;
    }

    return { concepts, radarData, strong, weak };
  }, [tests, submissions]);

  const startTest = (test) => {
    setActiveTest(test);
    setAnswers({});
    setCurrentQ(0);
    setResult(null);
  };

  const submitTest = () => {
    if (!activeTest) return;
    let correct = 0;
    const answered = Object.keys(answers).length;
    activeTest.questions.forEach(q => {
      if (answers[q.id] === q.correct_answer) correct += 1;
    });
    setResult({ correct, total: activeTest.questions.length, answered });
  };

  const closeModal = () => {
    setActiveTest(null);
    setAnswers({});
    setResult(null);
  };

  return (
    <div className="page">
      <Topbar title="Mock Tests" />
      <div className="page-content">
        <div className="page-header">
          <div className="filter-bar">
            {['all', 'subject', 'aptitude', 'coding'].map(f => (
              <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="card test-concept-analytics-card">
          <div className="card-header">
            <h3>Performance Star Plot</h3>
            <span className="mini-text">
              Filter: {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </span>
          </div>

          {performanceAnalytics.radarData.length > 0 ? (
            <div className="test-performance-layout">
              <div className="test-insight-panel">
                <h4>Strong Platforms</h4>
                {performanceAnalytics.strong.map(item => (
                  <div key={item.label} className="test-concept-list-item good">
                    <span>{item.label}</span>
                    <strong>{item.value}%</strong>
                  </div>
                ))}

                <h4 className="test-insight-subtitle">Needs Improvement</h4>
                {performanceAnalytics.weak.map(item => (
                  <div key={item.label} className="test-concept-list-item weak">
                    <span>{item.label}</span>
                    <strong>{item.value}%</strong>
                  </div>
                ))}
              </div>

              <div className="chart-container test-concept-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={performanceAnalytics.radarData}>
                    <PolarGrid stroke="rgba(31, 36, 48, 0.12)" />
                    <PolarAngleAxis dataKey="platform" tick={{ fill: '#697089', fontSize: 11 }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#697089', fontSize: 11 }} />
                    <Radar dataKey="score" stroke="#6c63ff" fill="rgba(108, 99, 255, 0.28)" fillOpacity={0.8} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <h3>No concept analytics yet</h3>
              <p>Take a few tests in this filter to see strengths and weak areas.</p>
            </div>
          )}
        </div>

        <div className="test-grid">
          {tests.map(t => (
            <div key={t.id} className="card test-card">
              <div className="test-card-header">
                <span className="test-type-badge">{t.test_type}</span>
                <span className="difficulty-badge" style={{ background: DIFF_COLORS[t.difficulty] }}>
                  {t.difficulty}
                </span>
              </div>
              <h3>{t.title}</h3>
              <p className="test-desc">{t.description}</p>
              <div className="test-meta">
                <span><FiClock /> {t.duration_minutes} min</span>
                <span><FiBarChart2 /> {t.total_marks} marks</span>
                <span>📝 {t.questions?.length || 0} questions</span>
              </div>
              {t.subject && <span className="test-subject">{t.subject}</span>}
              <button className="btn-primary full-width" onClick={() => startTest(t)}>
                <FiPlay /> Start Test
              </button>
            </div>
          ))}
        </div>
        {tests.length === 0 && (
          <div className="empty-state">
            <h3>No tests available</h3>
            <p>Check back later for new mock tests</p>
          </div>
        )}
      </div>

      {activeTest && (
        <div className="quiz-modal">
          <div className="quiz-dialog card">
            <div className="quiz-header">
              <div>
                <h3>{activeTest.title}</h3>
                <p className="test-desc">{activeTest.description}</p>
              </div>
              <button className="btn-secondary" onClick={closeModal}>Close</button>
            </div>

            {result ? (
              <div className="quiz-result">
                <h4>Score: {result.correct}/{result.total}</h4>
                <p>Answered: {result.answered} of {result.total}</p>
                <button className="btn-primary" onClick={() => { setResult(null); setAnswers({}); setCurrentQ(0); }}>Retry</button>
              </div>
            ) : (
              <>
                <div className="quiz-meta">
                  <span>Question {currentQ + 1} / {activeTest.questions.length}</span>
                  <span>{activeTest.subject}</span>
                </div>
                <div className="quiz-question">
                  {activeTest.questions[currentQ].question}
                </div>
                <div className="quiz-options">
                  {activeTest.questions[currentQ].options.map(opt => (
                    <button
                      key={opt}
                      className={`quiz-option ${answers[activeTest.questions[currentQ].id] === opt ? 'selected' : ''}`}
                      onClick={() => setAnswers({ ...answers, [activeTest.questions[currentQ].id]: opt })}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <div className="quiz-actions">
                  <button
                    className="btn-secondary"
                    disabled={currentQ === 0}
                    onClick={() => setCurrentQ(q => Math.max(0, q - 1))}
                  >Prev</button>
                  {currentQ < activeTest.questions.length - 1 ? (
                    <button className="btn-primary" onClick={() => setCurrentQ(q => Math.min(activeTest.questions.length - 1, q + 1))}>Next</button>
                  ) : (
                    <button className="btn-primary" onClick={submitTest}>Submit</button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
