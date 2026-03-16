import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import api from '../api/axios';
import { FiPlay, FiClock, FiBarChart2 } from 'react-icons/fi';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

const DIFF_COLORS = { easy: '#51cf66', medium: '#ffa94d', hard: '#ff6b6b' };

export default function MockTests() {
  const [tests, setTests] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const params = filter !== 'all' ? `?test_type=${filter}` : '';
    api.get(`/tests${params}`).then(r => setTests(r.data)).catch(() => setTests([]));
  }, [filter]);

  useEffect(() => {
    api.get('/tests/submissions/history').then(r => setSubmissions(r.data)).catch(() => setSubmissions([]));
  }, []);

  const conceptAnalytics = useMemo(() => {
    const testMap = new Map(tests.map(test => [test.id, test]));
    const stats = {};

    submissions.forEach(submission => {
      const test = testMap.get(submission.test_id);
      if (!test) {
        return;
      }

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

        if (!stats[concept]) {
          stats[concept] = { concept, attempted: 0, correct: 0 };
        }

        stats[concept].attempted += 1;
        if (answer === question.correct_answer) {
          stats[concept].correct += 1;
        }
      });
    });

    const concepts = Object.values(stats)
      .map(item => ({
        ...item,
        accuracy: Math.round((item.correct / item.attempted) * 100),
      }))
      .sort((a, b) => b.attempted - a.attempted);

    const radarData = concepts.slice(0, 6).map(item => ({
      concept: item.concept.length > 18 ? `${item.concept.slice(0, 18)}...` : item.concept,
      accuracy: item.accuracy,
    }));

    const strong = [...concepts].sort((a, b) => b.accuracy - a.accuracy).slice(0, 4);
    const weak = [...concepts].sort((a, b) => a.accuracy - b.accuracy).slice(0, 4);

    return { concepts, radarData, strong, weak };
  }, [tests, submissions]);

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
            <h3>Concept Accuracy Star Plot</h3>
            <span className="mini-text">
              Filter: {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </span>
          </div>

          {conceptAnalytics.radarData.length > 0 ? (
            <div className="test-concept-grid">
              <div className="chart-container test-concept-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={conceptAnalytics.radarData}>
                    <PolarGrid stroke="rgba(31, 36, 48, 0.12)" />
                    <PolarAngleAxis dataKey="concept" tick={{ fill: '#697089', fontSize: 11 }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#697089', fontSize: 11 }} />
                    <Radar dataKey="accuracy" stroke="#6c63ff" fill="rgba(108, 99, 255, 0.28)" fillOpacity={0.8} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="test-concept-lists">
                <div className="test-concept-list-box">
                  <h4>Strong Concepts</h4>
                  {conceptAnalytics.strong.map(item => (
                    <div key={item.concept} className="test-concept-list-item good">
                      <span>{item.concept}</span>
                      <strong>{item.accuracy}%</strong>
                    </div>
                  ))}
                </div>

                <div className="test-concept-list-box">
                  <h4>Weak Concepts</h4>
                  {conceptAnalytics.weak.map(item => (
                    <div key={item.concept} className="test-concept-list-item weak">
                      <span>{item.concept}</span>
                      <strong>{item.accuracy}%</strong>
                    </div>
                  ))}
                </div>
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
              <button className="btn-primary full-width" onClick={() => navigate(`/tests/${t.id}/take`)}>
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
    </div>
  );
}
