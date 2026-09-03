import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateTotals, todayStr } from '../utils/helpers';
import PageHeader from '../components/layout/PageHeader';
import BottomNav from '../components/layout/BottomNav';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import { fmt } from '../utils/helpers';

export default function MashikJama() {
  const { db, settings, addRow, showToast } = useApp();
  const totals = calculateTotals(db);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    member: '',
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    amount: settings.monthlyMashikJamaAmt,
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
    await addRow('mashikJama', {
      'सदस्य का नाम': member ? member.Name : '',
      'फोन नंबर': member ? member.Mobile : '',
      'पद': member ? member.Pad : '',
      'माह': ['जनवरी','फ़रवरी','मार्च','अप्रैल','मई','जून','जुलाई','अगस्त','सितंबर','अक्टूबर','नवंबर','दिसंबर'][form.month],
      'राशि (₹)': form.amount,
      'दिनांक': form.date,
      'भुगतान माध्यम': form.mode,
      'एंट्री दिनांक': new Date().toLocaleDateString('en-GB'),
      'एंट्री समय': new Date().toLocaleTimeString('en-US', { hour12: true })
    });
    showToast('जमा दर्ज हो गया ✅');
    setLoading(false);
  };

  return (
    <div className="app">
      <PageHeader title="मासिक जमा" subtitle="Monthly Deposit" backTo="/" />

      <div className="content" style={{ paddingTop: '14px' }}>
        <div className="settings-box" style={{ margin: '0 0 16px' }}>
          <h3>कुल मासिक जमा</h3>
          <p
            style={{
              marginBottom: 0,
              color: 'var(--green)',
              fontFamily: 'Poppins',
              fontWeight: 800,
              fontSize: '22px',
            }}
          >
            {fmt(totals.mashikJamaTotal)}
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

          <div className="field">
            <label>भुगतान माध्यम</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['Cash', 'UPI', 'Bank Transfer'].map(m => (
                <div
                  key={m}
                  onClick={() => setForm({ ...form, mode: m })}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '10px 5px',
                    borderRadius: '8px',
                    border: form.mode === m ? '2px solid var(--primary)' : '1px solid #ccc',
                    background: form.mode === m ? 'var(--primary-light)' : '#fff',
                    color: form.mode === m ? 'var(--primary)' : '#555',
                    fontWeight: form.mode === m ? '600' : '400',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  {m}
                </div>
              ))}
            </div>
          </div>

          <Button disabled={loading}>{loading ? 'सेव हो रहा है...' : 'जमा दर्ज करें'}</Button>
        </form>

        <div className="section-title">
          <h2>हाल की एंट्री</h2>
        </div>

        {db.mashikJama.length === 0 ? (
          <div className="empty">कोई एंट्री नहीं</div>
        ) : (
          <div className="card-list">
            {[...db.mashikJama]
              .reverse()
              .slice(0, 15)
              .map((r, idx) => (
                <div key={idx} className="row-card">
                  <div className="avatar">{r['सदस्य का नाम']?.charAt(0) || '?'}</div>
                  <div className="row-main">
                    <div className="t1">{r['सदस्य का नाम']}</div>
                    <div className="t2">
                      {r['माह']} · {r['भुगतान माध्यम'] || ''}
                    </div>
                  </div>
                  <div className="row-amt in">+{fmt(r['राशि (₹)'])}</div>
                </div>
              ))}
          </div>
        )}
      </div>

      <BottomNav active="mashik-jama" />
    </div>
  );
}
