import { useState } from "react";
import "./style.css";
import Graph from "./components/Graph";

export default function App() {
  const [activeExercise, setActiveExercise] = useState(null);
  const [activeTab, setActiveTab] = useState("home");

  const exercises = [
    "ベンチプレス", "スクワット", "デッドリフト",
    "ショルダープレス", "ラットプルダウン", "アームカール",
    "レッグプレス", "カーフレイズ", "アブローラー"
  ];

  const openForm = (name) => setActiveExercise(name);
  const closeForm = () => setActiveExercise(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`${activeExercise}を記録しました！`);
    closeForm();
  };

  return (
    <div className="app-container">
      <header>
        <h1>💪 筋トレ管理</h1>
      </header>

      <main>
        {activeTab === "home" && (
          <div className="exercise-grid">
            {exercises.map((name, i) => (
              <button key={i} className="exercise-card" onClick={() => openForm(name)}>
                {name}
              </button>
            ))}
          </div>
        )}

        {activeTab === "history" && (
        <div>
          <Graph/>
        </div>
        )}

        {activeTab === "settings" && (
          <div className="placeholder">
            <p>⚙️ 設定メニュー（テーマなど）</p>
          </div>
        )}
      </main>

      {/* フッター */}
      <footer className="bottom-nav">
        <button
          className={activeTab === "home" ? "active" : ""}
          onClick={() => setActiveTab("home")}
        >
          🏠<br />ホーム
        </button>
        <button
          className={activeTab === "history" ? "active" : ""}
          onClick={() => setActiveTab("history")}
        >
          📋<br />記録
        </button>
        <button
          className={activeTab === "settings" ? "active" : ""}
          onClick={() => setActiveTab("settings")}
        >
          ⚙️<br />設定
        </button>
      </footer>

      {/* 入力フォーム */}
      {activeExercise && (
        <>
          <div className="overlay" onClick={closeForm}></div>
          <div className="popup-form">
            <h2>{activeExercise}</h2>
            <form onSubmit={handleSubmit}>
              <input type="number" placeholder="重量(kg)" required />
              <input type="number" placeholder="回数" required />
              <input type="number" placeholder="セット数" required />
              <button type="submit">記録する</button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
