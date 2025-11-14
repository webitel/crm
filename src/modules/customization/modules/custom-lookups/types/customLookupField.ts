import type { FieldType } from '../enums/FieldType';

export interface CustomLookupField {
  name: string;
  id: string;
  kind: FieldType;
  required: boolean;
  lookup: null | CustomLookupLookup;
  list: null;
  default: null | string | CustomLookupValue;
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
