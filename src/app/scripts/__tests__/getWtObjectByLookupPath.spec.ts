import { WtObject } from '@webitel/ui-sdk/enums';

import { getWtObjectByLookupPath } from '../getWtObjectByLookupPath';

describe('getWtObjectByLookupPath', () => {
	it('returns undefined when path is empty', () => {
		expect(getWtObjectByLookupPath()).toBeUndefined();
		expect(getWtObjectByLookupPath('')).toBeUndefined();
	});

	it('maps a known root path to its WtObject', () => {
		expect(getWtObjectByLookupPath('contacts')).toBe(WtObject.Contact);
		expect(getWtObjectByLookupPath('cases')).toBe(WtObject.Case);
	});

	it('ignores a leading slash', () => {
		expect(getWtObjectByLookupPath('/contacts')).toBe(WtObject.Contact);
	});

	it('uses only the root segment of a nested path', () => {
		expect(getWtObjectByLookupPath('dictionaries/cities')).toBe(
			WtObject.CustomLookup,
		);
	});

	it('returns undefined for an unknown root', () => {
		expect(getWtObjectByLookupPath('unknown-root')).toBeUndefined();
	});
});
