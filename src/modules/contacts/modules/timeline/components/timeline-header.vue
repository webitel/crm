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
        :calls-count="callsCount"
        :chats-count="chatsCount"
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
import { computed, inject, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import capitalize from 'lodash/capitalize';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters.js';
import TimelineAPI from '../api/TimelineAPI.js';
import TimelineTaskTypeFilter from '../modules/filters/components/timeline-task-type-filter.vue';

const props = defineProps({
  contactId: {
    type: String,
    required: true,
  },
});

const namespace = inject('namespace');
const eventBus = inject('$eventBus');

const { d, t, locale } = useI18n();

const { filtersNamespace } = useTableFilters(namespace);

const showHeader = computed(() => true);

const callsCount = ref(0);
const chatsCount = ref(0);
const dateFrom = ref(Date.now());
const dateTo = ref(Date.now());

const timelineInterval = computed(() => {
  const formatDate = (date) => {
    const fullDate = new Date(+date);
    return capitalize(d(fullDate, 'timelineInterval', locale.value === 'ua' ? 'uk' : undefined));
  }

  const from = +dateFrom.value;
  const to = +dateTo.value;

  return `${formatDate(from)} - ${formatDate(to)}`;
})

function collapseAll () {
  return eventBus.$emit('timeline/rows/collapse-all');
}

async function loadCounters() {
  const {
    dateFrom: sourceDateFrom,
    dateTo: sourceDateTo,
    callsCount: sourceCallsCount,
    chatsCount: sourceChatsCount,
  } = await TimelineAPI.getCounters({ parentId: props.contactId });

  callsCount.value = sourceCallsCount;
  chatsCount.value = sourceChatsCount;
  dateFrom.value = sourceDateFrom;
  dateTo.value = sourceDateTo;
}

loadCounters();
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
