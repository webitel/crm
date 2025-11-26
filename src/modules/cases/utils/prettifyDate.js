import { formatDate } from '@webitel/ui-sdk/utils';

export default function prettifyDate(timestamp) {
  const value = Number(timestamp);
  if (!value) return '';
  const date = new Date(value);

  return formatDate(date, 'datetimeShort');
}
