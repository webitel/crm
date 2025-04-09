import { FilterName } from '@webitel/ui-datalist/filters';

export const SearchMode = {
  Search: 'search',
  Fts: 'fts',
} as const satisfies FilterName;

export type SearchMode = (typeof SearchMode)[keyof typeof SearchMode];
