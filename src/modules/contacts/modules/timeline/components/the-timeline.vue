<template>
  <timeline-container>
    <template #header>
      <timeline-header
        :namespace="timelineNamespace"
        :list="dataList"
      />
    </template>

    <template #content>
      <wt-loader
        v-if="isLoading"
      />

      <wt-dummy
        v-else-if="!dataList.length"
        :src="darkMode ? dummyDark : dummyLight"
      />

      <day-timeline-row-section
        v-for="day of dataList"
        :key="day.dateTimestamp"
        :day="day"
      ></day-timeline-row-section>
    </template>
  </timeline-container>

</template>

<script setup>
import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState';
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters';
import TimelineContainer from './timeline-container.vue';
import dummyDark from '../assets/timeline-dummy-dark.svg';
import dummyLight from '../assets/timeline-dummy-light.svg';
import DayTimelineRowSection from './day-row/day-timeline-row-section.vue';
import TimelineHeader from './timeline-header.vue';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const store = useStore();

const darkMode = computed(() => store.getters['appearance/DARK_MODE']);

const timelineNamespace = `${props.namespace}/timeline`;

const dataList = computed(() => getNamespacedState(store.state, timelineNamespace).dataList);
const isLoading = computed(() => getNamespacedState(store.state, timelineNamespace).isLoading);

function initializeList() {
  return store.dispatch(`${timelineNamespace}/INITIALIZE_LIST`);
}

initializeList();
</script>

<style lang="scss" scoped>

</style>
