import { ContactsAPI } from '@webitel/api-services/api';
import { createPinia, setActivePinia, storeToRefs } from 'pinia';

import { contactCustomFields } from '../../_internals/contactCustomFields';
import { useContactsDatalistStore } from '../contactsDatalistStore';

describe('useContactsDatalistStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it('exposes the configured columns', () => {
		const { headers } = storeToRefs(useContactsDatalistStore());

		const fields = headers.value.map((header) => header.field);
		expect(fields).toContain('name');
		expect(fields).toContain('labels');
	});

	it('starts with an empty, unloaded data list', () => {
		const store = useContactsDatalistStore();

		expect(store.dataList).toEqual([]);
		expect(store.isLoading).toBe(false);
	});

	it('passes contact extension fields to the list request', async () => {
		const fields = [
			{
				id: 'tee',
				kind: 'string' as const,
			},
		];
		contactCustomFields.value = fields;
		const getList = vi.spyOn(ContactsAPI, 'getList').mockResolvedValue({
			items: [],
			next: false,
		});

		const { loadDataList } = useContactsDatalistStore();
		await loadDataList();

		expect(getList).toHaveBeenCalledWith(
			expect.objectContaining({
				extensionFields: fields,
			}),
		);

		getList.mockRestore();
		contactCustomFields.value = [];
	});
});
