<template>
  <header
    v-if="isDisplayHeader"
    class="timeline-header">
    <p class="timeline-header-duration">{{ durationTimeline }}</p>
    <div class="timeline-header-actions">
      <timeline-task-type-filter
        :namespace="filtersNamespace"
        :calls-count="taskCounters[WebitelContactsTimelineEventType.Call]"
        :chats-count="taskCounters[WebitelContactsTimelineEventType.Chat]"
      />
      <button class="timeline-header-collapse">{{ t('contacts.collapseAll') }}</button>
    </div>
  </header>

</template>
<script setup>
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters.js';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { WebitelContactsTimelineEventType } from 'webitel-sdk';
import TimelineTaskTypeFilter from '../modules/filters/components/timeline-task-type-filter.vue';

const props = defineProps({
  list: {
    type: Array,
  },
  namespace: {
    type: String,
    required: true,
  },
});

const { t } = useI18n();
const store = useStore();

const { filtersNamespace } = useTableFilters(props.namespace);

const isDisplayHeader = computed(() => props.list.length || (!props.list.length));

const taskCounters = computed(() => {
  return props.list.reduce((acc, { callsCount = 0, chatsCount = 0 }) => {
    return {
      [WebitelContactsTimelineEventType.Call]: acc[WebitelContactsTimelineEventType.Call] + +callsCount,
      [WebitelContactsTimelineEventType.Chat]: acc[WebitelContactsTimelineEventType.Chat] + +chatsCount,
    };
  }, {
    [WebitelContactsTimelineEventType.Call]: 0,
    [WebitelContactsTimelineEventType.Chat]: 0,
  });
});

const dateFrom = computed(() => props.list[props.list.length - 1]?.dayTimestamp);
const dateTo = computed(() => props.list[0]?.dayTimestamp);

const displayedDateFrom = computed(() => dateFrom.value || (new Date().setMonth(new Date().getMonth() - 1)));////Math.floor
const displayedDateTo = computed(() => dateTo.value || (new Date().getTime()));

const durationTimeline = computed(() => `${formatDate(displayedDateFrom.value)} - ${formatDate(displayedDateTo.value)}`);

function formatDate(date) { ///i18n
  const fullDate = new Date(+date);
  const mouth = fullDate.toLocaleString('en', { month: 'short' }).toLowerCase();
  const year = fullDate.toLocaleString('en', { year: 'numeric' });
  return t(`contacts.timeline.mouth.${mouth}`) + ' ' + year;
}
</script>

<style lang="scss" scoped>
.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--secondary-light-color);

  &-duration {
    @extend %typo-subtitle-2;
  }

  &-actions {
    display: flex;
    gap: var(--spacing-md);
  }

  &-collapse {
    @extend %typo-body-2;
    margin: auto;
    cursor: pointer;
  }
}
</style>
