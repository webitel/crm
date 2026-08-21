<template>
  <timeline-container class="the-timeline">
    <template #header>
      <timeline-header
        v-if="parentId"
        :list="dataList"
        :parent-id="parentId"
      />
    </template>

    <template #content>
      <wt-empty
        v-show="showEmpty"
        :image="imageEmpty"
      />

      <div
        v-show="isLoading"
        class="loader-wrapper"
      >
        <wt-loader />
      </div>

      <div
        v-show="!isLoading && dataList.length"
        class="the-timeline__days"
      >
        <day-timeline-row
          v-for="({ dayTimestamp, callsCount, chatsCount, emailsCount, items }, key) of dataList"
          :key="dayTimestamp"
          :timestamp="dayTimestamp"
          :calls-count="callsCount"
          :chats-count="chatsCount"
          :emails-count="emailsCount"
          :tasks="items"
          :first="!key"
          :last="!next && key === dataList.length - 1"
        />
      </div>
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
import { useTableEmpty } from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty';
import { storeToRefs } from 'pinia';
import { computed, onUnmounted, ref } from 'vue';
import dummyDark from '../assets/timeline-dummy-dark.svg';
import dummyLight from '../assets/timeline-dummy-light.svg';
import type { TimelineMode } from '../enums/TimelineMode';
import { useTimelineStore } from '../stores/timeline';
import DayTimelineRow from './day-row/day-timeline-row.vue';
import TimelineContainer from './timeline-container.vue';
import TimelineHeader from './timeline-header.vue';

interface Props {
	parentId: string;
	mode: TimelineMode;
}

const props = defineProps<Props>();

const timelineStore = useTimelineStore();
const { dataList, isLoading, next } = storeToRefs(timelineStore);
const { initialize, loadNext: loadNextPage, resetState } = timelineStore;

const { showEmpty, image: imageEmpty } = useTableEmpty(
	{
		dataList,
		isLoading,
	},
	computed(() => ({
		image: {
			empty: {
				dark: dummyDark,
				light: dummyLight,
			},
		},
	})),
);

initialize({
	parentId: props.parentId,
	mode: props.mode,
});

const nextLoading = ref(false);

async function loadNext() {
	nextLoading.value = true;
	try {
		await loadNextPage();
	} finally {
		nextLoading.value = false;
	}
}

onUnmounted(() => {
	/* https://webitel.atlassian.net/browse/WTEL-4843 */
	/* Store must be reset to prevent multiple calls TimelineAPI */
	/* Caching doesn't work because of this code, a fix later. See the task for more details */

	resetState();
});
</script>

<style lang="scss" scoped>
.wt-empty {
  height: 100%;
}

.loader-wrapper {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
