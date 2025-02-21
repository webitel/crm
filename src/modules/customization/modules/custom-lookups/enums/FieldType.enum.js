/**
 * @name FieldType
 * @description Enumerates (ONLY!) the types of field type.
 */

export const FieldType = Object.freeze({
  Text: 'string',
  Number: 'int32',
  Select: 'lookup',
  Multiselect: 'list',
  Calendar: 'datetime',
  Boolean: 'bool',
});
