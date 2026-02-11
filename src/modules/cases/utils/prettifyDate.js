import { FormatDateMode } from '@webitel/ui-sdk/enums';
import { formatDate } from '@webitel/ui-sdk/utils';

export default function prettifyDate(timestamp) {
	const value = Number(timestamp);
	if (!value) return '';
	const date = new Date(value);

	return formatDate(date, FormatDateMode.DATETIME_SHORT);
}
