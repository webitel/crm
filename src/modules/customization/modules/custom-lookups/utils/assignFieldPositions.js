// non-readonly fields get sequential positions, readonly get null
export const assignFieldPositions = (item) => {
	let position = 1;

	return {
		...item,
		fields: (item.fields || []).map((field) => ({
			...field,
			position: field.readonly ? null : position++,
		})),
	};
};
