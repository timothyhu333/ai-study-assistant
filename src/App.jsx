import { useState, useEffect } from "react";

const buttonStyle = {
  padding: "10px 18px",
  margin: "5px",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "15px",
  background: "#4f46e5",
  color: "white",
};

const cardStyle = {
  marginTop: "20px",
  padding: "20px",
  borderRadius: "15px",
  background: "rgba(255,255,255,0.08)",
};

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

  const clearNotes = () => {
    setNotes("");
    setSummary("");
    setQuestions([]);
    setFlashcards([]);
    localStorage.removeItem("notes");
  };

  const downloadNotes = () => {
    const element = document.createElement("a");

    const file = new Blob([notes], {
      type: "text/plain",
    });

    element.href = URL.createObjectURL(file);
    element.download = "study-notes.txt";
    document.body.appendChild(element);
    element.click();
  };

  const copySummary = () => {
    navigator.clipboard.writeText(summary);
    alert("Summary copied!");
  };

  const copyQuiz = () => {
    navigator.clipboard.writeText(
      questions.join("\n")
    );
    alert("Quiz copied!");
  };

  const copyFlashcards = () => {
    const content = flashcards
      .map(
        (card) =>
          `${card.question}\n${card.answer}`
      )
      .join("\n\n");

    navigator.clipboard.writeText(content);
    alert("Flashcards copied!");
  };

  const wordCount = notes.trim()
    ? notes.trim().split(/\s+/).length
    : 0;

  const characterCount = notes.length;

  const readingTime = Math.max(
    1,
    Math.ceil(wordCount / 200)
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: dark
          ? "linear-gradient(to bottom,#020617,#0f172a)"
          : "#f3f4f6",
        color: dark ? "white" : "#111",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: "60px",
          }}
        >
          📚 AI Study Assistant
        </h1>

        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => setDark(!dark)}
            style={buttonStyle}
          >
            {dark
              ? "☀ Light Mode"
              : "🌙 Dark Mode"}
          </button>

          <button
            onClick={clearNotes}
            style={buttonStyle}
          >
            🗑 Clear Notes
          </button>

          <button
            onClick={downloadNotes}
            style={buttonStyle}
          >
            📄 Download Notes
          </button>
        </div>

        <br />

        <textarea
          rows={12}
          value={notes}
          onChange={(e) =>
            setNotes(e.target.value)
          }
          placeholder="Paste your study notes here..."
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "15px",
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
          <h2>📊 Statistics</h2>

          <p>Words: {wordCount}</p>

          <p>
            Characters: {characterCount}
          </p>

          <p>
            Reading Time: {readingTime} min
          </p>
        </div>

        <div style={cardStyle}>
          <h2>📝 Summary</h2>

          <button
            onClick={copySummary}
            style={buttonStyle}
          >
            📋 Copy Summary
          </button>

          <p>{summary}</p>
        </div>

        <div style={cardStyle}>
          <h2>❓ Quiz Questions</h2>

          <button
            onClick={copyQuiz}
            style={buttonStyle}
          >
            📋 Copy Quiz
          </button>

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

          <button
            onClick={copyFlashcards}
            style={buttonStyle}
          >
            📋 Copy Flashcards
          </button>

          {flashcards.length === 0 ? (
            <p>No flashcards yet.</p>
          ) : (
            flashcards.map((card, index) => (
              <div
                key={index}
                style={{
                  border:
                    "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "10px",
                  padding: "12px",
                  marginBottom: "10px",
                }}
              >
                <strong>
                  {card.question}
                </strong>

                <p>{card.answer}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}