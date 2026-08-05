import { CaseTimelineAPI, ContactTimelineAPI } from '@webitel/api-services/api';
import { createTableStore } from '@webitel/ui-datalist';
import deepCopy from 'deep-copy';
import { defineStore, storeToRefs } from 'pinia';
import { computed, ref, toRaw } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { TimelineEventType } from '../enums/TimelineEventType';
import { TimelineMode } from '../enums/TimelineMode';
import { headers } from './_internals/headers';

export interface TimelineDay {
	id: number;
	dayTimestamp: number;
	callsCount: number;
	chatsCount: number;
	emailsCount: number;
	items: unknown[];
}

const ApiModeMap = {
	[TimelineMode.Contact]: ContactTimelineAPI,
	[TimelineMode.Case]: CaseTimelineAPI,
};

function listHandler(days) {
	const copy = deepCopy(days);
	if (!copy.length) return [];
	return copy.map((day) => ({
		...day,
		items: day.items.map((item) => ({
			...item[item.type || TimelineEventType.Chat],
			type: item.type || TimelineEventType.Chat,
			createdAt: item.createdAt,
		})),
	}));
}

const timelineApiModule = {
	// filtersManager stores filter values inside a reactive Map, so `type` here
	// is a reactive array proxy, not a plain array — strip that before it
	// leaves the store (axios params / deepmerge in the api client don't expect it).
	getList: async ({ mode, parentId, page, size, type }) => {
		const { days, next } = await ApiModeMap[mode].getList({
			parentId,
			page,
			size,
			...(type?.length
				? {
						type: toRaw(type),
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
		disablePersistence: true,
		isAppendDataList: true,
	},
);

export const useTimelineStore = defineStore('timeline', () => {
	const route = useRoute();
	const router = useRouter();
	const tableStore = useTimelineDataListStore();

	const { dataList, page, size, next, isLoading, filtersManager } =
		storeToRefs(tableStore);
	const { hasFilter, addFilter, updateFilter, updateSize, appendToDataList } =
		tableStore;

	const parentId = ref<string | null>(null);
	const mode = ref<TimelineMode | null>(null);
	const isLoadingMore = ref(false);

	const typeFilter = computed<TimelineEventType[]>(
		() =>
			(filtersManager.value.getFilter('type')?.value as TimelineEventType[]) ??
			[],
	);

	function restoreTypeFilterFromQuery(): TimelineEventType[] {
		const raw = route.query.type;
		if (raw === undefined) {
			return [
				TimelineEventType.Call,
				TimelineEventType.Chat,
				TimelineEventType.Email,
			];
		}
		return (
			Array.isArray(raw)
				? raw
				: [
						raw,
					]
		) as TimelineEventType[];
	}

	function setTypeFilter(value: TimelineEventType[]) {
		updateFilter({
			name: 'type',
			value,
		});
		return router.replace({
			name: route.name,
			query: {
				...route.query,
				type: value,
			},
		});
	}

	function getCounters(counterParentId: string) {
		return ApiModeMap[mode.value].getCounters({
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
		tableStore.$patch({
			dataList: [],
			page: 1,
			size: 15,
			next: false,
		});
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

		if (hasFilter('mode')) {
			updateFilter({
				name: 'mode',
				value: newMode,
			});
		} else {
			addFilter({
				name: 'mode',
				value: newMode,
			});
		}

		const restoredType = restoreTypeFilterFromQuery();
		if (hasFilter('type')) {
			updateFilter({
				name: 'type',
				value: restoredType,
			});
		} else {
			addFilter({
				name: 'type',
				value: restoredType,
			});
		}

		updateSize(15);

		return tableStore.initialize({
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
	};
});
