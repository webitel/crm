<template>
  <div class="timeline-task-type-filter">
    <div
      v-for="({ icon, selected, set, count }) of filters"
      class="timeline-task-type-filter__filter-wrapper"
    >
      <wt-checkbox
        :selected="selected"
        @update:selected="set"
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

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

import { TimelineEventType } from '../../../enums/TimelineEventType';
import { useTimelineStore } from '../../../stores/timeline';

interface Props {
	callsCount?: number | string;
	chatsCount?: number | string;
	emailsCount?: number | string;
}

const props = withDefaults(defineProps<Props>(), {
	callsCount: 0,
	chatsCount: 0,
	emailsCount: 0,
});

const timelineStore = useTimelineStore();
const { typeFilter } = storeToRefs(timelineStore);
const { setTypeFilter } = timelineStore;

function toggleFilterValue(value: TimelineEventType) {
	const newValue = typeFilter.value.includes(value)
		? typeFilter.value.filter((item) => item !== value)
		: [
				...typeFilter.value,
				value,
			];

	return setTypeFilter(newValue);
}

const filters = computed(() => [
	{
		icon: 'call',
		selected: typeFilter.value.includes(TimelineEventType.Call),
		set: () => toggleFilterValue(TimelineEventType.Call),
		count: props.callsCount,
	},
	{
		icon: 'chat',
		selected: typeFilter.value.includes(TimelineEventType.Chat),
		set: () => toggleFilterValue(TimelineEventType.Chat),
		count: props.chatsCount,
	},
	{
		icon: 'email',
		selected: typeFilter.value.includes(TimelineEventType.Email),
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
