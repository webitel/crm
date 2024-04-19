<template>
  <timeline-container>
    <template #header>
      <timeline-header
        v-if="isShowHeader"
        :filtersNamespace="filtersNamespace"
        :namespace="namespace"
      ></timeline-header>
    </template>

    <template #content>
      <wt-loader
        v-if="isLoading"
      />

      <wt-dummy
        v-else-if="isEmptyDataList"
        :src="darkMode ? dummyDark : dummyLight"
      />

      <timeline-day
        v-for="(day, idx) of dataList"
        :key="day.dateTimestamp"
        :day="day"
        :last-day="dataList.length - 1 === idx"
      ></timeline-day>
    </template>
  </timeline-container>

</template>

<script setup>
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters';
import { useTableStore } from '@webitel/ui-sdk/src/modules/TableStoreModule/composables/useTableStore';
import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState';
import { computed } from 'vue';
import { useStore } from 'vuex';
import TimelineContainer from './timeline-container.vue';
import dummyDark from '../assets/timeline-dummy-dark.svg';
import dummyLight from '../assets/timeline-dummy-light.svg';
import TimelineDay from './day-row/day-timeline-row-section.vue';
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

const isEmptyDataList = computed(() => !dataList.value.length);
const darkMode = computed(() => store.getters['appearance/DARK_MODE']);
const activeFilterTypes = computed(() => getNamespacedState(store.state, filtersNamespace).type.value);
const isShowHeader = computed(() => !isEmptyDataList.value || (isEmptyDataList.value && activeFilterTypes.value));
</script>

<style lang="scss" scoped>

</style>
