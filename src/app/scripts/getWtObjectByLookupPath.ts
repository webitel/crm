import { WtObject } from '@webitel/ui-sdk/enums';

// Map lookup path root (e.g. "contacts", "dictionaries/cities") to WtObject
const lookupRootPathToWtObject: Record<string, WtObject> = {
	contacts: WtObject.Contact,
	users: WtObject.User,
	calendars: WtObject.Calendar,
	cases: WtObject.Case,
	dictionaries: WtObject.CustomLookup,
};

export const getWtObjectByLookupPath = (
	path?: string,
): WtObject | undefined => {
	if (!path) return undefined;

	const [root] = path.replace(/^\//, '').split('/');

	return lookupRootPathToWtObject[root];
};
