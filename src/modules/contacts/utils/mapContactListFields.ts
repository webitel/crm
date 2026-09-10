export const CONTACT_LIST_FIELDS = [
	'id',
	'etag',
	'mode',
	'name',
	'about',
	'labels',
	'groups',
	'managers',
	'timezones',
	'phones',
	'emails',
	'imclients',
	'user',
	'variables',
	'custom',
] as const;

const CONTACT_LIST_FIELDS_SET = new Set<string>(CONTACT_LIST_FIELDS);

export const mapContactListFields = (fields: string[] = []): string[] => {
	const mapped = new Set<string>();

	for (const field of fields) {
		if (!field) continue;

		if (field.startsWith('variables.')) {
			mapped.add('variables');
			continue;
		}

		if (field.startsWith('custom.') || !CONTACT_LIST_FIELDS_SET.has(field)) {
			mapped.add('custom');
			continue;
		}

		mapped.add(field);
	}

	return [
		...mapped,
	];
};
