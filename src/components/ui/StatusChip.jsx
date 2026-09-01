export default function StatusChip({ status, text }) {
  const chipClass = status === 'ok' ? 'status-chip ok' : 'status-chip off';
  return <span className={chipClass}>{text}</span>;
}
