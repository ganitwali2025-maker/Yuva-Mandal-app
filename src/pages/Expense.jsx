import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateTotals, todayStr, fmt } from '../utils/helpers';
import PageHeader from '../components/layout/PageHeader';
import BottomNav from '../components/layout/BottomNav';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';

export default function Expense() {
  const { db, addRow, showToast } = useApp();
  const totals = calculateTotals(db);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    category: 'कार्यक्रम',
    desc: '',
    amount: '',
    paidto: '',
    date: todayStr(),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount) {
      showToast('राशि भरें');
      return;
    }

    setLoading(true);
    await addRow('expense', {
      Category: form.category,
      Description: form.desc.trim(),
      Amount: form.amount,
      PaidTo: form.paidto.trim(),
      Date: form.date,
    });
    showToast('खर्च दर्ज हो गया ✅');
    setForm({ category: 'कार्यक्रम', desc: '', amount: '', paidto: '', date: todayStr() });
    setLoading(false);
  };

  return (
    <div className="app">
      <PageHeader title="खर्च दर्ज करें" subtitle="Expense Entry" backTo="/" />

      <div className="content" style={{ paddingTop: '14px' }}>
        <div className="settings-box" style={{ margin: '0 0 16px' }}>
          <h3>कुल खर्च</h3>
          <p
            style={{
              marginBottom: 0,
              color: 'var(--red)',
              fontFamily: 'Poppins',
              fontWeight: 800,
              fontSize: '22px',
            }}
          >
            {fmt(totals.expense)}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Select
            label="श्रेणी"
            id="e_category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            options={[
              { label: 'कार्यक्रम', value: 'कार्यक्रम' },
              { label: 'स्टेशनरी', value: 'स्टेशनरी' },
              { label: 'सजावट', value: 'सजावट' },
              { label: 'यात्रा', value: 'यात्रा' },
              { label: 'अन्य', value: 'अन्य' },
            ]}
          />
          <Input
            label="विवरण"
            id="e_desc"
            placeholder="खर्च का विवरण लिखें"
            value={form.desc}
            onChange={(e) => setForm({ ...form, desc: e.target.value })}
          />
          <Input
            label="राशि (₹)"
            id="e_amount"
            type="number"
            placeholder="0"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <Input
            label="किसे भुगतान किया"
            id="e_paidto"
            placeholder="नाम / दुकान"
            value={form.paidto}
            onChange={(e) => setForm({ ...form, paidto: e.target.value })}
          />
          <Input
            label="तारीख"
            id="e_date"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <Button disabled={loading}>{loading ? 'सेव हो रहा है...' : 'खर्च दर्ज करें'}</Button>
        </form>

        <div className="section-title">
          <h2>हाल के खर्च</h2>
        </div>

        {db.expense.length === 0 ? (
          <div className="empty">कोई एंट्री नहीं</div>
        ) : (
          <div className="card-list">
            {[...db.expense]
              .reverse()
              .slice(0, 15)
              .map((r, idx) => (
                <div key={idx} className="row-card">
                  <div className="avatar" style={{ background: 'var(--red-bg)', color: 'var(--red)' }}>
                    −
                  </div>
                  <div className="row-main">
                    <div className="t1">{r.Category}</div>
                    <div className="t2">{r.Description || ''}</div>
                  </div>
                  <div className="row-amt out">-{fmt(r.Amount)}</div>
                </div>
              ))}
          </div>
        )}
      </div>

      <BottomNav active="home" />
    </div>
  );
}
