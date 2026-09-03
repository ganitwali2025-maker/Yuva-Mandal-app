import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { calculateTotals, getRecentActivities } from '../utils/helpers';
import BalanceCard from '../components/cards/BalanceCard';
import ActivityRow from '../components/cards/ActivityRow';
import ServiceIcon from '../components/cards/ServiceIcon';
import BottomNav from '../components/layout/BottomNav';

export default function Home() {
  const { db, settings } = useApp();
  const totals = calculateTotals(db);
  const recent = getRecentActivities(db, 5);
  const navigate = useNavigate();

  return (
    <div className="app">
      <div className="header">
        <div className="header-top">
          <div className="brand">
            <div className="brand-mark">🚩</div>
            <div className="brand-name">
              {settings.mandalName}
              <span>{settings.village}</span>
            </div>
          </div>
        </div>
        <div className="greet">
          <h1>नमस्ते, साथियों 👋</h1>
        </div>
      </div>

      <BalanceCard
        balance={totals.balance}
        income={totals.income}
        expense={totals.expense}
        memberCount={db.members.length}
      />

      <div className="content">
        <div className="section-title">
          <h2>त्वरित सेवाएं</h2>
        </div>
        <div className="services-grid">
          <ServiceIcon page="members" icon="☺" color="#F5811F" label="सदस्य सूची" />
          <ServiceIcon page="add-member" icon="＋" color="#463CC9" label="नया सदस्य" />
          <ServiceIcon page="mashik-jama" icon="₹" color="#16A870" label="मासिक जमा" />
          <ServiceIcon page="sahyog" icon="🤝" color="#8B7CF6" label="सहयोग/दान" />
          <ServiceIcon page="expense" icon="－" color="#E24C4B" label="खर्च दर्ज" />
          <ServiceIcon page="udhar-chanda" icon="📒" color="#FF9800" label="उधार चंदा" />
          <ServiceIcon page="reports" icon="▤" color="#0EA5A5" label="रिपोर्ट शीट" />
          <ServiceIcon page="idcard-self" icon="🪪" color="#151966" label="मेरा कार्ड" />

        </div>

        <div className="section-title">
          <h2>हाल की गतिविधि</h2>
          <a onClick={() => navigate('/reports')} style={{ cursor: 'pointer' }}>
            सभी देखें
          </a>
        </div>

        {recent.length === 0 ? (
          <div className="empty">
            <div className="e-ic">🗂️</div>
            अभी कोई एंट्री नहीं है
            <br />
            नीचे से जमा या खर्च जोड़ें
          </div>
        ) : (
          <div className="card-list">
            {recent.map((r, idx) => (
              <ActivityRow key={idx} activity={r} />
            ))}
          </div>
        )}
      </div>

      <BottomNav active="home" />
    </div>
  );
}
