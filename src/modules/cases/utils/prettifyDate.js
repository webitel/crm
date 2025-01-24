export default function prettifyDate(timestamp) {
  const value = Number(timestamp);
  if (!value) return '';
  const date = new Date(value);

  const time = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const datePart = date.toLocaleDateString('en-GB').replace(/\//g, '.');

  return `${time} ${datePart}`;
}
