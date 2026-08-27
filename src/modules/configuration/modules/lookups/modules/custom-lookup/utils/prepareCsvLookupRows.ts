import { FieldType } from '../../../../customization/modules/custom-lookups/enums/FieldType';
import type { LookupCsvField } from '../types/csvImport';

const looksLikeJsonArray = (value: string): boolean =>
	value.startsWith('[') && value.endsWith(']');

// WTEL-9081: A multiselect cell comas in two shapes — a JSON array "[2, 5, 12]" or a ';' separated string "Lviv;Kyiv"
const parseListCell = (raw: string): unknown[] => {
	const trimmed = raw.trim();

	if (looksLikeJsonArray(trimmed)) {
		try {
			const parsed = JSON.parse(trimmed);
			if (Array.isArray(parsed)) return parsed;
		} catch {
			// not valid JSON, fall through to the ';' split
		}
	}

	return trimmed.split(';');
};

const toValuesList = (value: unknown): string[] => {
	const list = Array.isArray(value) ? value : parseListCell(String(value));
	return list.map((item) => String(item).trim()).filter(Boolean);
};

const toBool = (value: unknown): unknown => {
	const trimmed = String(value).trim();

	if (trimmed === 'true') return true;
	if (trimmed === 'false') return false;

	return value;
};

//Only the kinds we cast. Anything else stays a string
const CASTERS: Record<string, (value: unknown) => unknown> = {
	[FieldType.Multiselect]: toValuesList,
	[FieldType.Boolean]: toBool,
};

export const prepareCsvLookupRows = (
	rows: Record<string, unknown>[],
	fields: LookupCsvField[] = [],
): Record<string, unknown>[] => {
	const castByColumn = new Map<string, (value: unknown) => unknown>();

	for (const field of fields) {
		const cast = field.kind ? CASTERS[field.kind] : undefined;
		if (cast && field.value) castByColumn.set(field.value, cast);
	}

	if (!castByColumn.size) return rows;

	return rows.map((row) => {
		const next = {
			...row,
		};
		for (const [column, cast] of castByColumn) {
			if (next[column] != null) next[column] = cast(next[column]);
		}

		return next;
	});
};
