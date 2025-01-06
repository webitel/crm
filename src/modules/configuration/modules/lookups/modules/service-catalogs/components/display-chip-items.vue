<template>
  {{ displayText(getFirstItemName()) }}

  <wt-tooltip
    v-if="displayList.length"
    :triggers="['click']"
  >
    <template #activator>
      <wt-chip class="display-chip">
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
</template>

<script setup>
import { computed } from 'vue';
import TimelineRowInitiator
  from '../../../../../../contacts/modules/timeline/components/utils/timeline-row-initiator.vue';

const EMPTY_CELL = '-'

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
})
const getFirstItemName = () => {
  if(!props.items?.length) return EMPTY_CELL;

  return props.items[0]?.name
};
const displayList = computed(() => {
  if(!props.items?.length) return [];

  return props.items.slice(1);
})
const displayText = (text) => text ? text : EMPTY_CELL;
</script>

<style lang="scss" scoped>
.display-chip {
  margin-left: var(--spacing-xs);
}
</style>