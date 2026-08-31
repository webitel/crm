import { createTestingPinia } from '@pinia/testing';
import { shallowMount } from '@vue/test-utils';
import { CrmSections } from '@webitel/ui-sdk/enums';

import { useContactsDatalistStore } from '../../stores/datalist/contactsDatalistStore';
import TheContacts from '../the-contacts.vue';

const { deleteMock } = vi.hoisted(() => ({
	deleteMock: vi.fn(() => Promise.resolve({})),
}));

vi.mock('@webitel/api-services/api', async (importOriginal) => {
	const actual =
		await importOriginal<typeof import('@webitel/api-services/api')>();
	return {
		...actual,
		ContactsAPI: {
			...actual.ContactsAPI,
			delete: deleteMock,
		},
	};
});

const { pushMock } = vi.hoisted(() => ({
	pushMock: vi.fn(),
}));

vi.mock('vue-router', async (importOriginal) => ({
	...(await importOriginal<typeof import('vue-router')>()),
	useRouter: () => ({
		push: pushMock,
		replace: vi.fn(() => Promise.resolve()),
	}),
}));

function mountTheContacts() {
	return shallowMount(TheContacts, {
		global: {
			plugins: [
				// a fresh instance per mount keeps each test's store state isolated,
				// while `stubActions: false` keeps real store logic (API calls, etc.) running
				createTestingPinia({
					stubActions: false,
				}),
			],
			stubs: {
				RouterLink: true,
				RouterView: true,
			},
		},
	});
}

describe('TheContacts', () => {
	beforeEach(() => {
		pushMock.mockClear();
		deleteMock.mockClear();
	});

	it('renders a component', () => {
		const wrapper = mountTheContacts();
		expect(wrapper.isVisible()).toBe(true);
	});

	it('unmounts without throwing', () => {
		const wrapper = mountTheContacts();
		expect(() => wrapper.unmount()).not.toThrow();
	});

	it('opens the create popup with no id preselected', () => {
		const wrapper = mountTheContacts();

		(wrapper.vm as any).create();

		expect((wrapper.vm as any).isContactPopup).toBe(true);
		expect((wrapper.vm as any).editedContactId).toBeNull();
	});

	it('opens the edit popup for the given contact id', () => {
		const wrapper = mountTheContacts();

		(wrapper.vm as any).edit({
			id: 'contact-1',
		});

		expect((wrapper.vm as any).isContactPopup).toBe(true);
		expect((wrapper.vm as any).editedContactId).toBe('contact-1');
	});

	it('resets the popup state on close', () => {
		const wrapper = mountTheContacts();

		(wrapper.vm as any).edit({
			id: 'contact-1',
		});
		(wrapper.vm as any).closeContactPopup();

		expect((wrapper.vm as any).isContactPopup).toBe(false);
		expect((wrapper.vm as any).editedContactId).toBeNull();
	});

	it('navigates to the new contact card once saved', () => {
		const wrapper = mountTheContacts();

		(wrapper.vm as any).saved('contact-1');

		expect(pushMock).toHaveBeenCalledWith({
			name: `${CrmSections.Contacts}-card`,
			params: {
				id: 'contact-1',
			},
		});
	});

	it('only counts rows with delete access as deletable', () => {
		const wrapper = mountTheContacts();
		const tableStore = useContactsDatalistStore();

		tableStore.$patch({
			selected: [
				{
					id: 'contact-1',
					mode: 'rwd',
				},
				{
					id: 'contact-2',
					mode: 'r',
				},
			],
		});

		expect((wrapper.vm as any).deletableSelectedItems).toEqual([
			{
				id: 'contact-1',
				mode: 'rwd',
			},
		]);
	});

	it('asks for confirmation scoped to deletable rows, then delegates to the store', async () => {
		const wrapper = mountTheContacts();
		const tableStore = useContactsDatalistStore();

		tableStore.$patch({
			selected: [
				{
					id: 'contact-1',
					mode: 'rwd',
				},
				{
					id: 'contact-2',
					mode: 'r',
				},
			],
		});

		(wrapper.vm as any).deleteSelectedItems();

		expect((wrapper.vm as any).isDeleteConfirmationPopup).toBe(true);
		expect((wrapper.vm as any).deleteCount).toBe(1);

		await (wrapper.vm as any).deleteCallback();

		expect(deleteMock).toHaveBeenCalledWith(
			expect.objectContaining({
				id: 'contact-1',
			}),
		);
		expect(deleteMock).not.toHaveBeenCalledWith(
			expect.objectContaining({
				id: 'contact-2',
			}),
		);
	});
});
