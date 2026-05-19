// ============================================
// AIChatbox — Listening IELTS
// React hóa từ AI chatbox.js + AI chatbox.html cũ
// Giữ nguyên HTML/CSS class
// ============================================
import { useState, useRef, useEffect } from 'react';
import { aiService } from '../../services/aiService';

export default function AIChatbox() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello 👋 <br><br>Ask me:<br>• Grammar<br>• IELTS<br>• Vocabulary<br>• Speaking tips' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatBodyRef = useRef(null);

  // ── Auto-scroll ──
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  // ── Send message ──
  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: 'user', text }]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await aiService.chat(text);
      const reply = data.data?.reply || data.reply || data.message || 'No response';
      setMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    } catch {
      setMessages((prev) => [...prev, { sender: 'ai', text: '⚠️ Server Error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* CHAT TOGGLE BUTTON */}
      <div className="chat-toggle" onClick={() => setOpen(!open)}>
        <i className="fa-solid fa-robot"></i>
      </div>

      {/* CHAT BOX */}
      <div className="chat-container" id="chatContainer" style={{ display: open ? 'flex' : 'none' }}>
        {/* HEADER */}
        <div className="chat-header">
          <div className="chat-title">🤖 AI English Tutor</div>
          <button className="close-btn" onClick={() => setOpen(false)}>✖</button>
        </div>

        {/* CHAT BODY */}
        <div className="chat-body" id="chatBody" ref={chatBodyRef}>
          {messages.map((msg, i) => (
            <div className="message" key={i}>
              <div className={`avatar ${msg.sender === 'ai' ? 'ai' : 'user'}`}>
                {msg.sender === 'ai' ? 'AI' : 'U'}
              </div>
              <div className="text" dangerouslySetInnerHTML={{ __html: msg.text }} />
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="message">
              <div className="avatar ai">AI</div>
              <div className="text">Thinking...</div>
            </div>
          )}
        </div>

        {/* INPUT */}
        <div className="chat-input">
          <textarea
            id="userInput"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={sendMessage} disabled={loading}>
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </>
  );
}
