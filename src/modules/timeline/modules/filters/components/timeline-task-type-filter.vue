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
import { computed } from 'vue';
import { useStore } from 'vuex';

import { TimelineEventType } from '../../../enums/TimelineEventType';

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
  emailsCount: {
    type: [Number, String],
    default: 0,
  },
});

const store = useStore();

const filterValue = computed(() => store.getters[`${props.namespace}/GET_FILTER`]('type'));

function setFilter(payload) {
  return store.dispatch(`${props.namespace}/SET_FILTER`, payload);
}

function toggleFilterValue(value) {
  const newValue = filterValue.value.includes(value)
    ? filterValue.value.filter((item) => item !== value)
    : [...filterValue.value, value];

  return setFilter({ name: 'type', value: newValue });
}

const filters = computed(() => [
  {
    icon: 'call',
    selected: filterValue.value.includes(TimelineEventType.Call),
    set: () => toggleFilterValue(TimelineEventType.Call),
    count: props.callsCount,
  },
  {
    icon: 'chat',
    selected: filterValue.value.includes(TimelineEventType.Chat),
    set: () => toggleFilterValue(TimelineEventType.Chat),
    count: props.chatsCount,
  },
  {
    icon: 'email',
    selected: filterValue.value.includes(TimelineEventType.Email),
    set: () => toggleFilterValue(TimelineEventType.Email),
    count: props.emailsCount,
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
