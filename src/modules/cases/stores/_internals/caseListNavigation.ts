import { ref } from 'vue';
import type { HistoryState } from 'vue-router';
import { useRoute } from 'vue-router';

export const CASE_LIST_PARAMS_STATE_KEY = 'caseListParams';

export const caseListParams = ref<HistoryState | null>(null);

export const caseNeighbors = ref({
	hasPrev: false,
	hasNext: false,
});

export const buildCaseListQuery = (listParams: HistoryState) => ({
	list: JSON.stringify(listParams),
});

const parseListQuery = (list: unknown): HistoryState | null => {
	try {
		return typeof list === 'string' ? JSON.parse(list) : null;
	} catch {
		return null;
	}
};

export const setCaseListParamsFromRoute = () => {
	const listParams =
		parseListQuery(useRoute().query.list) ??
		history.state?.[CASE_LIST_PARAMS_STATE_KEY] ??
		null;

	caseListParams.value = listParams;

	if (listParams) {
		history.replaceState(
			{
				...history.state,
				[CASE_LIST_PARAMS_STATE_KEY]: listParams,
			},
			'',
		);
	}
};
