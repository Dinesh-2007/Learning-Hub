import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import api from '../api/axios';
import { FiClock, FiArrowRight, FiArrowLeft, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function TakeTest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const startTime = useRef(Date.now());

  useEffect(() => {
    api.get(`/tests/${id}`).then(r => {
      setTest(r.data);
      setTimeLeft(r.data.duration_minutes * 60);
    });
  }, [id]);

  useEffect(() => {
    if (!test || submitted) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { handleSubmit(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [test, submitted]);

  const handleSubmit = async () => {
    if (submitted) return;
    setSubmitted(true);
    const elapsed = (Date.now() - startTime.current) / 60000;
    try {
      const res = await api.post('/tests/submit', {
        test_id: parseInt(id), answers, time_taken_minutes: Math.round(elapsed * 10) / 10
      });
      toast.success(`Test submitted! Score: ${res.data.score}/${res.data.total_marks}`);
      navigate(`/tests/${id}/results`, { state: { submission: res.data, test } });
    } catch { toast.error('Submission failed'); }
  };

  if (!test) return <div className="page"><Topbar title="Loading..." /><div className="loading">Loading test...</div></div>;

  const questions = test.questions || [];
  const q = questions[current];
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="page">
      <Topbar title={test.title} />
      <div className="page-content">
        <div className="test-header-bar">
          <div className="test-timer" style={{ color: timeLeft < 60 ? '#ff6b6b' : 'inherit' }}>
            <FiClock /> {mins}:{secs.toString().padStart(2, '0')}
          </div>
          <div className="test-progress-text">
            Question {current + 1} of {questions.length}
          </div>
          <div className="test-answered">
            {Object.keys(answers).length}/{questions.length} answered
          </div>
        </div>

        {q && (
          <div className="card question-card">
            <div className="question-number">Q{current + 1}</div>
            <h3 className="question-text">{q.question}</h3>
            <div className="options-list">
              {(q.options || []).map((opt, i) => (
                <button key={i}
                  className={`option-btn ${answers[String(q.id)] === opt ? 'selected' : ''}`}
                  onClick={() => setAnswers({ ...answers, [String(q.id)]: opt })}>
                  <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                  <span>{opt}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="question-nav">
          <button className="btn-secondary" onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}>
            <FiArrowLeft /> Previous
          </button>
          
          <div className="question-dots">
            {questions.map((_, i) => (
              <button key={i}
                className={`q-dot ${i === current ? 'current' : ''} ${answers[String(questions[i]?.id)] ? 'answered' : ''}`}
                onClick={() => setCurrent(i)}>
                {i + 1}
              </button>
            ))}
          </div>

          {current < questions.length - 1 ? (
            <button className="btn-primary" onClick={() => setCurrent(current + 1)}>
              Next <FiArrowRight />
            </button>
          ) : (
            <button className="btn-primary submit-btn" onClick={handleSubmit} disabled={submitted}>
              <FiCheck /> Submit Test
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
