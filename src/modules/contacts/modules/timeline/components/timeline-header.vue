<template>
  <header class="timeline-header">
    <p class="timeline-header__duration">{{ `${formatDate(finalDateTo)} - ${formatDate(finalDateFrom)}` }}</p>
    <div class="timeline-header__actions">
      <event-type-filter
        v-for="({ type, iconName, countName },idx) of timelineEventTypes"
        :key="idx"
        :type="type"
        :icon="iconName"
        :selected="isSelectedFilter(type)"
        :count="culcTotalSum(countName)"
        @change="changeFilterValue"
      ></event-type-filter>

      <p class="timeline-header__collapse">{{ t('contacts.collapseAll') }}</p>
    </div>
  </header>

</template>
<script setup>
import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import EventTypeFilter from './event-type-filter.vue';
import timelineEventTypes from './enums/timelineEventTypes.enum';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
  filtersNamespace: {
    type: String,
    required: true,
  },
});

const { t } = useI18n();
const store = useStore();

const dataList = computed(() => getNamespacedState(store.state, props.namespace).dataList);
const activeFilterTypes = computed(() => getNamespacedState(store.state, props.filtersNamespace).type.value);

const currentDateInUnixFormat = computed(() => Math.floor(new Date().getTime()));
const prevMouthInUnixFormat = computed(() => Math.floor(new Date().setMonth(new Date().getMonth() - 1)));

const dateFrom = computed(() => dataList?.value.sort((a, b) => b.dayTimestamp - a.dayTimestamp)[0]?.dayTimestamp);
const dateTo = computed(() => dataList?.value.sort((a, b) => a.dayTimestamp - b.dayTimestamp)[0]?.dayTimestamp);

const finalDateFrom = computed(() => dateFrom.value || prevMouthInUnixFormat.value);
const finalDateTo = computed(() => dateTo.value || currentDateInUnixFormat.value);

function setFilter(payload) {
  return store.dispatch(`${props.filtersNamespace}/SET_FILTER`, payload);
}

function culcTotalSum(key) {
  return dataList?.value.reduce((acc, item) => acc + Number(item[key]), 0) || 0;
}

function isSelectedFilter(filter) {
  return !activeFilterTypes.value ? true : activeFilterTypes.value.includes(filter);
}

function formatDate(date) {
  const fullDate = new Date(+date);
  const mouth = fullDate.toLocaleString('en', { month: 'short' }).toLowerCase();
  const year = fullDate.toLocaleString('en', { year: 'numeric' });
  return t(`contacts.timeline.mouth.${mouth}`) + ' ' + year;
}

function defineFilterValue({ type, value }) {
  let result;
  if(!value) {
    if(activeFilterTypes.value) result = activeFilterTypes.value.filter(item => item !== type);
    else {
      result = timelineEventTypes.filter(item => item.type !== type).map(item => item.type);
    }
  } else {
    result = [...activeFilterTypes.value];
    result.push(type);
  }
  return result;
}

function changeFilterValue(event) {
  const value = defineFilterValue(event);
  setFilter({ filter: 'type', value })
}
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
