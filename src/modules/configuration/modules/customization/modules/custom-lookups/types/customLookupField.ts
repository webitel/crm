import type { DataField } from '@webitel/api-services/gen/models';

import type { FieldType } from '../enums/FieldType';

export type ColumnField = Partial<DataField> &
	Record<string, any> & {
		position?: number;
	};

export interface CustomLookupField {
	name: string;
	id: string;
	kind: FieldType | '';
	required: boolean;
	lookup: null | CustomLookupLookup;
	list: null;
	default: null | string | boolean | CustomLookupValue;
	_dirty: boolean;
}

export interface CustomLookupLookup {
	path: string;
	name: string;
	primary: string;
	display: string;
}

export interface CustomLookupValue {
	id: string;
	name: string;
}
