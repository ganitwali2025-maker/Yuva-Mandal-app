import { useNavigate } from 'react-router-dom';

export default function BottomNav({ active }) {
  const navigate = useNavigate();

  const items = [
    { k: 'home', ic: '⌂', label: 'होम' },
    { k: 'members', ic: '☺', label: 'सदस्य' },
    { k: 'chanda', ic: '₹', label: 'चंदा' },
    { k: 'reports', ic: '▤', label: 'रिपोर्ट' },
    { k: 'settings', ic: '⚙', label: 'सेटिंग' },
  ];

  return (
    <div className="bottom-nav">
      {items.map((i) => (
        <button
          key={i.k}
          className={`nav-item ${active === i.k ? 'active' : ''}`}
          onClick={() => navigate('/' + (i.k === 'home' ? '' : i.k))}
        >
          <span className="nic">{i.ic}</span>
          <span>{i.label}</span>
        </button>
      ))}
    </div>
  );
}
