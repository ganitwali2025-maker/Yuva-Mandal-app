import { useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { initials, fmt, fdate, todayStr } from '../utils/helpers';
import PageHeader from '../components/layout/PageHeader';
import BottomNav from '../components/layout/BottomNav';

export default function IdCard() {
  const { id } = useParams();
  const { db, settings } = useApp();

  const member =
    db.members.find((x) => String(x.ID) === String(id)) || {
      ID: '—',
      Name: 'नया सदस्य',
      Mobile: '-',
      Village: settings.village,
      JoinDate: todayStr(),
    };

  const paid = db.chanda
    .filter((c) => String(c.MemberID) === String(member.ID))
    .reduce((s, r) => s + Number(r.Amount || 0), 0);

  return (
    <div className="app">
      <PageHeader title="सदस्य पहचान पत्र" subtitle="Member ID Card" backTo="/members" />

      <div className="idcard-wrap">
        <div className="idcard">
          <div className="idcard-top">
            <div className="idcard-org">{settings.mandalName.toUpperCase()}</div>
            <div className="idcard-id">ID: {String(member.ID).padStart(3, '0')}</div>
          </div>
          <div className="idcard-photo">{initials(member.Name)}</div>
          <div className="idcard-name">{member.Name}</div>
          <div className="idcard-role">
            सक्रिय सदस्य · {member.Village || settings.village}
          </div>
          <div className="idcard-grid">
            <div>
              <div className="k">मोबाइल</div>
              <div className="v">{member.Mobile || '-'}</div>
            </div>
            <div>
              <div className="k">जुड़ने की तारीख</div>
              <div className="v">{fdate(member.JoinDate)}</div>
            </div>
          </div>
          <div className="idcard-strip"></div>
        </div>
        <div className="settings-box" style={{ margin: '16px 0 0' }}>
          <h3>अब तक जमा चंदा</h3>
          <p style={{ marginBottom: 0, color: 'var(--green)', fontFamily: 'Poppins', fontWeight: 700, fontSize: '18px' }}>
            {fmt(paid)}
          </p>
        </div>
      </div>

      <BottomNav active="members" />
    </div>
  );
}
