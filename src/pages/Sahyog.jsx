import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateTotals, todayStr, fmt } from '../utils/helpers';
import PageHeader from '../components/layout/PageHeader';
import BottomNav from '../components/layout/BottomNav';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Sahyog() {
  const { db, addRow, showToast } = useApp();
  const totals = calculateTotals(db);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    donor: '',
    purpose: '',
    amount: '',
    date: todayStr(),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.donor || !form.amount) {
      showToast('नाम और राशि भरें');
      return;
    }

    setLoading(true);
    await addRow('sahyog', {
      DonorName: form.donor.trim(),
      Purpose: form.purpose.trim(),
      Amount: form.amount,
      Date: form.date,
    });
    showToast('सहयोग दर्ज हो गया ✅');
    setForm({ donor: '', purpose: '', amount: '', date: todayStr() });
    setLoading(false);
  };

  return (
    <div className="app">
      <PageHeader title="सहयोग / दान" subtitle="Sahyog & Donations" backTo="/" />

      <div className="content" style={{ paddingTop: '14px' }}>
        <div className="settings-box" style={{ margin: '0 0 16px' }}>
          <h3>कुल सहयोग राशि</h3>
          <p
            style={{
              marginBottom: 0,
              color: 'var(--green)',
              fontFamily: 'Poppins',
              fontWeight: 800,
              fontSize: '22px',
            }}
          >
            {fmt(totals.sahyogTotal)}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            label="दानदाता / सदस्य का नाम"
            id="s_donor"
            placeholder="नाम लिखें"
            value={form.donor}
            onChange={(e) => setForm({ ...form, donor: e.target.value })}
          />
          <Input
            label="उद्देश्य"
            id="s_purpose"
            placeholder="जैसे: होली कार्यक्रम, त्यौहार आदि"
            value={form.purpose}
            onChange={(e) => setForm({ ...form, purpose: e.target.value })}
          />
          <Input
            label="राशि (₹)"
            id="s_amount"
            type="number"
            placeholder="0"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <Input
            label="तारीख"
            id="s_date"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <Button disabled={loading}>{loading ? 'सेव हो रहा है...' : 'सहयोग दर्ज करें'}</Button>
        </form>

        <div className="section-title">
          <h2>हाल की एंट्री</h2>
        </div>

        {db.sahyog.length === 0 ? (
          <div className="empty">कोई एंट्री नहीं</div>
        ) : (
          <div className="card-list">
            {[...db.sahyog]
              .reverse()
              .slice(0, 15)
              .map((r, idx) => (
                <div key={idx} className="row-card">
                  <div className="avatar">{r.DonorName?.charAt(0) || '?'}</div>
                  <div className="row-main">
                    <div className="t1">{r.DonorName}</div>
                    <div className="t2">{r.Purpose || ''}</div>
                  </div>
                  <div className="row-amt in">+{fmt(r.Amount)}</div>
                </div>
              ))}
          </div>
        )}
      </div>

      <BottomNav active="chanda" />
    </div>
  );
}
