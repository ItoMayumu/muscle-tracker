export default function SidebarLeft() {
  return (
    <aside className="sidebar">
      <h2 style={{ color: 'white' }}>🏋️‍♀️ Muscle Tracker</h2>
      <div style={{ marginTop: '20px' }}>
        <button style={{ width: '100%' }}>Dashboard</button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <p style={{ color: '#888', fontSize: '0.9rem' }}>Menu</p>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
          <li><a href="#" className="nav-link">Reports</a></li>
          <li><a href="#" className="nav-link">Messages</a></li>
          <li><a href="#" className="nav-link">Settings</a></li>
        </ul>
      </div>
    </aside>
  );
}
