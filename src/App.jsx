import { useState, useEffect } from "react";

export default function App() {
  const [notes, setNotes] = useState(
    localStorage.getItem("notes") || ""
  );

  const [summary, setSummary] = useState("");
  const [questions, setQuestions] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    localStorage.setItem("notes", notes);
  }, [notes]);

  const summarize = () => {
    const words = notes.split(" ");
    setSummary(words.slice(0, 50).join(" ") + "...");
  };

  const generateQuiz = () => {
    const sentences = notes
      .split(".")
      .filter((s) => s.trim().length > 10)
      .slice(0, 5);

    setQuestions(
      sentences.map(
        (s, i) => `${i + 1}. Explain: ${s.trim()}?`
      )
    );
  };

  const generateFlashcards = () => {
    const cards = notes
      .split(".")
      .filter((s) => s.trim().length > 10)
      .slice(0, 5)
      .map((s, i) => ({
        question: `Flashcard ${i + 1}`,
        answer: s.trim(),
      }));

    setFlashcards(cards);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: dark ? "#111827" : "#f3f4f6",
        color: dark ? "#ffffff" : "#111827",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <h1>📚 AI Study Assistant</h1>

        <button
          onClick={() => setDark(!dark)}
          style={buttonStyle}
        >
          {dark ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>

        <br />
        <br />

        <textarea
          rows={12}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Paste your notes here..."
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "12px",
            border: "1px solid #555",
            fontSize: "16px",
          }}
        />

        <br />
        <br />

        <button
          onClick={summarize}
          style={buttonStyle}
        >
          📝 Summarize
        </button>

        <button
          onClick={generateQuiz}
          style={buttonStyle}
        >
          ❓ Generate Quiz
        </button>

        <button
          onClick={generateFlashcards}
          style={buttonStyle}
        >
          🎴 Flashcards
        </button>

        <div style={cardStyle}>
          <h2>📝 Summary</h2>
          <p>{summary}</p>
        </div>

        <div style={cardStyle}>
          <h2>❓ Quiz Questions</h2>

          {questions.length === 0 ? (
            <p>No questions yet.</p>
          ) : (
            questions.map((q, index) => (
              <p key={index}>{q}</p>
            ))
          )}
        </div>

        <div style={cardStyle}>
          <h2>🎴 Flashcards</h2>

          {flashcards.length === 0 ? (
            <p>No flashcards yet.</p>
          ) : (
            flashcards.map((card, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #666",
                  borderRadius: "10px",
                  padding: "12px",
                  marginBottom: "10px",
                }}
              >
                <strong>{card.question}</strong>
                <p>{card.answer}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: "10px 18px",
  marginRight: "10px",
  marginBottom: "10px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "15px",
};

const cardStyle = {
  marginTop: "20px",
  padding: "20px",
  borderRadius: "12px",
  background: "rgba(255,255,255,0.05)",
};