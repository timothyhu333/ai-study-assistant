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

  const [editingIndex, setEditingIndex] =
    useState(null);

  const [editText, setEditText] =
    useState("");

  const [streak, setStreak] = useState(
    Number(localStorage.getItem("streak")) || 1
  );

  const [bestStreak, setBestStreak] =
    useState(
      Number(
        localStorage.getItem("bestStreak")
      ) || 1
    );

  const dailyGoal = 1000;

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

  useEffect(() => {
    const today = new Date().toDateString();

    const lastVisit =
      localStorage.getItem("lastVisit");

    if (!lastVisit) {
      localStorage.setItem(
        "lastVisit",
        today
      );
      return;
    }

    if (lastVisit !== today) {
      const yesterday = new Date();

      yesterday.setDate(
        yesterday.getDate() - 1
      );

      let currentStreak = streak;

      if (
        lastVisit === yesterday.toDateString()
      ) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }

      setStreak(currentStreak);

      localStorage.setItem(
        "streak",
        currentStreak
      );

      if (currentStreak > bestStreak) {
        setBestStreak(currentStreak);

        localStorage.setItem(
          "bestStreak",
          currentStreak
        );
      }

      localStorage.setItem(
        "lastVisit",
        today
      );
    }
  }, []);

  const summarize = () => {
    const words = notes.split(" ");

    setSummary(
      words.slice(0, 50).join(" ") + "..."
    );
  };

  const generateQuiz = () => {
    const sentences = notes
      .split(".")
      .filter((s) => s.trim().length > 10)
      .slice(0, 5);

    setQuestions(
      sentences.map(
        (s, i) =>
          `${i + 1}. Explain: ${s.trim()}?`
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

  const startEditTask = (index) => {
    setEditingIndex(index);
    setEditText(tasks[index].text);
  };

  const saveEditedTask = () => {
    const updated = [...tasks];

    updated[editingIndex].text = editText;

    setTasks(updated);

    setEditingIndex(null);
    setEditText("");
  };

  const clearNotes = () => {
    setNotes("");
    setSummary("");
    setQuestions([]);
    setFlashcards([]);
  };

  const downloadNotes = () => {
    const element =
      document.createElement("a");

    const file = new Blob([notes], {
      type: "text/plain",
    });

    element.href =
      URL.createObjectURL(file);

    element.download =
      "study-notes.txt";

    document.body.appendChild(element);
    element.click();
  };

  const wordCount = notes.trim()
    ? notes.trim().split(/\s+/).length
    : 0;

  const characterCount = notes.length;

  const readingTime = Math.max(
    1,
    Math.ceil(wordCount / 200)
  );

  const completedTasks =
    tasks.filter((t) => t.completed)
      .length;

  const goalProgress = Math.min(
    100,
    Math.round(
      (wordCount / dailyGoal) * 100
    )
  );

  const minutes = String(
    Math.floor(seconds / 60)
  ).padStart(2, "0");

  const secs = String(
    seconds % 60
  ).padStart(2, "0");

  const achievements = [];

  if (sessions >= 1)
    achievements.push(
      "🏅 First Study Session"
    );

  if (sessions >= 10)
    achievements.push(
      "🏅 10 Study Sessions"
    );

  if (completedTasks >= 1)
    achievements.push(
      "✅ First Task Completed"
    );

  if (completedTasks >= 10)
    achievements.push(
      "✅ Task Champion"
    );

  if (wordCount >= 500)
    achievements.push(
      "📚 500 Words Written"
    );

  if (wordCount >= 1000)
    achievements.push(
      "📚 1000 Words Written"
    );

  if (streak >= 3)
    achievements.push(
      "🔥 3 Day Streak"
    );

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
        <h1>📚 Study Assistant Ultimate</h1>

        <button
          style={buttonStyle}
          onClick={() =>
            setDark(!dark)
          }
        >
          {dark
            ? "☀ Light"
            : "🌙 Dark"}
        </button>

        <button
          style={buttonStyle}
          onClick={downloadNotes}
        >
          📄 Download Notes
        </button>

        <button
          style={buttonStyle}
          onClick={clearNotes}
        >
          🗑 Clear Notes
        </button>

        <textarea
          rows="10"
          value={notes}
          onChange={(e) =>
            setNotes(e.target.value)
          }
          placeholder="Paste notes..."
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "15px",
            borderRadius: "10px",
          }}
        />

        <div style={cardStyle}>
          <h2>📊 Dashboard</h2>

          <p>📚 Words: {wordCount}</p>
          <p>
            ✅ Completed Tasks:{" "}
            {completedTasks}
          </p>
          <p>
            ⏱ Sessions: {sessions}
          </p>
          <p>
            🔥 Streak: {streak}
          </p>
          <p>
            🏆 Best Streak:{" "}
            {bestStreak}
          </p>
        </div>

        <div style={cardStyle}>
          <h2>🎯 Daily Goal</h2>

          <div
            style={{
              width: "100%",
              background: "#333",
              height: "25px",
              borderRadius: "10px",
            }}
          >
            <div
              style={{
                width: `${goalProgress}%`,
                background: "#22c55e",
                height: "100%",
                borderRadius: "10px",
              }}
            />
          </div>

          <p>
            {goalProgress}% Complete
          </p>
        </div>

        <div style={cardStyle}>
          <h2>🏆 Achievements</h2>

          {achievements.map((a, i) => (
            <p key={i}>{a}</p>
          ))}
        </div>

        <div style={cardStyle}>
          <h2>⏱ Study Timer</h2>

          <h1>
            {minutes}:{secs}
          </h1>

          <button
            style={buttonStyle}
            onClick={() =>
              setRunning(true)
            }
          >
            ▶ Start
          </button>

          <button
            style={buttonStyle}
            onClick={() =>
              setRunning(false)
            }
          >
            ⏸ Pause
          </button>

          <button
            style={buttonStyle}
            onClick={() => {
              setRunning(false);
              setSeconds(1500);
            }}
          >
            🔄 Reset
          </button>
        </div>

        <div style={cardStyle}>
          <h2>✅ Study Tasks</h2>

          <input
            value={task}
            onChange={(e) =>
              setTask(e.target.value)
            }
            placeholder="Add task..."
          />

          <button
            style={buttonStyle}
            onClick={addTask}
          >
            Add
          </button>

          {tasks.map((t, index) => (
            <div key={index}>
              {editingIndex === index ? (
                <>
                  <input
                    value={editText}
                    onChange={(e) =>
                      setEditText(
                        e.target.value
                      )
                    }
                  />

                  <button
                    style={buttonStyle}
                    onClick={
                      saveEditedTask
                    }
                  >
                    💾
                  </button>
                </>
              ) : (
                <>
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

                  <button
                    style={buttonStyle}
                    onClick={() =>
                      toggleTask(
                        index
                      )
                    }
                  >
                    ✔
                  </button>

                  <button
                    style={buttonStyle}
                    onClick={() =>
                      startEditTask(
                        index
                      )
                    }
                  >
                    ✏️
                  </button>

                  <button
                    style={buttonStyle}
                    onClick={() =>
                      deleteTask(
                        index
                      )
                    }
                  >
                    🗑
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}