import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const API_URL = "https://muscle-tracker.onrender.com";

export default function Graph() {
  const [data, setData] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState("ベンチプレス");

  useEffect(() => {
    fetch(`${API_URL}/api/workouts`)
      .then((res) => res.json())
      .then((rows) => {
        // グラフ用にデータ整形
        const formatted = rows.map((r) => ({
          date: r.date,
          exercise: r.exercise,
          weight: r.weight,
          volume: r.weight * r.reps * r.sets,
        }));

        // 🧮 同じ日＋種目ごとにまとめて集計
        const aggregated = Object.values(
          formatted.reduce((acc, cur) => {
            const key = `${cur.date}-${cur.exercise}`;
            if (!acc[key]) {
              acc[key] = {
                date: cur.date,
                exercise: cur.exercise,
                totalVolume: cur.volume,
                totalWeight: cur.weight * cur.sets,
                totalSets: cur.sets,
              };
            } else {
              acc[key].totalVolume += cur.volume;
              acc[key].totalWeight += cur.weight * cur.sets;
              acc[key].totalSets += cur.sets;
            }
            return acc;
          }, {})
        ).map((v) => ({
          date: v.date,
          exercise: v.exercise,
          volume: v.totalVolume,
          avgWeight: Math.round(v.totalWeight / v.totalSets),
        }));

        setData(aggregated);
      })
      .catch((err) => console.error("データ取得失敗:", err));
  }, []);

  const filtered = data.filter((d) => d.exercise === selectedExercise);
  const exerciseList = Array.from(new Set(data.map((d) => d.exercise)));

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h2>📈 {selectedExercise} の推移</h2>

      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="exercise-select">種目を選択：</label>
        <select
          id="exercise-select"
          value={selectedExercise}
          onChange={(e) => setSelectedExercise(e.target.value)}
          style={{
            marginLeft: "10px",
            padding: "5px 10px",
            borderRadius: "5px",
            backgroundColor: "#222",
            color: "white",
            border: "1px solid #555",
          }}
        >
          {exerciseList.length === 0 ? (
            <option>データなし</option>
          ) : (
            exerciseList.map((ex, i) => (
              <option key={i} value={ex}>
                {ex}
              </option>
            ))
          )}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p>この種目のデータがまだありません。</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={filtered}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="date" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="avgWeight"
              stroke="#dfa896"
              name="平均重量(kg)"
              strokeWidth={3}
            />
            <Line
              type="monotone"
              dataKey="volume"
              stroke="#b17ece"
              name="総ボリューム"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
