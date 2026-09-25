import { ref } from 'vue';
import { useRoute } from 'vue-router';

export const caseListParams = ref<Record<string, unknown> | null>(null);

export const caseNeighbors = ref({
	hasPrev: false,
	hasNext: false,
});

export const buildCaseListQuery = (listParams: Record<string, unknown>) => ({
	list: JSON.stringify(listParams),
});

export const setCaseListParamsFromRoute = () => {
	const { list } = useRoute().query;
	try {
		caseListParams.value = typeof list === 'string' ? JSON.parse(list) : null;
	} catch {
		caseListParams.value = null;
	}
};
