import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

export default function MainContent() {
  const [workouts, setWorkouts] = useState([]);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0,10),
    exercise: '',
    weight: '',
    reps: '',
    sets: ''
  });

  const fetchWorkouts = async () => {
    const res = await fetch(`${API_URL}/api/workouts`);
    const data = await res.json();
    setWorkouts(data);
  };

  useEffect(() => { fetchWorkouts(); }, []);

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const addWorkout = async e => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/api/workouts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      setForm({ ...form, exercise: '', weight: '', reps: '', sets: '' });
      fetchWorkouts();
    }
  };

  const del = async id => {
    await fetch(`${API_URL}/api/workouts/${id}`, { method: 'DELETE' });
    fetchWorkouts();
  };

  return (
    <main className="main-content">
      <h2 style={{ color: 'white' }}>Dashboard</h2>

      <form onSubmit={addWorkout} className="workout-form">
        <input name="date" type="date" value={form.date} onChange={onChange}/>
        <input name="exercise" placeholder="種目" value={form.exercise} onChange={onChange}/>
        <input name="weight" placeholder="重量(kg)" value={form.weight} onChange={onChange}/>
        <input name="reps" placeholder="回数" value={form.reps} onChange={onChange}/>
        <input name="sets" placeholder="セット数" value={form.sets} onChange={onChange}/>
        <button type="submit">追加</button>
      </form>

      <ul className="workout-list">
        {workouts.map(w => (
          <li key={w.id} className="workout-item">
            <div>
              <strong>{w.exercise}</strong><br />
              {w.date} / {w.weight}kg × {w.reps}回 × {w.sets}セット
            </div>
            <button onClick={() => del(w.id)}>削除</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
