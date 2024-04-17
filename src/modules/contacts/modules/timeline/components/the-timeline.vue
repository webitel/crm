<template>
  <div class="timeline">
    <timeline-header
      v-if="isShowHeader"
      :namespace="namespace"
      :filtersNamespace="filtersNamespace"
    ></timeline-header>

    <wt-dummy
      v-if="!isLoading && isEmptyDataList"
      :src="darkMode ? dummyDark : dummyLight"
    />

    <div class="timeline__wrapper">
      <timeline-day
        v-for="(day, idx) of dataList"
        :key="idx"
        :day="day"
        :is-last-day="dataList.length - 1 === idx"
      ></timeline-day>
    </div>
  </div>

</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters';
import { useTableStore } from '@webitel/ui-sdk/src/modules/TableStoreModule/composables/useTableStore';
import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState';
import TimelineHeader from './timeline-header.vue';
import TimelineDay from './timeline-day.vue';
import dummyLight from '../assets/timeline-dummy-light.svg';
import dummyDark from '../assets/timeline-dummy-dark.svg';

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
.timeline {
  display: flex;
  flex-direction: column;

  &__wrapper {
    @extend %wt-scrollbar;
    overflow: auto;
    padding: var(--spacing-sm);
  }
}
</style>
