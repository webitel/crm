import { TimelineAPI } from '@webitel/api-services/api';
import { createTableStore } from '@webitel/ui-datalist';
import deepCopy from 'deep-copy';
import { defineStore, storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { TimelineEventType } from '../enums/TimelineEventType';
import type { TimelineMode } from '../enums/TimelineMode';
import { headers } from './_internals/headers';

export interface TimelineDay {
	id: number;
	dayTimestamp: number;
	callsCount: number;
	chatsCount: number;
	emailsCount: number;
	items: unknown[];
}

export function listHandler(days) {
	const copy = deepCopy(days);
	if (!copy.length) return [];
	return copy.map((day) => ({
		...day,
		items: day.items
			.map((item) => ({
				...item[item.type || TimelineEventType.Chat],
				type: item.type || TimelineEventType.Chat,
				createdAt: item.createdAt,
			}))
			.filter((item) => typeof item.id === 'string'),
	}));
}

export const useTimelineStore = defineStore('timeline', () => {
	const parentId = ref<string | null>(null);
	const mode = ref<TimelineMode | null>(null);
	const isLoadingMore = ref(false);

	/*
   `mode` addresses the API entity for the record currently open — it must
    never come from persisted filter state (a restored value would belong to
    whichever record was open last). Captured by closure instead of added to
    filtersManager, so only `type` rides the standard nested-list persistence

   [WTEL-10404](https://webitel.atlassian.net/browse/WTEL-10404)
   */
	const timelineApiModule = {
		getList: async ({
			parentId: reqParentId,
			page,
			size,
			type,
		}: {
			parentId: string;
			page: number;
			size: number;
			type?: TimelineEventType[];
		}) => {
			const { days, next } = await TimelineAPI.getList({
				entity: mode.value,
				parentId: reqParentId,
				page,
				size,
				...(type?.length
					? {
							type,
						}
					: {}),
			});
			return {
				items: listHandler(days).map((day) => ({
					...day,
					id: day.dayTimestamp,
				})),
				next,
			};
		},
	};

	const useTimelineDataListStore = createTableStore<TimelineDay>(
		'timelineDataList',
		{
			apiModule: timelineApiModule,
			headers,
			isAppendDataList: true,
		},
	);
	const tableStore = useTimelineDataListStore();

	const { dataList, page, size, next, isLoading, filtersManager } =
		storeToRefs(tableStore);
	const {
		hasFilter,
		addFilter,
		updateFilter,
		updateSize,
		appendToDataList,
		$patch,
		initialize: initializeTable,
	} = tableStore;

	const typeFilter = computed<TimelineEventType[]>(
		() =>
			(filtersManager.value.getFilter('type')?.value as TimelineEventType[]) ??
			[],
	);

	function setTypeFilter(value: TimelineEventType[]) {
		updateFilter({
			name: 'type',
			value,
		});
	}

	function getCounters(counterParentId: string) {
		return TimelineAPI.getCounters({
			entity: mode.value,
			parentId: counterParentId,
		});
	}

	async function loadNext() {
		if (!next.value) return;
		isLoadingMore.value = true;
		try {
			await appendToDataList();
		} finally {
			isLoadingMore.value = false;
		}
	}

	function resetState() {
		$patch({
			dataList: [],
			page: 1,
			size: 15,
			next: false,
		});
	}

	function removeTranscript({ taskId, id }: { taskId: string; id: string }) {
		const items = dataList.value.flatMap((day) => day.items) as Array<{
			id?: string;
			transcripts?: Array<{
				id?: string;
			}>;
		}>;
		const task = items.find((item) => item.id === taskId);
		if (!task?.transcripts) return;
		task.transcripts = task.transcripts.filter(
			(transcript) => transcript.id !== id,
		);
	}

	function initialize({
		parentId: newParentId,
		mode: newMode,
	}: {
		parentId: string;
		mode: TimelineMode;
	}) {
		parentId.value = newParentId;
		mode.value = newMode;

		/*
     seeded before initializeTable() restores persisted state below, so a
      value restored from sessionStorage (if any) wins over this default
     */
		if (!hasFilter('type')) {
			addFilter({
				name: 'type',
				value: [
					TimelineEventType.Call,
					TimelineEventType.Chat,
					TimelineEventType.Email,
				],
			});
		}

		updateSize(15);

		return initializeTable({
			parentId: newParentId,
		});
	}

	return {
		parentId,
		mode,
		dataList,
		page,
		size,
		next,
		// false while appendToDataList (loadNext) is in flight, even though the underlying
		// table store's own isLoading flips true for both the initial load and appends
		isLoading: computed(() => isLoading.value && !isLoadingMore.value),
		isLoadingMore: computed(() => isLoadingMore.value),
		typeFilter,
		initialize,
		loadNext,
		resetState,
		setTypeFilter,
		getCounters,
		removeTranscript,
	};
});
