export default function prettifyDate(timestamp, timeZone = undefined) {
  const value = Number(timestamp);
  if (!value) return '';
  const date = new Date(value);

  const time = date.toLocaleTimeString('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
  });

  const datePart = date
    .toLocaleDateString('en-GB', {
      timeZone,
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    })
    .replace(/\//g, '.');

  return `${datePart} ${time}`;
}
