import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { initials } from '../utils/helpers';
import PageHeader from '../components/layout/PageHeader';
import BottomNav from '../components/layout/BottomNav';
import Button from '../components/ui/Button';

export default function Members() {
  const { db } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const list = db.members.filter(
    (m) =>
      !query ||
      (m.Name || '').toLowerCase().includes(query.toLowerCase()) ||
      String(m.ID).includes(query)
  );

  return (
    <div className="app">
      <PageHeader title="सदस्य सूची" subtitle={`${db.members.length} कुल सदस्य`} backTo="/" />

      <div className="search-bar">
        <span>🔍</span>
        <input
          placeholder="नाम या ID से खोजें..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="content" style={{ paddingTop: '6px' }}>
        {list.length === 0 ? (
          <div className="empty">
            <div className="e-ic">👥</div>
            अभी कोई सदस्य नहीं जुड़ा
            <br />
            <br />
            <Button onClick={() => navigate('/add-member')}>+ सदस्य जोड़ें</Button>
          </div>
        ) : (
          <div className="card-list">
            {list.map((m) => (
              <div
                key={m.ID}
                className="row-card"
                onClick={() => navigate(`/idcard/${m.ID}`)}
              >
                <div className="avatar">{initials(m.Name)}</div>
                <div className="row-main">
                  <div className="t1">{m.Name}</div>
                  <div className="t2">
                    ID: {m.ID} · {m.Mobile || '-'}
                  </div>
                </div>
                <div style={{ color: 'var(--muted)', fontSize: '16px' }}>›</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button className="fab" onClick={() => navigate('/add-member')}>
        ＋
      </button>

      <BottomNav active="members" />
    </div>
  );
}
