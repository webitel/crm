<template>
  <timeline-container class="the-timeline">
    <template #header>
      <timeline-header
        v-if="parentId"
        :list="dataList"
        :parent-id="parentId"
        :filters-namespace="filtersNamespace"
      />
    </template>

    <template #content>
      <div
        v-if="isLoading"
        class="loader-wrapper"
      >
        <wt-loader />
      </div>

      <wt-dummy
        v-else-if="!dataList.length"
        :src="darkMode ? dummyDark : dummyLight"
      />

      <day-timeline-row
        v-for="({ dayTimestamp, callsCount, chatsCount, emailsCount, items }, key) of dataList"
        v-else
        :key="dayTimestamp"
        :timestamp="dayTimestamp"
        :calls-count="callsCount"
        :chats-count="chatsCount"
        :emails-count="emailsCount"
        :tasks="items"
        :first="!key"
        :last="!next && key === dataList.length - 1"
      />

    </template>

    <template #after-content>
      <wt-intersection-observer
        :canLoadMore="next"
        :loading="nextLoading"
        @next="loadNext"
      />
    </template>
  </timeline-container>
</template>

<script lang="ts" setup>
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters.js';
import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState';
import { computed, onUnmounted, provide, ref } from 'vue';
import { useStore } from 'vuex';

import dummyDark from '../assets/timeline-dummy-dark.svg';
import dummyLight from '../assets/timeline-dummy-light.svg';
import DayTimelineRow from './day-row/day-timeline-row.vue';
import TimelineContainer from './timeline-container.vue';
import TimelineHeader from './timeline-header.vue';

interface Props {
	parentId: string;
	mode: TimelineMode;
}

const props = defineProps<Props>();

const timelineNamespace = 'timeline';

provide<TimelineMode>('mode', props.mode);
provide('namespace', timelineNamespace);

const store = useStore();

const darkMode = computed(() => store.getters['appearance/DARK_MODE']);

const dataList = computed(
	() => getNamespacedState(store.state, timelineNamespace).dataList,
);
const isLoading = computed(
	() => getNamespacedState(store.state, timelineNamespace).isLoading,
);
const next = computed(
	() => getNamespacedState(store.state, timelineNamespace).next,
);

const setParentId = (parentId) => {
	return store.commit(`${timelineNamespace}/SET`, {
		path: 'parentId',
		value: parentId,
	});
};
const setMode = (mode) => {
	return store.commit(`${timelineNamespace}/SET`, {
		path: 'mode',
		value: mode,
	});
};

setParentId(props.parentId);
setMode(props.mode);

function initializeList() {
	return store.dispatch(`${timelineNamespace}/INITIALIZE_LIST`);
}

const {
	namespace: filtersNamespace,
	subscribe,
	flushSubscribers,
	restoreFilters,
} = useTableFilters(timelineNamespace);

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

onUnmounted(() => {
	flushSubscribers();

	/* https://webitel.atlassian.net/browse/WTEL-4843 */
	/* Store must be reset to prevent multiple calls TimelineAPI */
	/* Caching doesn't work because of this code, a fix later. See the task for more details */

	store.dispatch(`${timelineNamespace}/RESET_STATE`);
});
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
