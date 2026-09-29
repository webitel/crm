import type { WebitelCasesCatalog } from '@webitel/api-services/gen/models';
import { findTreePath } from '@webitel/ui-sdk/utils';

// A catalog item is disabled when its catalog is, or any service above it is.
// https://webitel.atlassian.net/browse/WTEL-6057?focusedCommentId=655370
export const checkDisableState = (
	catalog: WebitelCasesCatalog,
	targetItem: {
		id?: string;
	},
): boolean => {
	if (!catalog.state) return true;

	const path = findTreePath(
		catalog.service,
		(service) => service.id === targetItem.id,
		'service',
	);
	if (!path) return false;

	// the item's own state is not what disables it — only its ancestors'
	return path.slice(0, -1).some((service) => !service.state);
};
