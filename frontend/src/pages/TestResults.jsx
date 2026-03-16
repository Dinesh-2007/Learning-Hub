import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Topbar from '../components/Topbar';
import ProgressRing from '../components/ProgressRing';
import { FiArrowLeft, FiCheckCircle, FiXCircle } from 'react-icons/fi';

export default function TestResults() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const submission = state?.submission;
  const test = state?.test;

  if (!submission || !test) {
    return (
      <div className="page">
        <Topbar title="Test Results" />
        <div className="page-content">
          <div className="empty-state">
            <h3>No results to display</h3>
            <button className="btn-primary" onClick={() => navigate('/tests')}>Back to Tests</button>
          </div>
        </div>
      </div>
    );
  }

  const questions = test.questions || [];

  return (
    <div className="page">
      <Topbar title="Test Results" />
      <div className="page-content">
        <button className="btn-back" onClick={() => navigate('/tests')}><FiArrowLeft /> Back to Tests</button>

        <div className="results-summary">
          <div className="card result-score-card">
            <h3>Your Score</h3>
            <ProgressRing percentage={submission.accuracy} size={140} color={submission.accuracy >= 60 ? '#51cf66' : '#ff6b6b'} />
            <div className="result-numbers">
              <div><span className="big">{submission.score}</span>/{submission.total_marks}</div>
              <div className="result-meta">
                <span>Accuracy: {submission.accuracy.toFixed(1)}%</span>
                <span>Time: {submission.time_taken_minutes.toFixed(1)} min</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3>Question Review</h3>
          <div className="review-list">
            {questions.map((q, i) => {
              const userAns = submission.answers[String(q.id)];
              const correct = userAns === q.correct_answer;
              return (
                <div key={q.id} className={`review-item ${correct ? 'correct' : 'wrong'}`}>
                  <div className="review-header">
                    <span className="review-num">Q{i + 1}</span>
                    {correct ? <FiCheckCircle className="correct-icon" /> : <FiXCircle className="wrong-icon" />}
                  </div>
                  <p className="review-question">{q.question}</p>
                  <div className="review-answers">
                    <div className="your-answer"><strong>Your answer:</strong> {userAns || 'Not answered'}</div>
                    {!correct && <div className="correct-answer"><strong>Correct:</strong> {q.correct_answer}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
