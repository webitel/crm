<template>
  <header
    v-if="showHeader"
    class="timeline-header"
  >
    <p class="timeline-header__duration">
      {{ timelineInterval }}
    </p>
    <div class="timeline-header__actions">
      <timeline-task-type-filter
        :namespace="filtersNamespace"
        :calls-count="taskCounters[WebitelContactsTimelineEventType.Call]"
        :chats-count="taskCounters[WebitelContactsTimelineEventType.Chat]"
      />
      <button class="timeline-header__collapse">
        {{ t('contacts.collapseAll') }}
      </button>
    </div>
  </header>

</template>
<script setup>
import { computed, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { WebitelContactsTimelineEventType } from 'webitel-sdk';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters.js';
import TimelineTaskTypeFilter from '../modules/filters/components/timeline-task-type-filter.vue';

const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
});

const namespace = inject('namespace');

const { d, t } = useI18n();

const { filtersNamespace } = useTableFilters(namespace);

// FIXME: what is showHeader condition?
const showHeader = computed(() => true || props.list.length || Object.values(taskCounters.value).some(num => num));

const taskCounters = computed(() => {
    return props.list.reduce((acc, { callsCount = 0, chatsCount = 0 }) => {
        return {
          [WebitelContactsTimelineEventType.Call]: acc[WebitelContactsTimelineEventType.Call] + +callsCount,
          [WebitelContactsTimelineEventType.Chat]: acc[WebitelContactsTimelineEventType.Chat] + +chatsCount,
        };
    }, {
      [WebitelContactsTimelineEventType.Call]: 0,
      [WebitelContactsTimelineEventType.Chat]: 0,
    })
});

const timelineInterval = computed(() => {
  const formatDate = (date) => {
    const fullDate = new Date(+date);
    const mouth = d(fullDate, { month: 'long' });
    const year = d(fullDate, { year: 'numeric' });
    return `${mouth} ${year}`;
  }

  const from = props.list.at(-1)?.dayTimestamp || (new Date().setMonth(new Date().getMonth() - 1));
  const to = props.list.at(1)?.dayTimestamp || new Date().getTime();

  return `${formatDate(from)} - ${formatDate(to)}`;
})
</script>

<style lang="scss" scoped>
.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--secondary-light-color);

  &__duration {
    @extend %typo-subtitle-2;
  }

  &__actions {
    display: flex;
    gap: var(--spacing-md);
  }

  &__collapse {
    @extend %typo-body-2;
    margin: auto;
    cursor: pointer;
  }
}
</style>
