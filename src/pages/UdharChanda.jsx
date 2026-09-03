import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { todayStr, fmt } from '../utils/helpers';
import PageHeader from '../components/layout/PageHeader';
import BottomNav from '../components/layout/BottomNav';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';

export default function UdharChanda() {
  const { db, addRow, showToast } = useApp();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    date: todayStr(),
    amount: '',
    paidStatus: 'Unpaid',
    paidDate: '',
    remark: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.amount) {
      showToast('नाम और राशि भरें');
      return;
    }

    setLoading(true);
    await addRow('udharChanda', {
      'Date': form.date,
      'Name': form.name.trim(),
      'Amount': form.amount,
      'Paid Status': form.paidStatus,
      'Paid Date': form.paidStatus === 'Paid' ? (form.paidDate || todayStr()) : '',
      'Remark': form.remark.trim(),
    });
    showToast('उधार चंदा दर्ज हो गया ✅');
    setForm({ 
      name: '', 
      date: todayStr(), 
      amount: '', 
      paidStatus: 'Unpaid', 
      paidDate: '', 
      remark: '' 
    });
    setLoading(false);
  };

  const udharChandaList = db.udharChanda || [];
  const totalUdhar = udharChandaList.reduce((s, r) => s + Number(r.Amount || 0), 0);
  const totalPaid = udharChandaList.filter(r => r['Paid Status'] === 'Paid').reduce((s, r) => s + Number(r.Amount || 0), 0);
  const totalUnpaid = totalUdhar - totalPaid;

  return (
    <div className="app">
      <PageHeader title="उधार चंदा" subtitle="उधार चंदा" backTo="/" />

      <div className="content" style={{ paddingTop: '14px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <div className="settings-box" style={{ flex: 1, margin: 0 }}>
            <h3 style={{ fontSize: '13px' }}>कुल उधार</h3>
            <p style={{ color: 'var(--red)', fontFamily: 'Poppins', fontWeight: 800, fontSize: '18px', margin: 0 }}>
              {fmt(totalUnpaid)}
            </p>
          </div>
          <div className="settings-box" style={{ flex: 1, margin: 0 }}>
            <h3 style={{ fontSize: '13px' }}>कुल प्राप्त</h3>
            <p style={{ color: 'var(--green)', fontFamily: 'Poppins', fontWeight: 800, fontSize: '18px', margin: 0 }}>
              {fmt(totalPaid)}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            label="तारीख"
            id="u_date"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <Input
            label="नाम"
            id="u_name"
            placeholder="नाम लिखें"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="राशि (₹)"
            id="u_amount"
            type="number"
            placeholder="0"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <Select
            label="भुगतान स्थिति"
            id="u_status"
            value={form.paidStatus}
            onChange={(e) => setForm({ ...form, paidStatus: e.target.value })}
            options={[
              { label: 'Unpaid (बाकी)', value: 'Unpaid' },
              { label: 'Paid (जमा)', value: 'Paid' },
            ]}
          />
          {form.paidStatus === 'Paid' && (
            <Input
              label="भुगतान की तारीख"
              id="u_paid_date"
              type="date"
              value={form.paidDate || todayStr()}
              onChange={(e) => setForm({ ...form, paidDate: e.target.value })}
            />
          )}
          <Input
            label="विवरण / रिमार्क"
            id="u_remark"
            placeholder="विवरण लिखें"
            value={form.remark}
            onChange={(e) => setForm({ ...form, remark: e.target.value })}
          />
          <Button disabled={loading}>{loading ? 'सेव हो रहा है...' : 'दर्ज करें'}</Button>
        </form>

        <div className="section-title">
          <h2>हाल की एंट्री</h2>
        </div>

        {udharChandaList.length === 0 ? (
          <div className="empty">कोई एंट्री नहीं</div>
        ) : (
          <div className="card-list">
            {[...udharChandaList]
              .reverse()
              .slice(0, 15)
              .map((r, idx) => (
                <div key={idx} className="row-card">
                  <div className="avatar">{r.Name?.charAt(0) || '?'}</div>
                  <div className="row-main">
                    <div className="t1">{r.Name}</div>
                    <div className="t2">
                      {r.Date} · {r['Paid Status'] === 'Paid' ? <span style={{color:'var(--green)'}}>जमा हो गया</span> : <span style={{color:'var(--red)'}}>बकाया</span>}
                    </div>
                  </div>
                  <div className={`row-amt ${r['Paid Status'] === 'Paid' ? 'in' : 'out'}`}>
                    {fmt(r.Amount)}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      <BottomNav active="udhar-chanda" />
    </div>
  );
}
