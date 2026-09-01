// Utility Helper Functions

export function fmt(n) {
  n = Number(n) || 0;
  return '₹' + n.toLocaleString('en-IN');
}

export function initials(name) {
  if (!name) return '?';
  const p = name.trim().split(/\s+/);
  return (p[0][0] + (p[1] ? p[1][0] : '')).toUpperCase();
}

export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function fdate(d) {
  if (!d) return '-';
  const dt = new Date(d);
  if (isNaN(dt)) return String(d).slice(0, 10);
  return dt.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function calculateTotals(db) {
  const income =
    db.chanda.reduce((s, r) => s + Number(r.Amount || 0), 0) +
    db.sahyog.reduce((s, r) => s + Number(r.Amount || 0), 0);
  const expense = db.expense.reduce((s, r) => s + Number(r.Amount || 0), 0);
  const balance = income - expense;
  const chandaTotal = db.chanda.reduce((s, r) => s + Number(r.Amount || 0), 0);
  const sahyogTotal = db.sahyog.reduce((s, r) => s + Number(r.Amount || 0), 0);
  return { income, expense, balance, chandaTotal, sahyogTotal };
}

export function getRecentActivities(db, limit = 5) {
  const recent = [
    ...db.chanda.map((r) => ({ ...r, _type: 'chanda', _date: r.Date })),
    ...db.sahyog.map((r) => ({ ...r, _type: 'sahyog', _date: r.Date })),
    ...db.expense.map((r) => ({ ...r, _type: 'expense', _date: r.Date })),
  ].sort((a, b) => new Date(b._date) - new Date(a._date)).slice(0, limit);
  return recent;
}
