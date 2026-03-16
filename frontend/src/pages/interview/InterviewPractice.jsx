import { useMemo, useState } from 'react';
import {
  FiTarget,
  FiLayers,
  FiBarChart2,
  FiUserCheck,
  FiPlay,
  FiClock,
  FiTrendingUp,
  FiCheckCircle,
  FiAperture,
  FiZap,
  FiFilter,
} from 'react-icons/fi';
import Topbar from '../../components/Topbar';
import StatCard from '../../components/StatCard';

const topicData = [
  { label: 'Arrays', total: 42, solved: 28, color: '#6c63ff' },
  { label: 'Strings', total: 36, solved: 19, color: '#74c0fc' },
  { label: 'Linked Lists', total: 24, solved: 15, color: '#51cf66' },
  { label: 'Stacks & Queues', total: 20, solved: 13, color: '#ffa94d' },
  { label: 'Trees & Binary Trees', total: 34, solved: 18, color: '#f783ac' },
  { label: 'Graph Algorithms', total: 26, solved: 11, color: '#4dabf7' },
  { label: 'Dynamic Programming', total: 45, solved: 18, color: '#845ef7' },
  { label: 'Greedy Algorithms', total: 18, solved: 10, color: '#ff922b' },
];

const difficultyData = [
  { label: 'Easy', solved: 32, total: 50, note: 'Warm-up speed rounds' },
  { label: 'Medium', solved: 58, total: 92, note: 'Common interview mix' },
  { label: 'Hard', solved: 24, total: 48, note: '45-minute drills' },
];

const companyData = [
  { label: 'Amazon', total: 28, solved: 13, focus: 'DP + Strings' },
  { label: 'Google', total: 26, solved: 10, focus: 'Graphs + Trees' },
  { label: 'Microsoft', total: 22, solved: 12, focus: 'Arrays + Bitmask' },
  { label: 'TCS', total: 18, solved: 12, focus: 'Aptitude + SQL mix' },
  { label: 'Infosys', total: 16, solved: 11, focus: 'DS fundamentals' },
];

const systemFoundations = [
  'Load balancing strategies and failure handling',
  'Caching patterns with invalidation and TTL choices',
  'Database sharding + replication trade-offs',
  'API design principles with versioning and rate limits',
];

const systemDrills = [
  'Design a URL shortener - capacity + datastore choices',
  'Design a messaging system - queues, fanout, retries',
  'Design online file storage - chunking + metadata',
  'Design a ride-sharing app - dispatch, surge, ETA service',
];

const systemDeliverables = [
  'Problem description and constraints',
  'Design components with call flows',
  'Example architecture diagram with bottlenecks highlighted',
  'Key discussion points and trade-off talking tracks',
];

const coreSections = [
  {
    title: 'Operating Systems',
    items: [
      'Processes vs threads, context switching scenarios',
      'Deadlocks: necessary conditions + prevention strategy',
      'CPU scheduling: RR vs SJF vs Priority examples',
      'Virtual memory: paging, TLB misses, thrashing cases',
    ],
  },
  {
    title: 'Database Management Systems',
    items: [
      'SQL joins + window queries with sample snippets',
      'Indexing: B-Tree vs Hash, covering index examples',
      'Normalization: 1NF -> BCNF with quick checks',
      'Transactions: ACID, isolation levels, phantom reads',
    ],
  },
  {
    title: 'Computer Networks & OOP',
    items: [
      'TCP vs UDP trade-offs with when-to-use examples',
      'HTTP vs HTTPS handshake summary + status codes',
      'DNS resolution flow and caching layers',
      'OOP pillars with design pattern flashcards',
    ],
  },
];

const aptitudeSections = [
  {
    title: 'Quantitative aptitude',
    items: [
      'Percentages, Profit/Loss, Time & Work, Probability, Number Systems',
      'Timed quizzes with solution walkthroughs',
      'Speed/accuracy tracker by topic',
    ],
  },
  {
    title: 'Logical reasoning',
    items: [
      'Pattern recognition and series completion',
      'Logical puzzles and coding-decoding sets',
      'Blood relations with tree visualization',
    ],
  },
  {
    title: 'Verbal ability',
    items: [
      'Reading comprehension mini passages',
      'Sentence correction and vocabulary builders',
      'Adaptive MCQs with instant feedback',
    ],
  },
];

const hrSections = [
  {
    title: 'Common HR questions',
    items: [
      'Tell me about yourself',
      'Why should we hire you?',
      'Strengths and weaknesses with impact examples',
      'Where do you see yourself in five years?',
    ],
  },
  {
    title: 'Behavioral prompts',
    items: [
      'Describe a challenging situation you handled',
      'Tell me about a leadership experience',
      'Explain a conflict you resolved in a team',
    ],
  },
  {
    title: 'Practice methods',
    items: [
      'Write responses, record audio answers, and compare with model answers',
      'Score for clarity, structure (STAR), and confidence',
      'Track improvement over weekly HR sprints',
    ],
  },
];

const simulations = [
  {
    type: 'Technical interview simulation',
    duration: '30 mins',
    questions: 5,
    next: 'Today 07:00 PM',
    focus: 'Algorithms, code quality, walkthrough',
  },
  {
    type: 'Coding interview simulation (editor)',
    duration: '45 mins',
    questions: 3,
    next: 'Tomorrow 06:30 PM',
    focus: 'Implementation speed, edge cases',
  },
  {
    type: 'HR interview simulation',
    duration: '25 mins',
    questions: 6,
    next: 'Fri 05:00 PM',
    focus: 'STAR clarity, confidence, tone',
  },
];

const progressTracking = [
  { label: 'Coding Practice', value: 65, suffix: '%', note: 'Planned vs completed' },
  { label: 'System Design', value: 40, suffix: '%', note: 'Diagrams completed' },
  { label: 'Core Subjects', value: 55, suffix: '%', note: 'OS/DBMS/CN revision' },
  { label: 'HR Interview', value: 35, suffix: '%', note: 'Recorded answers' },
];

const recommendations = [
  'Solve 5 Dynamic Programming problems today',
  'Review database indexing concepts',
  'Practice answering HR behavioral questions',
  'Add one system design diagram to your notes',
];

function ProgressRow({ label, solved, total, color }) {
  const pct = Math.round((solved / total) * 100);
  return (
    <div className="practice-progress-row">
      <div className="practice-progress-meta">
        <span>{label}</span>
        <span>{solved} / {total} ({pct}%)</span>
      </div>
      <div className="practice-progress-bar">
        <div className="practice-progress-fill" style={{ width: `${pct}%`, background: color || 'var(--accent)' }} />
      </div>
    </div>
  );
}

export default function InterviewPractice() {
  const [activeCompany, setActiveCompany] = useState('Amazon');
  const [activeDifficulty, setActiveDifficulty] = useState('Easy');
  const activeCompanyData = useMemo(
    () => companyData.find(c => c.label === activeCompany) || companyData[0],
    [activeCompany],
  );
  const activeDifficultyData = useMemo(
    () => difficultyData.find(d => d.label === activeDifficulty) || difficultyData[0],
    [activeDifficulty],
  );

  return (
    <div className="page">
      <Topbar title="Interview Practice" />
      <div className="page-content interview-practice-page">
        <div className="stats-grid interview-stats-grid">
          <StatCard icon={<FiCheckCircle />} label="Coding practice" value="218 / 420" sub="Topic-wise problems" trend={{ direction: 'up', text: '+14 this week' }} color="#6c63ff" />
          <StatCard icon={<FiLayers />} label="System design drills" value="12 / 24" sub="Blueprinted cases" color="#74c0fc" />
          <StatCard icon={<FiTarget />} label="Aptitude accuracy" value="82%" sub="Timed quiz average" trend={{ direction: 'up', text: '+3% vs last week' }} color="#51cf66" />
          <StatCard icon={<FiUserCheck />} label="HR practice sets" value="28" sub="Recorded and reviewed" color="#ffa94d" />
        </div>

        <div className="card practice-hero-card">
          <div>
            <div className="practice-breadcrumb">Interview Practice</div>
            <h3>Daily interview drill plan</h3>
            <p className="practice-hero-text">
              Topic-wise coding sets, system design sketches, aptitude sprints, and HR recordings in one flow. Stay on streak and track completion in real time.
            </p>
            <div className="practice-hero-tags">
              <span className="tag">DP focus</span>
              <span className="tag">Caching design</span>
              <span className="tag">STAR answers</span>
              <span className="tag">Timed aptitude</span>
            </div>
          </div>
          <div className="practice-hero-actions">
            <button type="button" className="btn-primary">
              <FiPlay /> Start 30-min mock
            </button>
            <button type="button" className="btn-secondary">
              <FiFilter /> Open question bank
            </button>
            <div className="practice-hero-meta">
              <span><FiClock /> Next simulation: Today 07:00 PM</span>
              <span><FiTrendingUp /> Streak: 6 days (best 14)</span>
            </div>
          </div>
        </div>

        <div className="practice-columns">
          <div className="card">
            <div className="card-header">
              <h3>Coding Interview Practice</h3>
              <span className="mini-text">Live totals update as you mark solved</span>
            </div>
            <div className="practice-subsection">
              <h4>Topic-wise practice</h4>
              <div className="practice-progress-list">
                {topicData.map(topic => (
                  <ProgressRow key={topic.label} {...topic} />
                ))}
              </div>
            </div>

            <div className="practice-subsection">
              <h4>Difficulty sets</h4>
              <div className="practice-chip-group">
                {difficultyData.map(d => (
                  <button
                    key={d.label}
                    type="button"
                    className={`practice-chip ${activeDifficulty === d.label ? 'active' : ''}`}
                    onClick={() => setActiveDifficulty(d.label)}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
              <div className="practice-difficulty-card">
                <div>
                  <div className="practice-progress-meta">
                    <strong>{activeDifficultyData.label}</strong>
                    <span>{activeDifficultyData.solved} / {activeDifficultyData.total}</span>
                  </div>
                  <div className="practice-progress-bar">
                    <div
                      className="practice-progress-fill"
                      style={{
                        width: `${Math.round((activeDifficultyData.solved / activeDifficultyData.total) * 100)}%`,
                        background: 'var(--accent)',
                      }}
                    />
                  </div>
                  <p className="practice-note">{activeDifficultyData.note}</p>
                </div>
              </div>
            </div>

            <div className="practice-subsection">
              <h4>Company sets</h4>
              <div className="practice-chip-group">
                {companyData.map(company => (
                  <button
                    key={company.label}
                    type="button"
                    className={`practice-chip ${activeCompany === company.label ? 'active' : ''}`}
                    onClick={() => setActiveCompany(company.label)}
                  >
                    {company.label}
                  </button>
                ))}
              </div>
              <div className="practice-company-card">
                <div className="practice-company-header">
                  <div>
                    <h5>{activeCompanyData.label} coding questions</h5>
                    <p className="practice-note">Focus: {activeCompanyData.focus}</p>
                  </div>
                  <span className="practice-company-total">
                    {activeCompanyData.solved} / {activeCompanyData.total}
                  </span>
                </div>
                <div className="practice-progress-bar">
                  <div
                    className="practice-progress-fill"
                    style={{
                      width: `${Math.round((activeCompanyData.solved / activeCompanyData.total) * 100)}%`,
                      background: '#6c63ff',
                    }}
                  />
                </div>
                <div className="practice-company-actions">
                  <button type="button" className="btn-sm">
                    <FiPlay /> Start set
                  </button>
                  <button type="button" className="btn-sm">
                    <FiAperture /> View tags
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3>System Design Practice</h3>
            <div className="practice-list-block">
              <h4>Foundations</h4>
              <ul className="interview-list">
                {systemFoundations.map(item => (
                  <li key={item}><span className="interview-list-dot" /> <span>{item}</span></li>
                ))}
              </ul>
            </div>
            <div className="practice-list-block">
              <h4>Hands-on drills</h4>
              <ul className="interview-list">
                {systemDrills.map(item => (
                  <li key={item}><span className="interview-list-dot" /> <span>{item}</span></li>
                ))}
              </ul>
            </div>
            <div className="practice-list-block">
              <h4>Deliverables</h4>
              <ul className="interview-list">
                {systemDeliverables.map(item => (
                  <li key={item}><span className="interview-list-dot" /> <span>{item}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="practice-columns">
          <div className="card">
            <h3>Core Computer Science Practice</h3>
            <div className="interview-list-card">
              {coreSections.map(section => (
                <div key={section.title} className="practice-list-block">
                  <h4>{section.title}</h4>
                  <ul className="interview-list">
                    {section.items.map(item => (
                      <li key={item}><span className="interview-list-dot" /> <span>{item}</span></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3>Aptitude Practice</h3>
            {aptitudeSections.map(section => (
              <div key={section.title} className="practice-list-block">
                <h4>{section.title}</h4>
                <ul className="interview-list">
                  {section.items.map(item => (
                    <li key={item}><span className="interview-list-dot" /> <span>{item}</span></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="practice-columns">
          <div className="card">
            <h3>HR and Behavioral Interview Practice</h3>
            {hrSections.map(section => (
              <div key={section.title} className="practice-list-block">
                <h4>{section.title}</h4>
                <ul className="interview-list">
                  {section.items.map(item => (
                    <li key={item}><span className="interview-list-dot" /> <span>{item}</span></li>
                  ))}
                </ul>
              </div>
            ))}
            <button type="button" className="btn-primary full-width">
              <FiUserCheck /> Record an HR answer
            </button>
          </div>

          <div className="card">
            <h3>Interview Simulation Practice</h3>
            <div className="practice-sim-grid">
              {simulations.map(sim => (
                <div key={sim.type} className="practice-sim-card">
                  <div className="practice-sim-header">
                    <span className="practice-chip muted">{sim.duration}</span>
                    <span className="practice-chip muted">{sim.questions} questions</span>
                  </div>
                  <h4>{sim.type}</h4>
                  <p className="practice-note">{sim.focus}</p>
                  <div className="practice-sim-meta">
                    <FiClock /> Next slot: {sim.next}
                  </div>
                  <button type="button" className="btn-sm">
                    <FiPlay /> Start simulation
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="practice-columns">
          <div className="card">
            <h3>Practice Progress Tracking</h3>
            <div className="practice-progress-list">
              {progressTracking.map(item => (
                <div key={item.label} className="practice-progress-row">
                  <div className="practice-progress-meta">
                    <span>{item.label}</span>
                    <span>{item.value}{item.suffix || ''}</span>
                  </div>
                  <div className="practice-progress-bar">
                    <div className="practice-progress-fill" style={{ width: `${item.value}%`, background: '#6c63ff' }} />
                  </div>
                  <p className="practice-note">{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3>Personalized Practice Recommendations</h3>
            <ul className="interview-list">
              {recommendations.map(item => (
                <li key={item}><span className="interview-list-dot" /> <span>{item}</span></li>
              ))}
            </ul>
            <div className="practice-reco-actions">
              <button type="button" className="btn-primary full-width">
                <FiZap /> Apply to today
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
