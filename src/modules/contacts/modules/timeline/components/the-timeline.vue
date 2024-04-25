<template>
  <timeline-container>
    <template #header>
      <timeline-header
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

      <day-timeline-row
        v-for="({ dayTimestamp, callsCount, chatsCount, items }) of dataList"
        :key="dayTimestamp"
        :timestamp="dayTimestamp"
        :calls-count="callsCount"
        :chats-count="chatsCount"
        :tasks="items"
      />
    </template>
  </timeline-container>

</template>

<script setup>
import { computed, provide } from 'vue';
import { useStore } from 'vuex';
import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState';
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

const dataList = computed(() => getNamespacedState(store.state, timelineNamespace).dataList);
const isLoading = computed(() => getNamespacedState(store.state, timelineNamespace).isLoading);

function initializeList() {
  return store.dispatch(`${timelineNamespace}/INITIALIZE_LIST`);
}

// TODO: uncomment me after fixing filters module
// initializeList();
</script>

<style lang="scss" scoped>

</style>
