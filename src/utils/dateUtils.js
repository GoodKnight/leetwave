export function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function formatDate(date) {
  return new Date(date).toISOString().split('T')[0];
}

export function isToday(dateStr) {
  return formatDate(new Date()) === dateStr;
}

export function isPastDue(dateStr) {
  if (!dateStr) return false;
  return new Date(dateStr) <= new Date(formatDate(new Date()));
}

export function daysBetween(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
}
