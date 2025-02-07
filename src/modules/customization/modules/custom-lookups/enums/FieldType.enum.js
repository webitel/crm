/**
 * @name FieldType
 * @description Enumerates (ONLY!) the types of field type.
 */

const FieldType = Object.freeze({
  TEXT: 'string',
  NUMBER: 'int32',
  SELECT: 'lookup',
  MULTISELECT: 'list',
  CALENDAR: 'datetime',
  BOOLEAN: 'bool',
});

export default FieldType;
