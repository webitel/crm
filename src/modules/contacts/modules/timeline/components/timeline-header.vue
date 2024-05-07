<template>
  <header
    v-if="showHeader"
    class="timeline-header"
  >
    <p class="timeline-header-duration">
      {{ timelineInterval }}
    </p>
    <div class="timeline-header-actions">
      <timeline-task-type-filter
        :namespace="filtersNamespace"
        :calls-count="taskCounters[WebitelContactsTimelineEventType.Call]"
        :chats-count="taskCounters[WebitelContactsTimelineEventType.Chat]"
      />
      <button
        class="timeline-header-collapse"
        @click="collapseAll"
      >
        {{ t('contacts.collapseAll') }}
      </button>
    </div>
  </header>

</template>
<script setup>
import { computed, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import capitalize from 'lodash/capitalize';
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
const eventBus = inject('$eventBus');

const { d, t, locale } = useI18n();

const { filtersNamespace } = useTableFilters(namespace);

const showHeader = computed(() => true);

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
    return capitalize(d(fullDate, 'timelineInterval', locale.value === 'ua' ? 'uk' : undefined));
  }

  const from = props.list.at(-1)?.dayTimestamp || (new Date().setMonth(new Date().getMonth() - 1));
  const to = props.list.at(1)?.dayTimestamp || new Date().getTime();

  return `${formatDate(from)} - ${formatDate(to)}`;
})

function collapseAll () {
  return eventBus.$emit('timeline/rows/collapse-all');
}

</script>

<style lang="scss" scoped>
.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--wt-table-head-border-color);
  border-radius: var(--border-radius);
}

.timeline-header-duration {
  @extend %typo-subtitle-2;
}

.timeline-header-actions {
  display: flex;
  gap: var(--spacing-md);
}

.timeline-header-collapse {
  @extend %typo-body-2;
  cursor: pointer;
}
</style>
