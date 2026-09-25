import { CasesAPI } from '@webitel/api-services/api';
import { LocateCaseNeighborDirection } from '@webitel/api-services/gen/models';
import type { Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
	caseListParams,
	getCaseListQuery,
} from '../stores/_internals/caseListNavigation';

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
