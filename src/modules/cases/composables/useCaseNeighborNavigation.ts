import { CasesAPI } from '@webitel/api-services/api';
import { LocateCaseNeighborDirection } from '@webitel/api-services/gen/models';
import type { Ref } from 'vue';
import { toRaw } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
	buildCaseListQuery,
	CASE_LIST_PARAMS_STATE_KEY,
	caseListParams,
} from '../stores/_internals/caseListNavigation';

export const useCaseNeighborNavigation = (itemId: Ref<unknown>) => {
	const route = useRoute();
	const router = useRouter();

	const goToNeighbor = async (direction: LocateCaseNeighborDirection) => {
		// history.pushState can't clone a reactive Proxy, vue-router then falls back to a full page reload
		// So we need this toRaw call
		const listParams = toRaw(caseListParams.value) ?? {};
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
			query: buildCaseListQuery(listParams),
			state: {
				[CASE_LIST_PARAMS_STATE_KEY]: listParams,
			},
		});
	};

	return {
		goToPrev: () => goToNeighbor(LocateCaseNeighborDirection.Prev),
		goToNext: () => goToNeighbor(LocateCaseNeighborDirection.Next),
	};
};
