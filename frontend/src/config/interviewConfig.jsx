import {
  FiCalendar,
  FiBarChart2,
  FiBookOpen,
  FiClock,
  FiTarget,
  FiTrendingUp,
  FiCheckCircle,
  FiUsers,
  FiLayers,
  FiBookmark,
} from 'react-icons/fi';

export const INTERVIEW_MODULES = {
  dashboard: {
    title: 'Interview Dashboard',
    description: 'Central overview of the student\'s interview preparation status with readiness levels, upcoming mock interviews, and suggested focus areas.',
    contentTags: [
      'Interview readiness at a glance',
      'Upcoming interview activities',
      'Skill balance radar + score trend',
      'Weak areas and recommended actions',
    ],
    metrics: [
      { label: 'Coding readiness', value: '82%', sub: 'DSA + problem solving', trend: { direction: 'up', text: '+6% this week' }, color: '#6c63ff', icon: FiBarChart2 },
      { label: 'Aptitude readiness', value: '74%', sub: 'Speed + accuracy', trend: { direction: 'down', text: '-2% this week' }, color: '#74c0fc', icon: FiTrendingUp },
      { label: 'Core subjects prep', value: '76%', sub: 'OS / DBMS / CN', trend: { direction: 'up', text: '+4% this week' }, color: '#51cf66', icon: FiBookOpen },
      { label: 'HR readiness', value: '68%', sub: 'Storytelling clarity', trend: { direction: 'up', text: '+3% this week' }, color: '#ffa94d', icon: FiUsers },
    ],
    cards: [
      {
        title: 'Preparation Insights',
        sections: [
          {
            title: 'Weak Topics',
            items: [
              'Dynamic Programming accuracy: 55%',
              'Networking protocols: TCP vs UDP troubleshooting confusion',
              'Behavioral responses need concise STAR endings',
              'System design cache invalidation trade-offs need revision',
            ],
          },
          {
            title: 'Achievements',
            items: [
              '64 interview questions solved',
              '3 mock interviews completed this week',
              '5 core subject modules revised (OS, DBMS, CN)',
            ],
          },
        ],
      },
      {
        title: 'Recommended Actions',
        items: [
          'Solve 5 Dynamic Programming problems focused on state transitions',
          'Review TCP vs UDP scenarios and create a quick comparison sheet',
          'Practice 2 HR behavioral answers with crisp STAR endings',
          'Run one timed system design drill on caching and scaling',
        ],
      },
      {
        title: 'Interview Practice Streak',
        type: 'streak',
        items: [
          'Current streak: 6 days',
          'Longest streak: 14 days',
          'Complete today\'s practice tasks to extend streak',
        ],
      },
    ],
  },
  practice: {
    title: 'Interview Practice',
    description: 'Structured hub to rehearse coding, system design, core CS, aptitude, and HR interviews with simulations and tracking.',
    contentTags: [
      'Coding + DSA drills',
      'System design practice',
      'Core CS refresh',
      'Aptitude + verbal sprints',
      'HR storytelling',
      'Mock interview simulations',
    ],
    metrics: [
      { label: 'Coding practice', value: '218 / 420', sub: 'Topic-wise problems', trend: { direction: 'up', text: '+14 this week' }, color: '#6c63ff', icon: FiCheckCircle },
      { label: 'System design drills', value: '12 / 24', sub: 'Blueprinted cases', color: '#74c0fc', icon: FiLayers },
      { label: 'Aptitude accuracy', value: '82%', sub: 'Timed quiz average', trend: { direction: 'up', text: '+3% vs last week' }, color: '#51cf66', icon: FiTarget },
      { label: 'HR practice sets', value: '28', sub: 'Recorded & reviewed', color: '#ffa94d', icon: FiUsers },
    ],
    cards: [
      {
        title: 'Coding Interview Practice',
        sections: [
          {
            title: 'Topic-wise practice',
            items: [
              'Arrays — Problems: 42 | Solved: 28 | Completion: 67%',
              'Strings — Problems: 36 | Solved: 19 | Completion: 53%',
              'Linked Lists — Problems: 24 | Solved: 15 | Completion: 63%',
              'Stacks & Queues — Problems: 20 | Solved: 13 | Completion: 65%',
              'Trees & Binary Trees — Problems: 34 | Solved: 18 | Completion: 53%',
              'Graph Algorithms — Problems: 26 | Solved: 11 | Completion: 42%',
              'Dynamic Programming — Problems: 45 | Solved: 18 | Completion: 40%',
              'Greedy Algorithms — Problems: 18 | Solved: 10 | Completion: 56%',
            ],
          },
          {
            title: 'Difficulty sets',
            items: [
              'Easy: 32 / 50 solved (64%) — warm-up speed rounds',
              'Medium: 58 / 92 solved (63%) — common interview mix',
              'Hard: 24 / 48 solved (50%) — 45-minute drills',
            ],
          },
          {
            title: 'Company sets',
            items: [
              'Amazon: 28 questions · DP + Strings · 46% complete',
              'Google: 26 questions · Graphs + Trees · 38% complete',
              'Microsoft: 22 questions · Arrays + Bitmask · 55% complete',
              'TCS: 18 questions · Aptitude + SQL mix · 68% complete',
              'Infosys: 16 questions · DS fundamentals · 72% complete',
            ],
          },
        ],
      },
      {
        title: 'System Design Practice',
        sections: [
          {
            title: 'Foundations',
            items: [
              'Load balancing strategies and failure handling',
              'Caching patterns with invalidation and TTL choices',
              'Database sharding + replication trade-offs',
              'API design principles with versioning and rate limits',
            ],
          },
          {
            title: 'Hands-on design drills',
            items: [
              'Design a URL shortener - capacity + datastore choices',
              'Design a messaging system - queues, fanout, retries',
              'Design online file storage - chunking + metadata',
              'Design a ride-sharing app - dispatch, surge, ETA service',
            ],
          },
          {
            title: 'Deliverables',
            items: [
              'Problem description and constraints',
              'Design components with call flows',
              'Example architecture diagram with bottlenecks highlighted',
              'Key discussion points and trade-off talking tracks',
            ],
          },
        ],
      },
      {
        title: 'Core Computer Science Practice',
        sections: [
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
        ],
      },
      {
        title: 'Aptitude Practice',
        sections: [
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
        ],
      },
      {
        title: 'HR and Behavioral Interview Practice',
        sections: [
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
        ],
      },
      {
        title: 'Interview Simulation Practice',
        sections: [
          {
            title: 'Simulation types',
            items: [
              'Technical interview simulation',
              'Coding interview simulation with in-browser editor',
              'HR interview simulation with timers',
            ],
          },
          {
            title: 'Session format',
            items: [
              'Question appears -> student answers -> timer runs -> feedback provided',
              'Rubrics: problem solving, clarity, confidence',
              'Option to pause and add reviewer notes',
            ],
          },
          {
            title: 'Example session',
            items: [
              'Mock Technical Interview - 30 mins - 5 questions',
              'Evaluation summary: algorithms depth, communication, composure',
            ],
          },
        ],
      },
      {
        title: 'Practice Progress Tracking',
        sections: [
          {
            title: 'Metrics tracked',
            items: [
              'Coding problems solved, attempted, bookmarked',
              'System design exercises completed with diagrams',
              'HR practice responses reviewed and scored',
              'Timed aptitude tests completed with accuracy',
            ],
          },
          {
            title: 'Progress snapshot',
            items: [
              'Coding Practice: 65% | System Design: 40%',
              'Core Subjects: 55% | HR Interview: 35%',
              'Daily streak: 6 days | Longest: 14 days',
            ],
          },
        ],
      },
      {
        title: 'Personalized Practice Recommendations',
        items: [
          'Solve 5 Dynamic Programming problems today',
          'Review database indexing concepts',
          'Practice answering HR behavioral questions',
          'Add one system design diagram to your notes',
        ],
      },
    ],
  },
  'question-bank': {
    title: 'Interview Question Bank',
    description: 'Categorized collection of commonly asked interview questions with search, filtering, and progress tracking.',
    contentTags: [
      'Search and filter questions',
      'Detailed question pages',
      'Question progress tracking',
      'Company and interview-type tagging',
    ],
    metrics: [
      { label: 'Question library', value: '1,450', sub: 'Across 9 domains', color: '#6c63ff', icon: FiBookOpen },
      { label: 'Solved', value: '820', sub: '57% overall', color: '#51cf66', icon: FiCheckCircle },
      { label: 'Attempted', value: '1,120', sub: '77% coverage', color: '#74c0fc', icon: FiTrendingUp },
      { label: 'Bookmarked', value: '140', sub: 'Marked for revision', color: '#ffa94d', icon: FiBookmark },
    ],
    cards: [
      {
        title: 'Question Categories',
        items: [
          'Data Structures and Algorithms',
          'System Design',
          'Operating Systems',
          'Database Management Systems',
          'Computer Networks',
          'Object-Oriented Programming',
          'HR and Behavioral questions',
          'Aptitude questions',
        ],
      },
      {
        title: 'Question Detail Page',
        items: [
          'Problem description with sample input and output',
          'Difficulty level, topic tags, and companies where it was asked',
          'Suggested approach plus alternate solution strategies',
          'Time complexity and space complexity analysis',
          'Optional video explanation and annotated solutions',
        ],
      },
      {
        title: 'Question Progress Tracking',
        items: [
          'Track solved, attempted, bookmarked, and revision-marked questions',
          'Filter by difficulty (Easy, Medium, Hard) and company tags',
          'Saved views per interview type (coding, HR, system design)',
          'Popularity badge highlights frequently asked questions',
        ],
      },
    ],
  },
  'mock-interview': {
    title: 'Mock Interview',
    description: 'Simulates a real interview environment with timers, sequential questions, recording, and automated feedback.',
    contentTags: [
      'Technical, coding, HR, and mixed simulations',
      'Interview timer and question flow',
      'Recording and review',
      'Automated scoring and feedback',
    ],
    metrics: [
      { label: 'Mocks scheduled', value: '6', sub: 'This week', color: '#6c63ff', icon: FiCalendar },
      { label: 'Mocks completed', value: '34', sub: 'Average score 82%', color: '#51cf66', icon: FiCheckCircle },
      { label: 'Coding completion', value: '72%', sub: 'Within allotted time', color: '#ffa94d', icon: FiClock },
      { label: 'Confidence gain', value: '+18%', sub: 'vs first attempt', color: '#74c0fc', icon: FiTrendingUp },
    ],
    cards: [
      {
        title: 'Interview Type Selection',
        items: [
          'Technical interview',
          'Coding interview',
          'HR interview',
          'Mixed interview simulation',
        ],
      },
      {
        title: 'Interview Simulation Environment',
        items: [
          'Global interview timer with warning prompts',
          'Sequential question presentation panel',
          'Answer submission interface for HR and technical prompts',
          'Integrated code editor for coding questions',
        ],
      },
      {
        title: 'Interview Recording and Review',
        items: [
          'Optional audio recording for HR responses',
          'Written explanation submissions',
          'Coding solution submission with runs',
        ],
      },
      {
        title: 'Automated Interview Feedback',
        items: [
          'Scores on problem solving, clarity, and technical correctness',
          'Communication effectiveness rating',
          'Final interview score with improvement pointers',
        ],
      },
    ],
  },
  'practice-topics': {
    title: 'Interview Practice Topics',
    description: 'Structured learning modules for Data Structures, Algorithms, System Design, Core CS, and HR preparation.',
    contentTags: [
      'Topic categories',
      'Topic progress tracking',
      'Topic learning resources',
    ],
    metrics: [
      { label: 'Topic modules', value: '64', sub: 'Guided plans', color: '#6c63ff', icon: FiLayers },
      { label: 'Completed', value: '39', sub: '61% done', color: '#51cf66', icon: FiCheckCircle },
      { label: 'Questions completed', value: '420', sub: 'Of 680 planned', color: '#74c0fc', icon: FiBarChart2 },
      { label: 'Pending hard topics', value: '11', sub: 'High impact', color: '#ffa94d', icon: FiTarget },
    ],
    cards: [
      {
        title: 'Topic Categories',
        items: [
          'Data Structures',
          'Algorithms',
          'System Design',
          'Core Computer Science subjects',
          'HR preparation',
        ],
      },
      {
        title: 'Topic Progress Tracking',
        items: [
          'Questions completed vs total per topic',
          'Completion percentage on every topic card',
          'Highlights remaining hard questions',
          'Tracks practice hours logged per topic',
        ],
      },
      {
        title: 'Topic Learning Resources',
        items: [
          'Concept explanations and summaries',
          'Example interview questions',
          'Practice exercises',
          'Reference materials and cheat sheets',
        ],
      },
    ],
  },
  'resume-prep': {
    title: 'Resume Preparation',
    description: 'Helps students build ATS-friendly resumes with templates, scoring, and targeted suggestions.',
    contentTags: [
      'Resume builder',
      'ATS-friendly templates',
      'Resume analysis and suggestions',
    ],
    metrics: [
      { label: 'Resume completeness', value: '86/100', sub: 'ATS + recruiter fit', color: '#6c63ff', icon: FiBarChart2 },
      { label: 'Keyword match', value: '88%', sub: 'Role alignment', color: '#51cf66', icon: FiTarget },
      { label: 'Templates available', value: '7', sub: 'Role-specific', color: '#74c0fc', icon: FiBookOpen },
      { label: 'Last updated', value: '2 days ago', sub: 'SDE intern version', color: '#ffa94d', icon: FiClock },
    ],
    cards: [
      {
        title: 'Resume Builder',
        items: [
          'Capture personal info, education, technical skills, projects, internships, certifications, achievements',
          'Auto-generate a formatted resume from the collected data',
        ],
      },
      {
        title: 'Resume Templates',
        items: [
          'Software engineering template',
          'Data science template',
          'Internship template',
          'All templates are ATS-friendly and role-tuned',
        ],
      },
      {
        title: 'Resume Analysis',
        items: [
          'Resume completeness score and keyword optimization checks',
          'Section coverage alerts for missing or weak areas',
          'Suggestions: add measurable achievements, improve project descriptions, align keywords to the job description',
        ],
      },
    ],
  },
  experience: {
    title: 'Interview Experience',
    description: 'Real interview experiences shared by candidates with company patterns, round breakdowns, and questions asked.',
    contentTags: [
      'Company-wise experiences',
      'Interview process breakdown',
      'Questions asked',
      'Difficulty level ratings',
    ],
    metrics: [
      { label: 'Experience reports', value: '312', sub: 'Community + curated', color: '#6c63ff', icon: FiBookOpen },
      { label: 'Companies covered', value: '58', sub: 'Product and service', color: '#51cf66', icon: FiUsers },
      { label: 'Avg difficulty', value: 'Moderate', sub: 'User-rated', color: '#ffa94d', icon: FiTarget },
      { label: 'Rounds mapped', value: '4.2', sub: 'Avg stages / company', color: '#74c0fc', icon: FiBarChart2 },
    ],
    cards: [
      {
        title: 'Interview Process Breakdown',
        items: [
          'Online assessment',
          'Technical interview rounds',
          'System design interview',
          'HR interview',
        ],
      },
      {
        title: 'Questions Asked',
        items: [
          'Design LRU cache with O(1) operations',
          'Explain process vs thread with real examples',
          'How would you optimize a slow SQL query?',
          'Tell me about a conflict in your team and resolution approach',
          'System design: URL shortener basics',
        ],
      },
      {
        title: 'Difficulty Level',
        items: [
          'Easy',
          'Moderate',
          'Difficult - rate each experience to guide peers',
        ],
      },
    ],
  },
  performance: {
    title: 'Interview Performance Tracker',
    description: 'Monitors interview preparation performance, analytics, and strengths versus weaknesses over time.',
    contentTags: [
      'Practice performance metrics',
      'Performance analytics',
      'Strengths and weaknesses',
    ],
    metrics: [
      { label: 'Questions solved', value: '542', sub: 'Last 90 days', color: '#6c63ff', icon: FiCheckCircle },
      { label: 'Mock interviews', value: '43', sub: 'Completed', color: '#51cf66', icon: FiUsers },
      { label: 'Success rate', value: '76%', sub: 'Across coding + HR', color: '#74c0fc', icon: FiTrendingUp },
      { label: 'Accuracy', value: '78%', sub: 'Last 30 days', color: '#ffa94d', icon: FiBarChart2 },
    ],
    cards: [
      {
        title: 'Strengths',
        items: [
          'Arrays and sorting algorithms',
          'Clear communication in HR rounds',
          'SQL query optimization',
        ],
      },
      {
        title: 'Weaknesses',
        items: [
          'Dynamic programming under time pressure',
          'Graph edge-case coverage',
          'Networking protocol troubleshooting',
        ],
      },
      {
        title: 'Performance Analytics',
        items: [
          'Weekly coding performance trend',
          'Accuracy rate improvement tracking',
          'Topic-wise success rates across major domains',
        ],
      },
    ],
  },
  readiness: {
    title: 'Readiness Indicator',
    description: 'Evaluates how prepared a student is for real interviews with category scores and improvement suggestions.',
    contentTags: [
      'Preparation scores',
      'Overall interview readiness score',
      'Improvement suggestions',
    ],
    metrics: [
      { label: 'Coding readiness score', value: '83%', sub: 'Stable performance', color: '#6c63ff', icon: FiCheckCircle },
      { label: 'Core subjects readiness', value: '79%', sub: 'OS/DBMS/CN', color: '#51cf66', icon: FiBookOpen },
      { label: 'Aptitude readiness', value: '74%', sub: 'Speed focus', color: '#74c0fc', icon: FiTrendingUp },
      { label: 'HR readiness', value: '86%', sub: 'Story depth', color: '#ffa94d', icon: FiUsers },
    ],
    cards: [
      {
        title: 'Improvement Suggestions',
        items: [
          'Practice more dynamic programming problems',
          'Review database indexing concepts',
          'Improve behavioral interview responses with crisp STAR endings',
          'Increase timed aptitude sets to 2 per day',
        ],
      },
      {
        title: 'Final Action Plan',
        items: [
          '2 technical mock interviews this week',
          '1 HR mock with detailed feedback',
          'Daily 90-minute coding streak',
          'Resume pass with quantified impact points',
        ],
      },
    ],
  },
};

export const WINDOW_OPTIONS = ['7D', '30D', '90D'];
export const WINDOW_MULTIPLIER = { '7D': 0.9, '30D': 1, '90D': 1.08 };

export const MODULE_VISUALS = {
  dashboard: {
    readinessTitle: 'Placement Readiness Meter',
    coverageTitle: 'Preparation Progress Overview',
    pipelineTitle: 'Upcoming Interview Activities',
    activityTitle: 'Daily Interview Practice Tasks',
    readiness: 78,
    stageProgress: {
      completed: 3,
      total: 4,
      label: 'Readiness milestones',
      milestones: ['Beginner', 'Intermediate', 'Advanced', 'Interview Ready'],
      basedOn: ['Coding practice', 'Mock interview scores', 'Topic coverage'],
    },
    coverage: [
      { label: 'Data Structures & Algorithms', value: 79, color: '#6c63ff' },
      { label: 'System Design fundamentals', value: 62, color: '#74c0fc' },
      { label: 'Core CS subjects', value: 76, color: '#51cf66' },
      { label: 'HR & Behavioral', value: 68, color: '#ffa94d' },
    ],
    progressModes: {
      completion: {
        label: 'Topic completion',
        description: 'Completion percentage by preparation stream',
        data: [
          { label: 'DSA Practice', value: 79, color: '#6c63ff', suffix: '%' },
          { label: 'System Design', value: 62, color: '#74c0fc', suffix: '%' },
          { label: 'Core CS Subjects', value: 76, color: '#51cf66', suffix: '%' },
          { label: 'HR Preparation', value: 68, color: '#ffa94d', suffix: '%' },
        ],
      },
      questions: {
        label: 'Questions solved',
        description: 'Solved questions against weekly plan',
        data: [
          { label: 'DSA Practice', value: 72, color: '#6c63ff', suffix: '/100' },
          { label: 'System Design', value: 48, color: '#74c0fc', suffix: '/80' },
          { label: 'Core CS Subjects', value: 58, color: '#51cf66', suffix: '/90' },
          { label: 'HR Preparation', value: 36, color: '#ffa94d', suffix: '/60' },
        ],
      },
      mocks: {
        label: 'Mock completion',
        description: 'Mock interview completion against monthly target',
        data: [
          { label: 'Technical mocks', value: 80, color: '#6c63ff', suffix: '%' },
          { label: 'HR mocks', value: 60, color: '#74c0fc', suffix: '%' },
          { label: 'Mixed mocks', value: 70, color: '#51cf66', suffix: '%' },
          { label: 'Peer feedback cycles', value: 50, color: '#ffa94d', suffix: '%' },
        ],
      },
    },
    radar: {
      labels: ['Coding', 'System Design', 'Core Subjects', 'Aptitude', 'HR Communication'],
      values: [82, 62, 76, 74, 68],
    },
    scoreTrend: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
      values: [64, 69, 72, 75, 78],
    },
    pipeline: [
      { label: 'Mock interview - Technical (Algorithms)', date: 'Wed 10:00 AM', status: 'scheduled', actionLabel: 'Join Interview' },
      { label: 'HR mock conversation', date: 'Thu 06:30 PM', status: 'upcoming', actionLabel: 'Join Interview' },
      { label: 'Technical practice sprint', date: 'Fri 07:30 PM', status: 'pending', actionLabel: 'Start Practice' },
      { label: 'Resume review deadline', date: 'Sun 05:00 PM', status: 'pending', actionLabel: 'Start Practice' },
    ],
    activities: [
      { title: 'Solve 3 coding questions', meta: 'Focus: DP and Graphs', time: 'Due today' },
      { title: 'Review system design primer', meta: 'Caching and load balancers', time: '1h planned' },
      { title: 'Practice STAR stories', meta: 'Leadership + conflict examples', time: 'Completed 1/2' },
      { title: 'Revise DBMS indexing', meta: 'B-tree vs Hash', time: 'Scheduled tonight' },
    ],
    timeline: [
      {
        day: 'Today',
        items: [
          'Solved 3 coding questions',
          'Reviewed DBMS indexing',
        ],
      },
      {
        day: 'Yesterday',
        items: [
          'Completed mock interview',
          'Practiced HR responses',
        ],
      },
    ],
  },
  practice: {
    readinessTitle: 'Practice Momentum',
    coverageTitle: 'Practice Coverage by Track',
    pipelineTitle: 'Upcoming Practice Tasks',
    activityTitle: 'Latest Practice Activity',
    readiness: 76,
    stageProgress: { completed: 5, total: 8, label: 'Practice milestones' },
    coverage: [
      { label: 'Coding interview', value: 65, color: '#6c63ff' },
      { label: 'System design', value: 48, color: '#74c0fc' },
      { label: 'Core CS', value: 55, color: '#51cf66' },
      { label: 'Aptitude', value: 62, color: '#ffa94d' },
      { label: 'HR and behavioral', value: 44, color: '#f783ac' },
    ],
    pipeline: [
      { label: 'DP practice set (5 Q, timer ON)', date: 'Due today', status: 'in-progress' },
      { label: 'System design: URL shortener diagram', date: 'Tonight 09:00 PM', status: 'scheduled' },
      { label: 'Timed aptitude quiz (20 questions)', date: 'Tomorrow', status: 'scheduled' },
      { label: 'HR mock: leadership story recording', date: 'Fri', status: 'pending' },
    ],
    activities: [
      { title: 'Completed arrays + strings pack', meta: '6/8 correct, 92% accuracy', time: '1h ago' },
      { title: 'Uploaded caching strategy notes', meta: 'Added invalidation checklist', time: 'Today' },
      { title: 'Recorded HR answer: conflict resolution', meta: 'Feedback +0.4 clarity', time: 'Yesterday' },
    ],
  },
  'question-bank': {
    readinessTitle: 'Question Bank Health',
    coverageTitle: 'Coverage by Domain',
    pipelineTitle: 'Search and Filtering Presets',
    activityTitle: 'Recent Question Activity',
    readiness: 74,
    stageProgress: { completed: 4, total: 6, label: 'Question bank coverage' },
    coverage: [
      { label: 'DSA questions', value: 81, color: '#6c63ff' },
      { label: 'System Design', value: 64, color: '#74c0fc' },
      { label: 'Core CS', value: 72, color: '#51cf66' },
      { label: 'HR and Aptitude', value: 69, color: '#ffa94d' },
    ],
    pipeline: [
      { label: 'Filter: Dynamic Programming - Medium/Hard', date: 'Saved filter', status: 'in-progress' },
      { label: 'Company: Amazon + Google top set', date: 'Company view', status: 'scheduled' },
      { label: 'Interview type: HR/Behavioral', date: 'Daily warm-up', status: 'upcoming' },
      { label: 'Popularity: Top 50 last 30 days', date: 'Auto-refresh', status: 'pending' },
    ],
    activities: [
      { title: 'Added 12 new system design prompts', meta: 'Caching, rate limiting, messaging', time: '2h ago' },
      { title: 'Updated company tags', meta: 'TCS Digital, Cognizant, Zoho', time: 'Today' },
      { title: 'Revision queue refreshed', meta: '15 bookmarked questions', time: 'Yesterday' },
    ],
  },
  'mock-interview': {
    readinessTitle: 'Mock Interview Readiness',
    coverageTitle: 'Readiness by Interview Type',
    pipelineTitle: 'Scheduled Mock Sessions',
    activityTitle: 'Recording and Feedback',
    readiness: 84,
    stageProgress: { completed: 5, total: 7, label: 'Mock cycle progress' },
    coverage: [
      { label: 'Technical round', value: 82, color: '#6c63ff' },
      { label: 'Coding simulation', value: 75, color: '#74c0fc' },
      { label: 'HR round', value: 88, color: '#51cf66' },
      { label: 'Mixed simulation', value: 79, color: '#ffa94d' },
    ],
    pipeline: [
      { label: 'Technical interview simulation', date: 'Today 07:00 PM', status: 'scheduled' },
      { label: 'HR panel practice', date: 'Tomorrow 06:30 PM', status: 'scheduled' },
      { label: 'Coding drill (2 medium + 1 hard)', date: 'Fri 08:00 PM', status: 'upcoming' },
      { label: 'Mixed panel review', date: 'Sat 05:30 PM', status: 'pending' },
    ],
    activities: [
      { title: 'Audio recording saved', meta: 'HR prompt set B', time: '1h ago' },
      { title: 'Feedback posted', meta: 'Edge cases for graph traversal', time: 'Today' },
      { title: 'Code editor replay', meta: 'Binary search optimization', time: 'Yesterday' },
    ],
  },
  'practice-topics': {
    readinessTitle: 'Topic Readiness Pulse',
    coverageTitle: 'Topic Coverage',
    pipelineTitle: 'Upcoming Topic Plan',
    activityTitle: 'Latest Topic Activity',
    readiness: 73,
    stageProgress: { completed: 8, total: 14, label: 'Topic sprint progress' },
    coverage: [
      { label: 'Data Structures', value: 79, color: '#6c63ff' },
      { label: 'Algorithms', value: 74, color: '#74c0fc' },
      { label: 'System Design basics', value: 64, color: '#ffa94d' },
      { label: 'Core CS and HR', value: 71, color: '#51cf66' },
    ],
    pipeline: [
      { label: 'Graph patterns revision', date: 'Today', status: 'in-progress' },
      { label: 'DBMS indexing drill', date: 'Tomorrow', status: 'scheduled' },
      { label: 'OS process sync session', date: 'Fri', status: 'pending' },
      { label: 'HR story practice', date: 'Sat', status: 'pending' },
    ],
    activities: [
      { title: 'Completed sliding-window problem set', meta: '8 medium questions', time: '2h ago' },
      { title: 'Watched system design primer', meta: '45 mins', time: 'Today' },
      { title: 'Logged HR practice', meta: '3 STAR stories rehearsed', time: 'Yesterday' },
    ],
  },
  'resume-prep': {
    readinessTitle: 'Resume Scorecard',
    coverageTitle: 'Resume Coverage',
    pipelineTitle: 'Resume Builder Timeline',
    activityTitle: 'Latest Resume Analysis',
    readiness: 88,
    stageProgress: { completed: 6, total: 7, label: 'Resume optimization pipeline' },
    coverage: [
      { label: 'ATS compatibility', value: 91, color: '#6c63ff' },
      { label: 'Project impact clarity', value: 84, color: '#74c0fc' },
      { label: 'Keyword relevance', value: 86, color: '#51cf66' },
      { label: 'Formatting consistency', value: 89, color: '#ffa94d' },
    ],
    pipeline: [
      { label: 'Resume score scan', date: 'Completed', status: 'done' },
      { label: 'Template selection and fill', date: 'Today', status: 'in-progress' },
      { label: 'Bullet rewriting with metrics', date: 'Tomorrow', status: 'scheduled' },
      { label: 'Final recruiter checklist', date: 'Sun', status: 'pending' },
    ],
    activities: [
      { title: 'Added quantified internship outcomes', meta: '4 impact bullets added', time: '1h ago' },
      { title: 'Aligned keywords with backend role', meta: 'Matched to JD', time: 'Today' },
      { title: 'Switched to ATS-friendly layout', meta: 'Score +6 points', time: 'Yesterday' },
    ],
  },
  experience: {
    readinessTitle: 'Experience Coverage',
    coverageTitle: 'Round Coverage',
    pipelineTitle: 'Company-wise Experiences',
    activityTitle: 'Latest Experience Notes',
    readiness: 78,
    stageProgress: { completed: 4, total: 6, label: 'Experience analysis coverage' },
    coverage: [
      { label: 'Service companies', value: 81, color: '#6c63ff' },
      { label: 'Product companies', value: 74, color: '#74c0fc' },
      { label: 'Round pattern mapping', value: 77, color: '#51cf66' },
      { label: 'FAQ preparedness', value: 72, color: '#ffa94d' },
    ],
    pipeline: [
      { label: 'Amazon interview experience', date: 'New: today', status: 'in-progress' },
      { label: 'Google SDE intern experience', date: 'Updated', status: 'scheduled' },
      { label: 'TCS Digital experience', date: 'Queued', status: 'pending' },
      { label: 'Freshworks product analyst', date: 'Queued', status: 'pending' },
    ],
    activities: [
      { title: 'Reviewed latest interview reports', meta: 'Backend and analyst roles', time: '3h ago' },
      { title: 'Tagged repeated HR prompts', meta: '17 common questions', time: 'Today' },
      { title: 'Noted round duration trends', meta: 'Avg 35-40 mins', time: 'Yesterday' },
    ],
  },
  performance: {
    readinessTitle: 'Performance Momentum',
    coverageTitle: 'Performance Analytics',
    pipelineTitle: 'Performance Plan',
    activityTitle: 'Recent Performance Updates',
    readiness: 80,
    stageProgress: { completed: 5, total: 8, label: 'Improvement cycle' },
    coverage: [
      { label: 'Coding performance', value: 81, color: '#6c63ff' },
      { label: 'Mock consistency', value: 78, color: '#74c0fc' },
      { label: 'Communication quality', value: 82, color: '#51cf66' },
      { label: 'Weak topic recovery', value: 67, color: '#ffa94d' },
    ],
    pipeline: [
      { label: 'Graph weak-area sprint', date: 'Today', status: 'in-progress' },
      { label: 'Communication rehearsal', date: 'Tomorrow', status: 'scheduled' },
      { label: 'SQL timed revision', date: 'Fri', status: 'pending' },
      { label: 'Panel-style mock review', date: 'Sun', status: 'pending' },
    ],
    activities: [
      { title: 'Coding speed improved by 12%', meta: 'vs last month', time: '2h ago' },
      { title: 'Detected recurring graph mistakes', meta: '3 pattern clusters', time: 'Today' },
      { title: 'Communication score increased', meta: '7.5 -> 8.2', time: 'Yesterday' },
    ],
  },
  readiness: {
    readinessTitle: 'Overall Interview Readiness',
    coverageTitle: 'Readiness Breakdown',
    pipelineTitle: 'Readiness Roadmap',
    activityTitle: 'Latest Readiness Updates',
    readiness: 82,
    stageProgress: { completed: 6, total: 8, label: 'Readiness milestones' },
    coverage: [
      { label: 'Topic confidence', value: 80, color: '#6c63ff' },
      { label: 'Mock stability', value: 78, color: '#74c0fc' },
      { label: 'Coding completion', value: 74, color: '#51cf66' },
      { label: 'Behavioral readiness', value: 86, color: '#ffa94d' },
    ],
    pipeline: [
      { label: 'Final technical mock', date: 'Tomorrow', status: 'scheduled' },
      { label: 'Resume final pass', date: 'Sun', status: 'pending' },
      { label: 'HR confidence rehearsal', date: 'Mon', status: 'pending' },
      { label: 'Final readiness review', date: 'Wed', status: 'pending' },
    ],
    activities: [
      { title: 'Readiness score moved to 82%', meta: 'From 79% last week', time: 'Today' },
      { title: 'DSA confidence improved', meta: 'After graph revision sprint', time: 'Yesterday' },
      { title: 'Aptitude practice target set', meta: '2 timed sets per day', time: 'Yesterday' },
    ],
  },
};
