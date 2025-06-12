// timestamp come from backend in seconds format, need to transform to milliseconds
export default function prettifyCustomLookupDate(timestamp) {
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
