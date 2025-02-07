import prettifyDate from '../../../../../../cases/utils/prettifyDate.js';
import FieldType from '../../../../../../customization/modules/custom-lookups/enums/FieldType.enum.js';

export const displayDynamicField = (field, value) => {
  if (field.kind === FieldType.SELECT) {
    return value[field.value]?.name;
  }

  if (field.kind === FieldType.MULTISELECT) {
    return value[field.value];
  }

  if (field.kind === FieldType.CALENDAR) {
    return prettifyDate(value[field.value]);
  }

  return value[field.value];
};
