<template>
  <div class="timeline-task-type-filter">
    <div
      v-for="({ icon, selected, set, count }) of filters"
      class="timeline-task-type-filter__filter-wrapper"
    >
      <wt-checkbox
        :selected="selected"
        @change="set"
      >
        <template #label>
          <div class="timeline-task-type-filter__label-wrapper">
            <wt-icon
              :icon="icon"
            />
            <span class="timeline-task-type-filter__count">
            ({{ count }})
          </span>
          </div>
        </template>
      </wt-checkbox>
    </div>
  </div>
</template>

<script setup>
import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState';
import { computed } from 'vue';
import { useStore } from 'vuex';
import { WebitelContactsTimelineEventType } from 'webitel-sdk';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
  callsCount: {
    type: [Number, String],
    default: 0,
  },
  chatsCount: {
    type: [Number, String],
    default: 0,
  },
});

const store = useStore();

const filterValue = computed(() => getNamespacedState(store.state, props.namespace).type.value);

function setFilter(payload) {
  return store.dispatch(`${props.namespace}/SET_FILTER`, payload);
}

function toggleFilterValue(value) {
  const newValue = filterValue.value.includes(value)
    ? filterValue.value.filter((item) => item !== value)
    : [...filterValue.value, value];

  return setFilter({ filter: 'type', value: newValue });
}

const filters = computed(() => [
  {
    icon: 'call',
    selected: filterValue.value.includes(WebitelContactsTimelineEventType.Call),
    set: () => toggleFilterValue(WebitelContactsTimelineEventType.Call),
    count: props.callsCount,
  },
  {
    icon: 'chat',
    selected: filterValue.value.includes(WebitelContactsTimelineEventType.Chat),
    set: () => toggleFilterValue(WebitelContactsTimelineEventType.Chat),
    count: props.chatsCount,
  },
]);
</script>

<style lang="scss" scoped>
.timeline-task-type-filter {
  display: flex;
  gap: var(--spacing-md);

  &__label-wrapper {
    display: flex;
    align-items: center;
    gap: var(--spacing-2xs);
    margin-left: var(--spacing-2xs);
  }
}
</style>
