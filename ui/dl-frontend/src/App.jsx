import { useState, useRef } from "react";
import "./App.css";
import Emoji from "./assets/emoji.png";

function App() {
  const [prompt, setPrompt]   = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const outputRef = useRef(null);

  const scrollToBottom = () => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setMessages(prev => [
      ...prev,
      { sender: "Patient", text: prompt }
    ]);
    setPrompt("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const reader  = res.body.getReader();
      const decoder = new TextDecoder();

      setMessages(prev => [
        ...prev,
        { sender: "Therapist", text: "" }
      ]);

      let assistantText = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages(prev => {
          const next = [...prev];
          next[next.length - 1].text = assistantText;
          return next;
        });
        scrollToBottom();
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { sender: "Therapist", text: `[error] ${err.message}` }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
    <div className="center">

      <div className="titleRow">
        <img src={Emoji} alt="Thera-PT logo" className="logo" />
      </div>
      <h1 className="title">TheraPT</h1>
      <div className="outputWindow" ref={outputRef}>
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.sender.toLowerCase()}`}>
            <strong>{m.sender}:</strong> {m.text}
          </div>
        ))}
        {!messages.length && <div>&nbsp;</div>}
      </div>

      <textarea
        className="promptInput"
        rows={4}
        placeholder="What's on your mind right now?"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button
        className="submitBtn"
        disabled={loading}
        onClick={handleGenerate}
      >
        {loading ? "Generating…" : "Submit"}
      </button>
    </div>
  </main>

  );
}

export default App;
