import { fmt, initials, fdate } from '../../utils/helpers';

export default function ActivityRow({ activity }) {
  const isIncome = activity._type !== 'expense';
  const title =
    activity._type === 'mashikJama'
      ? (activity['सदस्य का नाम'] || 'सदस्य') + ' — मासिक जमा'
      : activity._type === 'sahyog'
      ? (activity.DonorName || 'सहयोग') + ' — सहयोग'
      : activity.Category || 'खर्च';

  const sub =
    activity._type === 'mashikJama'
      ? `${activity['माह'] || ''} · ${fdate(activity._date)}`
      : activity._type === 'sahyog'
      ? `${activity.Purpose || ''} · ${fdate(activity._date)}`
      : `${activity.Description || ''} · ${fdate(activity._date)}`;

  return (
    <div className="row-card">
      <div
        className="avatar"
        style={{
          background: isIncome ? 'var(--green-bg)' : 'var(--red-bg)',
          color: isIncome ? 'var(--green)' : 'var(--red)',
        }}
      >
        {isIncome ? '↑' : '↓'}
      </div>
      <div className="row-main">
        <div className="t1">{title}</div>
        <div className="t2">{sub}</div>
      </div>
      <div className={`row-amt ${isIncome ? 'in' : 'out'}`}>
        {isIncome ? '+' : '-'}
        {fmt(activity.Amount || activity['राशि (₹)'])}
      </div>
    </div>
  );
}
