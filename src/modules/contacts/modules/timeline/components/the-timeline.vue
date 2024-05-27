<template>
  <timeline-container class="the-timeline">
    <template #header>
      <timeline-header
        :list="dataList"
        :contact-id="contactId"
        :filters-namespace="filtersNamespace"
      />
    </template>

    <template #content>
      <div
        class="loader-wrapper"
        v-if="isLoading"
      >
        <wt-loader />
      </div>

      <wt-dummy
        v-else-if="!dataList.length"
        :src="darkMode ? dummyDark : dummyLight"
      />

      <day-timeline-row
        v-else
        v-for="({ dayTimestamp, callsCount, chatsCount, items }, key) of dataList"
        :key="dayTimestamp"
        :timestamp="dayTimestamp"
        :calls-count="callsCount"
        :chats-count="chatsCount"
        :tasks="items"
        :first="!key"
        :last="!next && key === dataList.length - 1"
      />
    </template>

    <template #after-content>
      <timeline-intersection-observer
        :next="next"
        :loading="nextLoading"
        @next="loadNext"
      />
    </template>
  </timeline-container>

</template>

<script setup>
import { computed, onUnmounted, provide, ref } from 'vue';
import { useStore } from 'vuex';
import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState';
import {
  useTableFilters
} from '../../../../../../../webitel-ui-sdk/src/modules/Filters/composables/useTableFilters.js';
import TimelineIntersectionObserver from './utils/timeline-intersection-observer.vue';
import DayTimelineRow from './day-row/day-timeline-row.vue';
import TimelineContainer from './timeline-container.vue';
import dummyDark from '../assets/timeline-dummy-dark.svg';
import dummyLight from '../assets/timeline-dummy-light.svg';
import TimelineHeader from './timeline-header.vue';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const timelineNamespace = `${props.namespace}/timeline`;

provide('namespace', timelineNamespace);

const store = useStore();

const darkMode = computed(() => store.getters['appearance/DARK_MODE']);
const contactId = computed(() => store.getters[`${timelineNamespace}/PARENT_ID`]);

const dataList = computed(() => getNamespacedState(store.state, timelineNamespace).dataList);
const isLoading = computed(() => getNamespacedState(store.state, timelineNamespace).isLoading);
const next = computed(() => getNamespacedState(store.state, timelineNamespace).next);

function initializeList() {
  return store.dispatch(`${timelineNamespace}/INITIALIZE_LIST`);
}

const {
  namespace: filtersNamespace,
  subscribe,
  flushSubscribers,
  restoreFilters,
} = useTableFilters(timelineNamespace);

onUnmounted(() => {
  flushSubscribers();
});

subscribe({
  event: '*',
  callback: initializeList,
});

restoreFilters();

const nextLoading = ref(false);

async function loadNext() {
  nextLoading.value = true;
  await store.dispatch(`${timelineNamespace}/LOAD_NEXT`);
  nextLoading.value = false;
}
</script>

<style lang="scss" scoped>
.wt-dummy {
  height: 100%;
}

.loader-wrapper {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
