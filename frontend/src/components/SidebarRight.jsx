
export default function SidebarRight() {
  const notifications = [
    { title: "フォーム改善！", time: "10分前" },
    { title: "新しい種目を追加しました", time: "1時間前" },
    { title: "週次統計レポートが更新されました", time: "昨日" },
  ];

  return (
    <aside className="sidebar-right">
      <h3 style={{ color: 'white' }}>通知</h3>
      <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
        {notifications.map((n, i) => (
          <li key={i} style={{
            background: '#1b1c20',
            borderRadius: '8px',
            padding: '10px',
            marginBottom: '10px'
          }}>
            <div style={{ color: 'white', fontWeight: 600 }}>{n.title}</div>
            <div style={{ fontSize: '0.8rem', color: '#888' }}>{n.time}</div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
