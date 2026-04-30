import deepCopy from 'deep-copy';

interface SortableField {
	position: number;
	[key: string]: unknown;
}

interface SortableItem {
	fields: SortableField[];
	[key: string]: unknown;
}

const sortFields = (item: SortableItem) => {
	const unSortableFields = item.fields.filter((field) => !field.position);

	const fields = deepCopy(item.fields)
		.filter((field) => field.position)
		.sort((a, b) => {
			return a.position - b.position;
		});

	fields.splice(1, 0, ...unSortableFields);

	return {
		...item,
		fields,
	};
};

export default sortFields;
