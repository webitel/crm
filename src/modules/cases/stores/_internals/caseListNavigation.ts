import { CasesAPI } from '@webitel/api-services/api';
import { LocateCaseNeighborDirection } from '@webitel/api-services/gen/models';
import { type Ref, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

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

export const useCaseNeighborNavigation = (itemId: Ref<unknown>) => {
	const route = useRoute();
	const router = useRouter();

	const goToNeighbor = async (direction: LocateCaseNeighborDirection) => {
		const listParams = caseListParams.value ?? {};
		const { id } = await CasesAPI.getNeighbor({
			itemId: String(itemId.value),
			direction,
			listParams,
		});
		return router.push({
			name: route.name,
			params: {
				...route.params,
				id,
			},
			query: getCaseListQuery(listParams),
		});
	};

	return {
		goToPrev: () => goToNeighbor(LocateCaseNeighborDirection.Prev),
		goToNext: () => goToNeighbor(LocateCaseNeighborDirection.Next),
	};
};
