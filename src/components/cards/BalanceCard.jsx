import { fmt } from '../../utils/helpers';

export default function BalanceCard({ balance, income, expense, memberCount }) {
  return (
    <div className="balance-card">
      <div className="balance-top">
        <div>
          <div className="balance-label">कुल बैलेंस (Total Balance)</div>
          <div className="balance-amt">{fmt(balance)}</div>
        </div>
        <div className="balance-pill">{memberCount} सदस्य</div>
      </div>
      <div className="balance-split">
        <div className="split-item">
          <div className="lbl">
            <span className="dot" style={{ background: 'var(--green)' }}></span>कुल आय
          </div>
          <div className="val" style={{ color: 'var(--green)' }}>
            {fmt(income)}
          </div>
        </div>
        <div className="split-item">
          <div className="lbl">
            <span className="dot" style={{ background: 'var(--red)' }}></span>कुल खर्च
          </div>
          <div className="val" style={{ color: 'var(--red)' }}>
            {fmt(expense)}
          </div>
        </div>
      </div>
    </div>
  );
}
