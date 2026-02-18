// https://webitel.atlassian.net/browse/WTEL-6057?focusedCommentId=655370
export const checkDisableState = (catalog, targetItem) => {
	const findServicePath = (serviceList, rootId) => {
		for (const service of serviceList) {
			// we didn't need add to pah for target item
			if (service.id === targetItem.id) {
				return [];
			}

			// If we found path to root item we return it
			if (service.id === rootId)
				return [
					service,
				];

			// Find path to root item in children
			if (service.service) {
				const path = findServicePath(service.service, rootId);
				if (path)
					return [
						service,
						...path,
					];
			}
		}
		return null;
	};

	if (!catalog.state) return true;
	const path = findServicePath(catalog.service, targetItem.id);

	if (!path) return false;

	return path.some((service) => !service.state);
};
