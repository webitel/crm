export const SearchMode = {
	Search: 'search',
	Fts: 'fts',
};

export type SearchMode = (typeof SearchMode)[keyof typeof SearchMode];
