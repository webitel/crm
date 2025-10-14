import type { FieldType } from '../enums/FieldType';

export interface CustomLookupField {
  name: string;
  id: string;
  kind: FieldType;
  required: boolean;
  lookup: null | CustomLookupLookup;
  list: null;
  default: null | string | CustomLookupLookup;
  _dirty: boolean;
}

export interface CustomLookupLookup {
  path: string;
  name: string;
}
