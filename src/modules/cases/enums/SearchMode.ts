import type { FilterName } from '@webitel/ui-datalist/filters';

export const SearchMode = {
	Search: 'search',
	Fts: 'fts',
} as const satisfies Record<string, FilterName>;

export type SearchMode = (typeof SearchMode)[keyof typeof SearchMode];
