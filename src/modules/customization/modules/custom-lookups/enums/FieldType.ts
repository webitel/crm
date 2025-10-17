/**
 * @name FieldType
 * @description Enumerates (ONLY!) the types of field type.
 */

export const FieldType = {
  Text: 'string',
  Number: 'int32',
  Select: 'lookup',
  Multiselect: 'list',
  Calendar: 'datetime',
  Boolean: 'bool',
} as const;

export type FieldType = (typeof FieldType)[keyof typeof FieldType];
