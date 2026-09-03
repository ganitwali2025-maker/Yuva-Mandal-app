import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function BottomNav({ active }) {
  const navigate = useNavigate();
  const { t } = useApp();

  const items = [
    { k: 'home', ic: '⌂', label: t('home') },
    { k: 'members', ic: '☺', label: t('members') },
    { k: 'mashik-jama', ic: '₹', label: t('mashikJama').split(' ')[0] },
    { k: 'reports', ic: '▤', label: t('reports') },
    { k: 'settings', ic: '⚙', label: t('settings') },
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
