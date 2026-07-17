import { FieldType } from '../../../../../../customization/modules/custom-lookups/enums/FieldType';
import type { LookupCsvField } from '../types/csvImport';

const toValuesList = (value: unknown): string[] => {
	const values = Array.isArray(value) ? value : String(value).split(';');
	return values.map((item) => String(item).trim()).filter(Boolean);
};

// Multiselect: "Lviv;Kyiv" -> ["Lviv", "Kyiv"]; other columns as is
export const prepareCsvLookupRows = (
	rows: Record<string, unknown>[],
	fields: LookupCsvField[] = [],
): Record<string, unknown>[] => {
	const multiselectColumns = fields
		.filter((field) => field.kind === FieldType.Multiselect)
		.map((field) => field.value)
		.filter(Boolean) as string[];

	for (const row of rows) {
		for (const column of multiselectColumns) {
			if (row[column] != null) {
				row[column] = toValuesList(row[column]);
			}
		}
	}

	return rows;
};
