// dictionary field from table headers
export type LookupCsvField = {
	value?: string;
	kind?: string;
	required?: boolean;
	locale?: string;
	readonly?: boolean;
};

// mapping for wt-upload-csv-popup (name ← value + csv column)
export type CsvMappingField = {
	name?: string;
	required?: boolean;
	locale?: string;
	kind?: string;
	csv: string;
};
