import {
  FiCalendar,
  FiBarChart2,
  FiBookOpen,
  FiClock,
  FiTarget,
  FiTrendingUp,
  FiCheckCircle,
  FiUsers,
} from 'react-icons/fi';

export const INTERVIEW_MODULES = {
  dashboard: {
    title: 'Interview Dashboard',
    description: 'Track upcoming drives, revision focus, and recent interview preparation activities.',
    contentTags: [
      'Upcoming interviews',
      'Interview preparation progress',
      'Recommended topics to revise',
      'Latest interview activities',
    ],
    metrics: [
      { label: 'Upcoming Interviews', value: '5', sub: 'Next one in 2 days', color: '#6c63ff', icon: FiCalendar },
      { label: 'Prep Progress', value: '74%', sub: '88/120 tasks completed', color: '#51cf66', icon: FiBarChart2 },
      { label: 'Topics To Revise', value: '12', sub: '6 high-priority', color: '#ffa94d', icon: FiBookOpen },
      { label: 'Weekly Activities', value: '19', sub: '4 mock sessions', color: '#74c0fc', icon: FiClock },
    ],
    cards: [
      {
        title: 'Upcoming Interviews',
        items: [
          'Product Analyst | Freshworks | Tue 10:00 AM',
          'SDE Intern | Zoho | Thu 11:30 AM',
          'Software Engineer | TCS Digital | Mar 22',
          'Backend Developer | Thoughtworks | Mar 25',
          'Graduate Engineer Trainee | Cognizant | Apr 1',
        ],
      },
      {
        title: 'Latest Activities',
        items: [
          'Completed HR mock round with 82% communication score',
          'Solved 14 medium DSA interview questions in practice set',
          'Revised DBMS normalization and indexing notes',
          'Updated STAR-format answers for behavioral questions',
          'Analyzed previous mock mistakes in recursion topics',
        ],
      },
    ],
  },
  'question-bank': {
    title: 'Interview Question Bank',
    description: 'Curated interview questions across technical, HR, behavioral, coding, and company-specific tracks.',
    contentTags: [
      'Technical questions',
      'HR questions',
      'Behavioral questions',
      'Coding interview questions',
      'Company specific questions',
    ],
    metrics: [
      { label: 'Total Questions', value: '1,280', sub: 'Across 5 tracks', color: '#6c63ff', icon: FiBookOpen },
      { label: 'Solved', value: '846', sub: '66% completion', color: '#51cf66', icon: FiCheckCircle },
      { label: 'Bookmarked', value: '94', sub: 'Revision shortlist', color: '#ffa94d', icon: FiTarget },
      { label: 'Accuracy', value: '78%', sub: 'Last 30 days', color: '#74c0fc', icon: FiTrendingUp },
    ],
    cards: [
      {
        title: 'High-frequency Technical Questions',
        items: [
          'Explain ACID properties with real transaction examples',
          'How does process scheduling work in modern OS?',
          'Difference between TCP and UDP for real systems',
          'How is indexing implemented in relational databases?',
          'What are deadlocks and deadlock prevention strategies?',
        ],
      },
      {
        title: 'Top Company-specific Sets',
        items: [
          'Infosys: 120 coding + aptitude rounds',
          'Accenture: 95 communication + scenario-based questions',
          'Amazon: 160 leadership + DSA mixed bank',
          'Wipro: 88 interview and project discussion prompts',
          'Capgemini: 104 SQL and OOP-focused interview questions',
        ],
      },
    ],
  },
  'mock-interview': {
    title: 'Mock Interview',
    description: 'Run realistic technical, HR, and coding simulations with time pressure and feedback analytics.',
    contentTags: [
      'Technical mock interview',
      'HR mock interview',
      'Coding interview simulation',
      'Timed interview practice',
    ],
    metrics: [
      { label: 'Mocks Attempted', value: '43', sub: 'This semester', color: '#6c63ff', icon: FiUsers },
      { label: 'Avg Score', value: '81%', sub: 'Across all rounds', color: '#51cf66', icon: FiBarChart2 },
      { label: 'Coding Completion', value: '69%', sub: 'Within interview time', color: '#ffa94d', icon: FiClock },
      { label: 'Confidence Gain', value: '+18%', sub: 'From baseline', color: '#74c0fc', icon: FiTrendingUp },
    ],
    cards: [
      {
        title: 'Scheduled Mock Sessions',
        items: [
          'Technical Round 2 | DSA + OOP | Today 7:00 PM',
          'HR Round Simulation | Behavioral + Resume | Tomorrow 6:30 PM',
          'Coding Interview Drill | 2 medium + 1 hard | Fri 8:00 PM',
          'Timed Communication Round | 20-min panel | Sat 5:30 PM',
        ],
      },
      {
        title: 'Recent Mock Feedback',
        items: [
          'Strength: Structured problem explanation and dry-run clarity',
          'Improve: Edge-case handling for graph questions',
          'Strength: Better body language and confidence in HR responses',
          'Improve: Reduce pause time before final code optimization',
          'Action: Practice 3 system design walkthroughs this week',
        ],
      },
    ],
  },
  'practice-topics': {
    title: 'Interview Practice Topics',
    description: 'Topic-wise interview drill plans for DSA, system design, core CS subjects, and problem solving.',
    contentTags: [
      'Data Structures questions',
      'System design basics',
      'Core subjects (OS, DBMS, CN)',
      'Problem solving exercises',
    ],
    metrics: [
      { label: 'Topic Sets', value: '64', sub: 'Guided plans', color: '#6c63ff', icon: FiBookOpen },
      { label: 'Completed', value: '39', sub: '61% done', color: '#51cf66', icon: FiCheckCircle },
      { label: 'Pending Hard Topics', value: '11', sub: 'High impact', color: '#ffa94d', icon: FiTarget },
      { label: 'Practice Hours', value: '127h', sub: 'Last 90 days', color: '#74c0fc', icon: FiClock },
    ],
    cards: [
      {
        title: 'Current Focus Topics',
        items: [
          'Trees and Graph traversal interview patterns',
          'Low-level system design for URL shortener and cache layer',
          'DBMS query optimization, indexing, and joins deep dive',
          'Operating Systems: memory management and process sync',
          'CN: congestion control and protocol-level troubleshooting',
        ],
      },
      {
        title: 'Problem Solving Exercise Queue',
        items: [
          'Sliding window medium set (8 problems)',
          'Binary search on answer problems (6 problems)',
          'Dynamic programming interview mix (10 problems)',
          'Backtracking and recursion sprint (7 problems)',
          'Company-tagged coding set for Zoho and Amazon',
        ],
      },
    ],
  },
  'resume-prep': {
    title: 'Resume Preparation',
    description: 'Build and optimize interview-ready resumes using templates, scoring, and targeted suggestions.',
    contentTags: [
      'Resume builder',
      'Resume templates',
      'Resume score analyzer',
      'Resume improvement suggestions',
    ],
    metrics: [
      { label: 'Resume Score', value: '86/100', sub: 'ATS + recruiter fit', color: '#6c63ff', icon: FiBarChart2 },
      { label: 'Template Variants', value: '7', sub: 'Role-specific', color: '#51cf66', icon: FiBookOpen },
      { label: 'Actionable Fixes', value: '14', sub: '6 high-priority', color: '#ffa94d', icon: FiTarget },
      { label: 'Last Updated', value: '2d ago', sub: 'SDE intern version', color: '#74c0fc', icon: FiClock },
    ],
    cards: [
      {
        title: 'Top Resume Improvement Suggestions',
        items: [
          'Quantify project impact with metrics and scale',
          'Move technical skills section above education',
          'Replace generic objective with role-specific summary',
          'Add internship bullet points using action-result format',
          'Align keywords with backend and full-stack roles',
        ],
      },
      {
        title: 'Template Usage Insights',
        items: [
          'One-page ATS template has 21% better response rate',
          'Project-heavy layout performs better for startup roles',
          'Core CS focus template improves shortlist for service companies',
          'Concise bullet format reduces recruiter skim time by 18%',
        ],
      },
    ],
  },
  experience: {
    title: 'Interview Experience',
    description: 'Review real interview journeys, round patterns, and frequently asked questions by company.',
    contentTags: [
      'Past interview experiences',
      'Company interview patterns',
      'Frequently asked questions',
      'Interview round details',
    ],
    metrics: [
      { label: 'Experience Reports', value: '312', sub: 'Community + personal', color: '#6c63ff', icon: FiBookOpen },
      { label: 'Companies Covered', value: '58', sub: 'Tier-1 and Tier-2', color: '#51cf66', icon: FiUsers },
      { label: 'Most Common Rounds', value: '4', sub: 'OA, Tech1, Tech2, HR', color: '#ffa94d', icon: FiTarget },
      { label: 'Pattern Match Rate', value: '72%', sub: 'Recent drives', color: '#74c0fc', icon: FiTrendingUp },
    ],
    cards: [
      {
        title: 'Latest Experience Highlights',
        items: [
          'Zoho: heavy focus on debugging and SQL joins in round 1',
          'TCS Digital: CS fundamentals + communication-heavy HR round',
          'Amazon intern: DSA medium-hard with leadership discussion',
          'Cognizant: aptitude + coding + project walkthrough sequence',
          'Freshworks: machine coding + architecture tradeoff questions',
        ],
      },
      {
        title: 'Most Asked Questions This Month',
        items: [
          'Design LRU cache with O(1) operations',
          'Explain differences between process and thread with use-cases',
          'How would you optimize a slow SQL query?',
          'Tell me about a conflict in your team and resolution approach',
          'How do you prioritize features under tight deadlines?',
        ],
      },
    ],
  },
  performance: {
    title: 'Interview Performance Tracker',
    description: 'Measure mock outcomes, answer accuracy, communication quality, and weak-topic trends.',
    contentTags: [
      'Mock interview scores',
      'Question accuracy rate',
      'Communication rating',
      'Weak topic identification',
    ],
    metrics: [
      { label: 'Average Mock Score', value: '81%', sub: 'Last 10 interviews', color: '#6c63ff', icon: FiBarChart2 },
      { label: 'Question Accuracy', value: '76%', sub: 'Technical + coding', color: '#51cf66', icon: FiCheckCircle },
      { label: 'Communication Rating', value: '8.2/10', sub: 'Panel feedback', color: '#ffa94d', icon: FiUsers },
      { label: 'Weak Topics', value: '7', sub: 'Need revision', color: '#74c0fc', icon: FiTarget },
    ],
    cards: [
      {
        title: 'Weak Topic Watchlist',
        items: [
          'Dynamic programming state transitions',
          'Deadlock prevention and detection in OS',
          'Network troubleshooting at transport layer',
          'Behavioral answers with measurable outcomes',
          'System design: load balancing and scaling tradeoffs',
        ],
      },
      {
        title: 'Performance Trend Notes',
        items: [
          'Coding round speed improved by 12% over 3 weeks',
          'Behavioral response quality improved after STAR practice',
          'Accuracy dips in graph problems under timed constraints',
          'SQL question performance rose after revision sprint',
        ],
      },
    ],
  },
  resources: {
    title: 'Interview Resources',
    description: 'Central library for notes, videos, coding links, and aptitude preparation material.',
    contentTags: [
      'Interview preparation notes',
      'Video explanations',
      'Coding practice links',
      'Aptitude preparation materials',
    ],
    metrics: [
      { label: 'Resources Saved', value: '248', sub: 'Curated by topic', color: '#6c63ff', icon: FiBookOpen },
      { label: 'Videos Watched', value: '63', sub: 'Concept playlists', color: '#51cf66', icon: FiCheckCircle },
      { label: 'Coding Links Completed', value: '129', sub: 'Interview sets', color: '#ffa94d', icon: FiTarget },
      { label: 'Aptitude Sets', value: '34', sub: 'Timed practice packs', color: '#74c0fc', icon: FiClock },
    ],
    cards: [
      {
        title: 'Recommended This Week',
        items: [
          'DBMS interview crash notes with indexing examples',
          'Top 50 HR interview answers with STAR framework',
          'Graph and tree interview playlist (6-part series)',
          'Company-wise coding list for product companies',
          'Quant aptitude speed math sheets and shortcuts',
        ],
      },
      {
        title: 'Most Accessed Resources',
        items: [
          'OS process scheduling visual notes',
          'System design fundamentals for freshers',
          'Blind 75 coding patterns summary',
          'CN protocols quick revision flashcards',
        ],
      },
    ],
  },
  readiness: {
    title: 'Interview Readiness Indicator',
    description: 'A unified readiness signal based on confidence, mock results, and practice completion.',
    contentTags: [
      'Topic confidence level',
      'Mock interview performance',
      'Coding practice completion',
      'Final interview readiness score',
    ],
    metrics: [
      { label: 'Readiness Score', value: '83%', sub: 'Interview ready', color: '#6c63ff', icon: FiCheckCircle },
      { label: 'Confidence Index', value: '7.9/10', sub: 'Across major topics', color: '#51cf66', icon: FiTrendingUp },
      { label: 'Mock Consistency', value: '78%', sub: 'Stable performance', color: '#ffa94d', icon: FiBarChart2 },
      { label: 'Practice Completion', value: '71%', sub: 'Target 85%', color: '#74c0fc', icon: FiTarget },
    ],
    cards: [
      {
        title: 'Readiness Breakdown',
        items: [
          'DSA readiness: 84% with strong arrays and trees',
          'Core CS readiness: 79% with DBMS stronger than OS',
          'Behavioral readiness: 86% with clear STAR articulation',
          'Aptitude readiness: 74% needs timed arithmetic drills',
        ],
      },
      {
        title: 'Final 7-Day Plan',
        items: [
          '2 technical mock interviews (medium + hard mix)',
          '1 HR mock with feedback on story depth',
          'Daily 90-minute coding problem streak',
          'Revise SQL, indexing, and transaction topics',
          'Final resume pass with impact-focused bullets',
        ],
      },
    ],
  },
  notifications: {
    title: 'Interview Notifications',
    description: 'Stay on top of interview reminders, mock schedule alerts, and practice task prompts.',
    contentTags: [
      'Interview reminders',
      'Mock interview schedule alerts',
      'Practice task notifications',
    ],
    metrics: [
      { label: 'Unread Alerts', value: '9', sub: '3 high-priority', color: '#6c63ff', icon: FiCalendar },
      { label: 'Today Reminders', value: '4', sub: 'Before 8 PM', color: '#51cf66', icon: FiClock },
      { label: 'Mock Alerts', value: '3', sub: 'This week', color: '#ffa94d', icon: FiUsers },
      { label: 'Task Nudges', value: '12', sub: 'Auto-generated', color: '#74c0fc', icon: FiTarget },
    ],
    cards: [
      {
        title: 'Recent Notifications',
        items: [
          'Reminder: Product Analyst interview starts in 48 hours',
          'Alert: HR mock session moved to 6:30 PM today',
          'Task: Complete 5 company-tagged coding questions',
          'Reminder: Revise OS deadlock and scheduling notes',
          'Nudge: Update resume before tomorrow referral drive',
        ],
      },
      {
        title: 'Smart Recommendations',
        items: [
          'Schedule one final coding simulation this weekend',
          'Revisit behavioral answers where confidence < 7/10',
          'Practice concise project explanation in under 2 minutes',
          'Attempt aptitude sprint set to improve speed',
        ],
      },
    ],
  },
};

export const WINDOW_OPTIONS = ['7D', '30D', '90D'];
export const WINDOW_MULTIPLIER = { '7D': 0.9, '30D': 1, '90D': 1.08 };

export const MODULE_VISUALS = {
  dashboard: {
    readiness: 82,
    stageProgress: { completed: 4, total: 6, label: 'Interview Pipeline' },
    coverage: [
      { label: 'Technical Prep', value: 84, color: '#6c63ff' },
      { label: 'Coding Rounds', value: 78, color: '#74c0fc' },
      { label: 'HR Preparation', value: 86, color: '#51cf66' },
      { label: 'Aptitude Practice', value: 69, color: '#ffa94d' },
    ],
    pipeline: [
      { label: 'Freshworks - Product Analyst', date: 'Tue 10:00 AM', status: 'upcoming' },
      { label: 'Zoho - SDE Intern', date: 'Thu 11:30 AM', status: 'scheduled' },
      { label: 'TCS Digital - Software Engineer', date: 'Mar 22', status: 'pending' },
      { label: 'Thoughtworks - Backend Developer', date: 'Mar 25', status: 'pending' },
    ],
    activities: [
      { title: 'Completed HR mock round', meta: 'Communication score: 82%', time: '2h ago' },
      { title: 'Solved 14 DSA interview questions', meta: 'Topic: Trees and Graphs', time: '5h ago' },
      { title: 'Revised DBMS interview notes', meta: 'Normalization + Indexing', time: 'Yesterday' },
      { title: 'Updated STAR behavioral answers', meta: '6 stories refined', time: 'Yesterday' },
    ],
    heatSeed: 3,
  },
  'question-bank': {
    readiness: 76,
    stageProgress: { completed: 3, total: 5, label: 'Question Mastery Stage' },
    coverage: [
      { label: 'Technical Questions', value: 81, color: '#6c63ff' },
      { label: 'Coding Questions', value: 74, color: '#74c0fc' },
      { label: 'Behavioral Questions', value: 79, color: '#51cf66' },
      { label: 'Company-specific Sets', value: 68, color: '#ffa94d' },
    ],
    pipeline: [
      { label: 'Amazon tagged set - 20 Qs', date: 'Today', status: 'in-progress' },
      { label: 'Accenture HR set - 15 Qs', date: 'Tomorrow', status: 'scheduled' },
      { label: 'DBMS rapid-fire bank', date: 'Mar 19', status: 'pending' },
      { label: 'CN interview rapid revision', date: 'Mar 21', status: 'pending' },
    ],
    activities: [
      { title: 'Bookmarked 12 frequently asked questions', meta: 'Backend interviews', time: '1h ago' },
      { title: 'Completed OS fundamentals set', meta: 'Accuracy: 83%', time: '6h ago' },
      { title: 'Reviewed 3 company pattern reports', meta: 'TCS, Cognizant, Infosys', time: 'Yesterday' },
    ],
    heatSeed: 4,
  },
  'mock-interview': {
    readiness: 84,
    stageProgress: { completed: 5, total: 7, label: 'Mock Cycle Completion' },
    coverage: [
      { label: 'Technical Round', value: 82, color: '#6c63ff' },
      { label: 'Coding Simulation', value: 75, color: '#74c0fc' },
      { label: 'HR Round', value: 88, color: '#51cf66' },
      { label: 'Communication', value: 80, color: '#ffa94d' },
    ],
    pipeline: [
      { label: 'Technical Round 2 Simulation', date: 'Today 7:00 PM', status: 'scheduled' },
      { label: 'HR Panel Practice', date: 'Tomorrow 6:30 PM', status: 'scheduled' },
      { label: 'Timed Coding Drill', date: 'Fri 8:00 PM', status: 'upcoming' },
      { label: 'Communication Round', date: 'Sat 5:30 PM', status: 'pending' },
    ],
    activities: [
      { title: 'Technical mock score improved', meta: '74% -> 81%', time: '3h ago' },
      { title: 'Received panel feedback', meta: 'Improve edge-case explanation', time: '7h ago' },
      { title: 'Completed coding simulation', meta: '2/3 problems solved', time: 'Yesterday' },
    ],
    heatSeed: 5,
  },
  'practice-topics': {
    readiness: 73,
    stageProgress: { completed: 8, total: 14, label: 'Topic Sprint Progress' },
    coverage: [
      { label: 'Data Structures', value: 79, color: '#6c63ff' },
      { label: 'System Design Basics', value: 64, color: '#74c0fc' },
      { label: 'Core Subjects', value: 76, color: '#51cf66' },
      { label: 'Problem Solving', value: 71, color: '#ffa94d' },
    ],
    pipeline: [
      { label: 'Graph patterns revision', date: 'Today', status: 'in-progress' },
      { label: 'DBMS interview drills', date: 'Tomorrow', status: 'scheduled' },
      { label: 'OS process sync session', date: 'Mar 19', status: 'pending' },
      { label: 'System design primer', date: 'Mar 21', status: 'pending' },
    ],
    activities: [
      { title: 'Completed 8 sliding-window problems', meta: 'Medium level', time: '2h ago' },
      { title: 'Watched design fundamentals lecture', meta: '45 mins', time: 'Today' },
      { title: 'Practiced CN protocol questions', meta: 'Accuracy: 72%', time: 'Yesterday' },
    ],
    heatSeed: 6,
  },
  'resume-prep': {
    readiness: 88,
    stageProgress: { completed: 6, total: 7, label: 'Resume Optimization Pipeline' },
    coverage: [
      { label: 'ATS Compatibility', value: 91, color: '#6c63ff' },
      { label: 'Project Impact Clarity', value: 84, color: '#74c0fc' },
      { label: 'Role Keyword Match', value: 86, color: '#51cf66' },
      { label: 'Formatting Consistency', value: 89, color: '#ffa94d' },
    ],
    pipeline: [
      { label: 'Resume score scan', date: 'Completed', status: 'done' },
      { label: 'SDE template refinement', date: 'Today', status: 'in-progress' },
      { label: 'Behavioral bullets rewrite', date: 'Tomorrow', status: 'scheduled' },
      { label: 'Final recruiter checklist', date: 'Mar 18', status: 'pending' },
    ],
    activities: [
      { title: 'Added quantified internship outcomes', meta: '4 impact bullets added', time: '1h ago' },
      { title: 'Switched to ATS-friendly one-page layout', meta: 'Score +6 points', time: 'Yesterday' },
      { title: 'Aligned skill keywords with JD', meta: 'Backend + full-stack', time: 'Yesterday' },
    ],
    heatSeed: 7,
  },
  experience: {
    readiness: 78,
    stageProgress: { completed: 4, total: 6, label: 'Experience Analysis Coverage' },
    coverage: [
      { label: 'Service Companies', value: 81, color: '#6c63ff' },
      { label: 'Product Companies', value: 74, color: '#74c0fc' },
      { label: 'Round Pattern Mapping', value: 77, color: '#51cf66' },
      { label: 'FAQ Preparedness', value: 72, color: '#ffa94d' },
    ],
    pipeline: [
      { label: 'Analyze Zoho round pattern', date: 'Today', status: 'in-progress' },
      { label: 'Map TCS Digital process', date: 'Tomorrow', status: 'scheduled' },
      { label: 'Compile Cognizant FAQ', date: 'Mar 19', status: 'pending' },
      { label: 'Summarize Amazon intern rounds', date: 'Mar 21', status: 'pending' },
    ],
    activities: [
      { title: 'Reviewed 9 latest interview reports', meta: 'Backend and analyst roles', time: '3h ago' },
      { title: 'Tagged repeated HR prompts', meta: '17 commonly repeated', time: 'Today' },
      { title: 'Noted round duration trends', meta: 'Avg 35-40 mins', time: 'Yesterday' },
    ],
    heatSeed: 8,
  },
  performance: {
    readiness: 80,
    stageProgress: { completed: 5, total: 8, label: 'Performance Improvement Cycle' },
    coverage: [
      { label: 'Mock Scores', value: 81, color: '#6c63ff' },
      { label: 'Answer Accuracy', value: 76, color: '#74c0fc' },
      { label: 'Communication Quality', value: 82, color: '#51cf66' },
      { label: 'Weak Topic Recovery', value: 67, color: '#ffa94d' },
    ],
    pipeline: [
      { label: 'Graph topic weak-area sprint', date: 'Today', status: 'in-progress' },
      { label: 'Communication rehearsal', date: 'Tomorrow', status: 'scheduled' },
      { label: 'SQL timed revision', date: 'Mar 20', status: 'pending' },
      { label: 'Panel-style mock review', date: 'Mar 22', status: 'pending' },
    ],
    activities: [
      { title: 'Coding speed improved by 12%', meta: 'Compared to last month', time: '2h ago' },
      { title: 'Detected recurring graph mistakes', meta: '3 pattern clusters', time: 'Today' },
      { title: 'Communication score increased', meta: '7.5 -> 8.2', time: 'Yesterday' },
    ],
    heatSeed: 9,
  },
  resources: {
    readiness: 75,
    stageProgress: { completed: 9, total: 15, label: 'Resource Utilization' },
    coverage: [
      { label: 'Prep Notes Coverage', value: 83, color: '#6c63ff' },
      { label: 'Video Completion', value: 68, color: '#74c0fc' },
      { label: 'Coding Links Practice', value: 72, color: '#51cf66' },
      { label: 'Aptitude Packs', value: 65, color: '#ffa94d' },
    ],
    pipeline: [
      { label: 'DBMS crash notes', date: 'Today', status: 'in-progress' },
      { label: 'HR STAR playlist', date: 'Tomorrow', status: 'scheduled' },
      { label: 'Blind 75 set continuation', date: 'Mar 19', status: 'pending' },
      { label: 'Aptitude speed sprint', date: 'Mar 21', status: 'pending' },
    ],
    activities: [
      { title: 'Saved 12 high-priority links', meta: 'System design + DSA', time: '1h ago' },
      { title: 'Completed 2 interview videos', meta: 'DBMS and OS', time: 'Today' },
      { title: 'Finished aptitude timed pack', meta: 'Score: 29/35', time: 'Yesterday' },
    ],
    heatSeed: 5,
  },
  readiness: {
    readiness: 83,
    stageProgress: { completed: 6, total: 8, label: 'Final Readiness Milestones' },
    coverage: [
      { label: 'Topic Confidence', value: 80, color: '#6c63ff' },
      { label: 'Mock Stability', value: 78, color: '#74c0fc' },
      { label: 'Coding Completion', value: 74, color: '#51cf66' },
      { label: 'Behavioral Readiness', value: 86, color: '#ffa94d' },
    ],
    pipeline: [
      { label: 'Final technical mock', date: 'Tomorrow', status: 'scheduled' },
      { label: 'Resume final pass', date: 'Mar 18', status: 'pending' },
      { label: 'HR confidence rehearsal', date: 'Mar 19', status: 'pending' },
      { label: 'Final readiness review', date: 'Mar 21', status: 'pending' },
    ],
    activities: [
      { title: 'Readiness score moved to 83%', meta: 'From 79% last week', time: 'Today' },
      { title: 'DSA confidence improved', meta: 'After graph revision sprint', time: 'Yesterday' },
      { title: 'Aptitude practice target set', meta: '2 timed sets per day', time: 'Yesterday' },
    ],
    heatSeed: 4,
  },
  notifications: {
    readiness: 79,
    stageProgress: { completed: 11, total: 16, label: 'Alert Action Coverage' },
    coverage: [
      { label: 'Interview Reminders', value: 92, color: '#6c63ff' },
      { label: 'Mock Alerts Follow-up', value: 77, color: '#74c0fc' },
      { label: 'Practice Task Completion', value: 69, color: '#51cf66' },
      { label: 'Critical Alert Response', value: 85, color: '#ffa94d' },
    ],
    pipeline: [
      { label: 'Freshworks reminder', date: '48h left', status: 'upcoming' },
      { label: 'HR mock alert', date: 'Today 6:30 PM', status: 'scheduled' },
      { label: 'Practice task nudge', date: 'Tonight', status: 'pending' },
      { label: 'Resume update alert', date: 'Tomorrow', status: 'pending' },
    ],
    activities: [
      { title: 'Marked 4 alerts as completed', meta: 'Interview and prep tasks', time: '45m ago' },
      { title: 'Rescheduled one mock reminder', meta: 'Moved to weekend slot', time: 'Today' },
      { title: 'Opened critical interview alert', meta: 'Action required by EOD', time: 'Today' },
    ],
    heatSeed: 6,
  },
};
