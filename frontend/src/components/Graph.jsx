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

  useEffect(() => {
    fetch(`${API_URL}/api/workouts`)
      .then((res) => res.json())
      .then((rows) => {
        // グラフ用にデータ整形
        const formatted = rows.map((r) => ({
          date: r.date,
          weight: r.weight,
          volume: r.weight * r.reps * r.sets,
          exercise: r.exercise,
        }));
        setData(formatted);
      });
  }, []);

  // 表示する種目を絞る
  const filtered = data.filter((d) => d.exercise === "ベンチプレス");

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h2>📈 ベンチプレスの推移</h2>

      {filtered.length === 0 ? (
        <p>データがまだありません。</p>
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
              dataKey="weight"
              stroke="#dfa896"
              name="重量(kg)"
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
