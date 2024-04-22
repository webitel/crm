<template>
  <timeline-container>
    <template #header>
      <timeline-header
        :list="dataList"
        :filtersNamespace="filtersNamespace"
      ></timeline-header>
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
        v-for="(day, idx) of dataList"
        :key="day.dateTimestamp"
        :day="day"
        :last-day="dataList.length - 1 === idx"
      ></day-timeline-row-section>
    </template>
  </timeline-container>

</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters';
import { useTableStore } from '@webitel/ui-sdk/src/modules/TableStoreModule/composables/useTableStore';
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

const {
  namespace,

  dataList,
  isLoading,
} = useTableStore(`${props.namespace}/timeline`);

const { filtersNamespace } = useTableFilters(namespace);

const darkMode = computed(() => store.getters['appearance/DARK_MODE']);
</script>

<style lang="scss" scoped>

</style>
