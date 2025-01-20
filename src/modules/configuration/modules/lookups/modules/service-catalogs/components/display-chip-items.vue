<template>
  <div class="display-chip-items">
    {{ displayText(firstItemName) }}

    <wt-tooltip
      v-if="displayList.length"
      :triggers="['click']"
    >
      <template #activator>
        <wt-chip>
          +{{ displayList.length }}
        </wt-chip>
      </template>

      <div
        v-for="({ name, id }) of displayList"
        :key="id"
      >
        {{ name }}
      </div>
    </wt-tooltip>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { displayText, EMPTY_SYMBOL } from '../../../../../../../app/utils/displayText.js';

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
})

const firstItemName = computed(() => {
  if(!props.items?.length) return EMPTY_SYMBOL;

  return props.items[0]?.name
});

const displayList = computed(() => {
  if(!props.items?.length) return [];

  return props.items.slice(1);
})
</script>

<style lang="scss" scoped>
.display-chip-items {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}
</style>