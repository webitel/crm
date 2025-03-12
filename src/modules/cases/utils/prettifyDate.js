export default function prettifyDate(timestamp) {
  const value = Number(timestamp);
  if (!value) return '';
  const date = new Date(value);

  const time = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const datePart = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }).replace(/\//g, '.');

  return `${time} ${datePart}`;
}
