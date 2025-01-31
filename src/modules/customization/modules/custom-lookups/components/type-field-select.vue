<template>
  <wt-select
    :value="value.kind"
    :options="options"
    :label="$t('vocabulary.type')"
    track-by="name"
    use-value-from-options-by-prop="type"
    @input="changeType($event)"
  />
  <!--  TODO Implement display input by type-->
</template>

<script setup>
import FieldType from '../enums/FieldType.enum.js';

const props = defineProps({
  value: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['changeType']);

const options = [
  { name: 'Text', type: FieldType.TEXT },
  { name: 'Number', type: FieldType.NUMBER },
  { name: 'Select', type: FieldType.SELECT },
  { name: 'Multiselect', type: FieldType.MULTISELECT },
  { name: 'Calendar', type: FieldType.CALENDAR },
  { name: 'Boolean', type: FieldType.BOOLEAN },
];

const changeType = (value) => {
  props.value.kind = value;
};
</script>

<style scoped lang="scss"></style>
