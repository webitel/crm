<template>
  {{ displayText(getFirstItemName()) }}

  <wt-context-menu :options="options">
    <template #activator>
      <wt-chip
        v-if="displayCountChipItems(items)"
        class="display-chip"
      >
        {{ displayCountChipItems() }}
      </wt-chip>
    </template>
  </wt-context-menu>
</template>

<script setup>
import { computed } from 'vue';

const EMPTY_CELL = '-'

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
})
const getFirstItemName = () => {
  if(!props.items?.length) return '';

  return props.items[0]?.name
};
const displayCountChipItems = () => {
  if(!props.items?.length) return 0;

  switch (props.items.length) {
    case 1:
      return 0;
    case 2:
      return 1;
    default:
      return `+${props.items.length - 1}`;
  }
}
const options = computed(() => {
  console.log('items', props.items)
  if(!props.items?.length) return [];

  return props.items.slice(1).map((item) => ({
    text: item.name
  }));
})
const displayText = (text) => {
  if(!text) return EMPTY_CELL;

  return text;
}
</script>

<style lang="scss" scoped>
.display-chip {
  margin-left: var(--spacing-xs);
}
</style>