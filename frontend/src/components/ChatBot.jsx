import { useState } from 'react';
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi';

const RESPONSES = {
  'study tips': 'Here are some effective study tips:\n\n1. 🎯 Use the Pomodoro Technique (25 min focus + 5 min break)\n2. 📝 Active recall > passive reading\n3. 🔄 Spaced repetition for long-term memory\n4. 🧠 Teach concepts to others\n5. 💤 Get 7-8 hours of sleep',
  'dsa': 'For DSA preparation:\n\n1. Start with Arrays & Strings\n2. Move to Linked Lists & Stacks\n3. Trees & Graphs\n4. Dynamic Programming\n5. Practice on LeetCode (aim for 3 problems/day)',
  'placement': 'Placement preparation roadmap:\n\n1. 📖 Complete DSA basics (2-3 months)\n2. 💻 Build 2-3 projects\n3. 📝 Aptitude practice daily\n4. 🗣️ Mock interviews weekly\n5. 📄 Resume & LinkedIn optimization',
  'aptitude': 'Aptitude preparation tips:\n\n1. Practice Number Systems & Percentages first\n2. Time & Work, Speed & Distance are frequent\n3. Logical Reasoning: Puzzles, Seating Arrangement\n4. Practice IndiaBix & PrepInsta daily\n5. Take timed tests to improve speed',
  'interview': 'Interview preparation:\n\n1. 🔧 Technical: DSA + System Design\n2. 💬 Behavioral: STAR method\n3. 🏢 Company research is critical\n4. 📝 Prepare "Tell me about yourself"\n5. ❓ Always have questions for interviewer',
  'default': "I'm your study assistant! Try asking about:\n\n• Study tips\n• DSA preparation\n• Placement prep\n• Aptitude practice\n• Interview tips\n\nType any of these topics to get started! 📚"
};

function getResponse(msg) {
  const lower = msg.toLowerCase();
  for (const [key, val] of Object.entries(RESPONSES)) {
    if (key !== 'default' && lower.includes(key)) return val;
  }
  return RESPONSES.default;
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hi! 👋 I'm your AI study assistant. Ask me anything about study tips, DSA, placements, or interview prep!" }
  ]);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    const userMsg = { from: 'user', text: input };
    const botMsg = { from: 'bot', text: getResponse(input) };
    setMessages(prev => [...prev, userMsg, botMsg]);
    setInput('');
  };

  return (
    <>
      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>🤖 AI Study Assistant</span>
            <button onClick={() => setOpen(false)}><FiX size={18} /></button>
          </div>
          <div className="chatbot-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.from}`}>
                <pre>{m.text}</pre>
              </div>
            ))}
          </div>
          <div className="chatbot-input">
            <input 
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask me anything..."
            />
            <button onClick={send}><FiSend size={16} /></button>
          </div>
        </div>
      )}
      <button className="chatbot-fab" onClick={() => setOpen(!open)}>
        {open ? <FiX size={24} /> : <FiMessageCircle size={24} />}
      </button>
    </>
  );
}
