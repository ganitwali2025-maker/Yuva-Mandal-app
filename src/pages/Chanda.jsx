import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateTotals, todayStr } from '../utils/helpers';
import PageHeader from '../components/layout/PageHeader';
import BottomNav from '../components/layout/BottomNav';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import { fmt } from '../utils/helpers';

export default function Chanda() {
  const { db, settings, addRow, showToast } = useApp();
  const totals = calculateTotals(db);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    member: '',
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    amount: settings.monthlyChandaAmt,
    date: todayStr(),
    mode: 'Cash',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.member) {
      showToast('सदस्य चुनें');
      return;
    }

    const member = db.members.find((m) => String(m.ID) === String(form.member));
    setLoading(true);
    await addRow('chanda', {
      MemberID: form.member,
      MemberName: member ? member.Name : '',
      Month: ['जनवरी','फ़रवरी','मार्च','अप्रैल','मई','जून','जुलाई','अगस्त','सितंबर','अक्टूबर','नवंबर','दिसंबर'][form.month],
      Year: form.year,
      Amount: form.amount,
      Date: form.date,
      Mode: form.mode,
    });
    showToast('चंदा दर्ज हो गया ✅');
    setLoading(false);
  };

  return (
    <div className="app">
      <PageHeader title="मासिक चंदा" subtitle="Monthly Contribution" backTo="/" />

      <div className="content" style={{ paddingTop: '14px' }}>
        <div className="settings-box" style={{ margin: '0 0 16px' }}>
          <h3>कुल चंदा संग्रह</h3>
          <p
            style={{
              marginBottom: 0,
              color: 'var(--green)',
              fontFamily: 'Poppins',
              fontWeight: 800,
              fontSize: '22px',
            }}
          >
            {fmt(totals.chandaTotal)}
          </p>
        </div>

        <h3 style={{ fontSize: '13.5px', marginBottom: '10px' }}>नई एंट्री जोड़ें</h3>

        <form onSubmit={handleSubmit}>
          <Select
            label="सदस्य चुनें"
            id="c_member"
            value={form.member}
            onChange={(e) => setForm({ ...form, member: e.target.value })}
            options={[
              { label: '-- सदस्य चुनें --', value: '' },
              ...db.members.map((m) => ({
                label: `${m.Name} (ID ${m.ID})`,
                value: m.ID,
              })),
            ]}
          />

          <div style={{ display: 'flex', gap: '10px' }}>
            <Select
              label="महीना"
              id="c_month"
              value={form.month}
              onChange={(e) => setForm({ ...form, month: Number(e.target.value) })}
              options={[
                { label: 'जनवरी', value: 0 },
                { label: 'फ़रवरी', value: 1 },
                { label: 'मार्च', value: 2 },
                { label: 'अप्रैल', value: 3 },
                { label: 'मई', value: 4 },
                { label: 'जून', value: 5 },
                { label: 'जुलाई', value: 6 },
                { label: 'अगस्त', value: 7 },
                { label: 'सितंबर', value: 8 },
                { label: 'अक्टूबर', value: 9 },
                { label: 'नवंबर', value: 10 },
                { label: 'दिसंबर', value: 11 },
              ]}
            />
            <Input
              label="वर्ष"
              id="c_year"
              type="number"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
            />
          </div>

          <Input
            label="राशि (₹)"
            id="c_amount"
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />

          <Input
            label="तारीख"
            id="c_date"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />

          <Select
            label="माध्यम"
            id="c_mode"
            value={form.mode}
            onChange={(e) => setForm({ ...form, mode: e.target.value })}
            options={[
              { label: 'Cash', value: 'Cash' },
              { label: 'UPI', value: 'UPI' },
              { label: 'Bank Transfer', value: 'Bank Transfer' },
            ]}
          />

          <Button disabled={loading}>{loading ? 'सेव हो रहा है...' : 'चंदा दर्ज करें'}</Button>
        </form>

        <div className="section-title">
          <h2>हाल की एंट्री</h2>
        </div>

        {db.chanda.length === 0 ? (
          <div className="empty">कोई एंट्री नहीं</div>
        ) : (
          <div className="card-list">
            {[...db.chanda]
              .reverse()
              .slice(0, 15)
              .map((r, idx) => (
                <div key={idx} className="row-card">
                  <div className="avatar">{r.MemberName?.charAt(0) || '?'}</div>
                  <div className="row-main">
                    <div className="t1">{r.MemberName}</div>
                    <div className="t2">
                      {r.Month} {r.Year} · {r.Mode || ''}
                    </div>
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
