import { useState, useEffect } from "react";

const buttonStyle = {
  padding: "10px 15px",
  margin: "5px",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  background: "#4f46e5",
  color: "white",
  fontWeight: "bold",
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

  const [seconds, setSeconds] = useState(1500);
  const [running, setRunning] = useState(false);

  const [sessions, setSessions] = useState(
    Number(localStorage.getItem("sessions")) || 0
  );

  const [task, setTask] = useState("");

  const [tasks, setTasks] = useState(
    JSON.parse(localStorage.getItem("tasks")) || []
  );

  useEffect(() => {
    localStorage.setItem("notes", notes);
  }, [notes]);

  useEffect(() => {
    localStorage.setItem(
      "tasks",
      JSON.stringify(tasks)
    );
  }, [tasks]);

  useEffect(() => {
    let timer;

    if (running && seconds > 0) {
      timer = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    }

    if (seconds === 0) {
      setRunning(false);

      const newSessions = sessions + 1;

      setSessions(newSessions);

      localStorage.setItem(
        "sessions",
        newSessions
      );

      alert("🎉 Study Session Completed!");
    }

    return () => clearInterval(timer);
  }, [running, seconds, sessions]);

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

  const addTask = () => {
    if (!task.trim()) return;

    setTasks([
      ...tasks,
      {
        text: task,
        completed: false,
      },
    ]);

    setTask("");
  };

  const toggleTask = (index) => {
    const updated = [...tasks];

    updated[index].completed =
      !updated[index].completed;

    setTasks(updated);
  };

  const deleteTask = (index) => {
    setTasks(
      tasks.filter((_, i) => i !== index)
    );
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

  const minutes = String(
    Math.floor(seconds / 60)
  ).padStart(2, "0");

  const secs = String(
    seconds % 60
  ).padStart(2, "0");

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "30px",
        fontFamily: "Arial",
        background: dark
          ? "linear-gradient(to bottom,#020617,#0f172a)"
          : "#f1f5f9",
        color: dark ? "white" : "#111",
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
            fontSize: "50px",
          }}
        >
          📚 Study Assistant Pro
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
          rows="10"
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

        <div style={cardStyle}>
          <h2>⏱ Study Timer</h2>

          <h1>
            {minutes}:{secs}
          </h1>

          <button
            onClick={() => setRunning(true)}
            style={buttonStyle}
          >
            ▶ Start
          </button>

          <button
            onClick={() => setRunning(false)}
            style={buttonStyle}
          >
            ⏸ Pause
          </button>

          <button
            onClick={() => {
              setRunning(false);
              setSeconds(1500);
            }}
            style={buttonStyle}
          >
            🔄 Reset
          </button>

          <p>
            Completed Sessions: {sessions}
          </p>
        </div>

        <div style={cardStyle}>
          <h2>✅ Study Tasks</h2>

          <input
            value={task}
            onChange={(e) =>
              setTask(e.target.value)
            }
            placeholder="Add a study task..."
            style={{
              width: "70%",
              padding: "10px",
              borderRadius: "10px",
              marginRight: "10px",
            }}
          />

          <button
            onClick={addTask}
            style={buttonStyle}
          >
            Add
          </button>

          <br />
          <br />

          {tasks.map((t, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <span
                style={{
                  textDecoration:
                    t.completed
                      ? "line-through"
                      : "none",
                }}
              >
                {t.text}
              </span>

              <div>
                <button
                  onClick={() =>
                    toggleTask(index)
                  }
                  style={buttonStyle}
                >
                  ✔
                </button>

                <button
                  onClick={() =>
                    deleteTask(index)
                  }
                  style={buttonStyle}
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={cardStyle}>
          <h2>📊 Statistics</h2>

          <p>Words: {wordCount}</p>
          <p>Characters: {characterCount}</p>
          <p>
            Reading Time: {readingTime} min
          </p>
        </div>

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
            questions.map((q, i) => (
              <p key={i}>{q}</p>
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

          {flashcards.map((card, i) => (
            <div
              key={i}
              style={{
                border:
                  "1px solid rgba(255,255,255,0.2)",
                borderRadius: "10px",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <strong>
                {card.question}
              </strong>

              <p>{card.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}