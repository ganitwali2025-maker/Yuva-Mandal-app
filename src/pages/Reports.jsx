import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateTotals, fmt } from '../utils/helpers';
import PageHeader from '../components/layout/PageHeader';
import BottomNav from '../components/layout/BottomNav';

export default function Reports() {
  const { db } = useApp();
  const [tab, setTab] = useState('summary');
  const totals = calculateTotals(db);

  const tabs = ['summary', 'members', 'mashikJama', 'sahyog', 'expense'];
  const tabLabels = {
    summary: 'सारांश',
    members: 'सदस्य',
    mashikJama: 'मासिक जमा',
    sahyog: 'सहयोग',
    expense: 'खर्च',
  };

  const columnMap = {
    members: ['ID', 'Name', 'Mobile', 'Village', 'JoinDate', 'Status'],
    mashikJama: ['ID', 'दिनांक', 'माह', 'सदस्य का नाम', 'फोन नंबर', 'पद', 'राशि (₹)', 'भुगतान माध्यम', 'एंट्री दिनांक', 'एंट्री समय'],
    sahyog: ['ID', 'DonorName', 'Purpose', 'Amount', 'Date'],
    expense: ['ID', 'Date', 'Category', 'Description', 'Amount', 'PaidTo'],
  };

  return (
    <div className="app">
      <PageHeader title="रिपोर्ट शीट" subtitle="Google Sheet का लाइव डेटा" backTo="/" />

      <div className="tabbar">
        {tabs.map((k) => (
          <div
            key={k}
            className={`tab ${tab === k ? 'active' : ''}`}
            onClick={() => setTab(k)}
          >
            {tabLabels[k]}
          </div>
        ))}
      </div>

      <div style={{ paddingTop: '10px' }}>
        {tab === 'summary' ? (
          <div style={{ padding: '0 18px' }}>
            <div className="settings-box">
              <h3>वित्तीय सारांश (Financial Summary)</h3>
              <table className="rep" style={{ marginTop: '8px' }}>
                <tbody>
                  <tr>
                    <td>कुल आय (जमा + सहयोग)</td>
                    <td style={{ textAlign: 'right', color: 'var(--green)', fontWeight: 700 }}>
                      {fmt(totals.income)}
                    </td>
                  </tr>
                  <tr>
                    <td>— मासिक जमा</td>
                    <td style={{ textAlign: 'right' }}>{fmt(totals.mashikJamaTotal)}</td>
                  </tr>
                  <tr>
                    <td>— सहयोग / दान</td>
                    <td style={{ textAlign: 'right' }}>{fmt(totals.sahyogTotal)}</td>
                  </tr>
                  <tr>
                    <td>कुल खर्च</td>
                    <td style={{ textAlign: 'right', color: 'var(--red)', fontWeight: 700 }}>
                      {fmt(totals.expense)}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>कुल बैलेंस</b>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <b>{fmt(totals.balance)}</b>
                    </td>
                  </tr>
                  <tr>
                    <td>कुल सदस्य</td>
                    <td style={{ textAlign: 'right' }}>{db.members.length}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rep-wrap">
            <table className="rep">
              <thead>
                <tr>
                  {columnMap[tab].map((c) => (
                    <th key={c}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {db[tab].length === 0 ? (
                  <tr>
                    <td
                      colSpan={columnMap[tab].length}
                      style={{
                        textAlign: 'center',
                        color: 'var(--muted)',
                        padding: '20px',
                      }}
                    >
                      कोई डेटा नहीं
                    </td>
                  </tr>
                ) : (
                  db[tab].map((r, idx) => (
                    <tr key={idx}>
                      {columnMap[tab].map((c) => (
                        <td key={c}>{c === 'Amount' || c === 'राशि (₹)' ? fmt(r[c]) : r[c] || '-'}</td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <BottomNav active="reports" />
    </div>
  );
}
