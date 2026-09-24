import { ref } from 'vue';
import { useRoute } from 'vue-router';

export const caseListParams = ref<Record<string, unknown> | null>(null);

export const caseNeighbors = ref({
	hasPrev: false,
	hasNext: false,
});

export const getCaseListQuery = (listParams: Record<string, unknown>) => ({
	list: JSON.stringify(listParams),
});

const parseCaseListQuery = (value: unknown) => {
	if (typeof value !== 'string') return null;
	try {
		return JSON.parse(value);
	} catch {
		return null;
	}
};

export const setCaseListParamsFromRoute = () => {
	const route = useRoute();
	caseListParams.value = parseCaseListQuery(route.query.list);
};
