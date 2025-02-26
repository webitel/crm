export type SearchModeType = 'search' | 'fts';
interface SearchMode {
  [key: string]: SearchModeType;
}

export const SearchMode: SearchMode = {
  Search: 'search',
  Fts: 'fts',
} as const;
