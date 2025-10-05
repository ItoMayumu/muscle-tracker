import { useState } from "react";
import "./style.css";
import Graph from "./components/Graph";

const API_URL = "https://muscle-tracker.onrender.com";

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

  // ✨ RenderのAPIにデータを送信する修正版
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const newWorkout = {
      date: new Date().toISOString().split("T")[0],
      exercise: activeExercise,
      weight: parseFloat(form[0].value),
      reps: parseInt(form[1].value),
      sets: parseInt(form[2].value),
    };

    try {
      const res = await fetch(`${API_URL}/api/workouts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWorkout),
      });

      if (res.ok) {
        const data = await res.json();
        alert(`${data.exercise}（${data.weight}kg × ${data.reps}回 × ${data.sets}セット）を記録しました！`);
        closeForm();
      } else {
        const err = await res.json();
        alert("保存に失敗しました: " + (err.error || "不明なエラー"));
      }
    } catch (err) {
      alert("サーバーに接続できませんでした");
      console.error(err);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>💪 筋トレ管理</h1>
      </header>

      <main>
        {/* ホーム（種目グリッド） */}
        {activeTab === "home" && (
          <div className="exercise-grid">
            {exercises.map((name, i) => (
              <button key={i} className="exercise-card" onClick={() => openForm(name)}>
                {name}
              </button>
            ))}
          </div>
        )}

        {/* 記録ページ（グラフ） */}
        {activeTab === "history" && (
          <div>
            <Graph />
          </div>
        )}

        {/* 設定ページ */}
        {activeTab === "settings" && (
          <div className="placeholder">
            <p>⚙️ 設定メニュー（テーマなど）</p>
          </div>
        )}
      </main>

      {/* フッター（タブ切り替え） */}
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

      {/* 入力フォーム（ポップアップ） */}
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
