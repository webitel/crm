import type { WtTableHeader } from '@webitel/ui-sdk/src/components/wt-table/types/WtTable.d.ts';
import type { SortSymbols } from '@webitel/ui-sdk/src/scripts/sortQueryAdapters.js';

// TODO(types): the ui-sdk WtTableHeader declaration lags behind actual
// wt-table/datalist usage: headers carry a server-side `field` key,
// SortSymbols-based `sort` values, and pluralizable `[key, count]` locales.
// Drop this extension once ui-sdk ships an up-to-date WtTableHeader.
export type TableHeader = Omit<WtTableHeader, 'sort' | 'locale'> & {
	field: string;
	sort?: WtTableHeader['sort'] | (typeof SortSymbols)[keyof typeof SortSymbols];
	locale?:
		| string
		| [
				string,
		  ]
		| [
				string,
				number,
		  ];
	shouldBeInitialized?: boolean;
};
