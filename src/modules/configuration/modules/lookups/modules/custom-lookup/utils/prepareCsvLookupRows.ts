import { FieldType } from '../../../../../../customization/modules/custom-lookups/enums/FieldType';

export type LookupCsvField = {
	value?: string;
	kind?: string;
	required?: boolean;
	locale?: string;
	readonly?: boolean;
};

const toValuesList = (value: unknown): string[] => {
	const values = Array.isArray(value) ? value : String(value).split(';');
	return values.map((item) => String(item).trim()).filter(Boolean);
};

/**
 * Multiselect columns come from CSV as a single string: "Lviv;Kyiv".
 * The batch API expects an array of names instead: ["Lviv", "Kyiv"].
 * All other columns are sent as is.
 */
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
