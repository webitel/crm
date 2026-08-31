import { createTestingPinia } from '@pinia/testing';
import { shallowMount } from '@vue/test-utils';

import { useContactCardStore } from '../../stores/card/contactCardStore';
import OpenedContact from '../opened-contact.vue';

const { deleteMock, getMock } = vi.hoisted(() => ({
	deleteMock: vi.fn(() => Promise.resolve({})),
	getMock: vi.fn(() => Promise.resolve({})),
}));

vi.mock('@webitel/api-services/api', async (importOriginal) => {
	const actual =
		await importOriginal<typeof import('@webitel/api-services/api')>();
	return {
		...actual,
		ContactsAPI: {
			...actual.ContactsAPI,
			delete: deleteMock,
			get: getMock,
		},
	};
});

const { pushMock, routeMock } = vi.hoisted(() => ({
	pushMock: vi.fn(),
	routeMock: {
		params: {} as Record<string, string>,
	},
}));

vi.mock('vue-router', async (importOriginal) => ({
	...(await importOriginal<typeof import('vue-router')>()),
	useRoute: () => routeMock,
	useRouter: () => ({
		push: pushMock,
		replace: vi.fn(() => Promise.resolve()),
	}),
}));

function mountOpenedContact() {
	return shallowMount(OpenedContact, {
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

describe('OpenedContact', () => {
	beforeEach(() => {
		pushMock.mockClear();
		deleteMock.mockClear();
		getMock.mockClear();
		routeMock.params = {};
	});

	it('renders a component', async () => {
		const wrapper = mountOpenedContact();
		await new Promise((resolve) => setTimeout(resolve, 0));
		expect(wrapper.isVisible()).toBe(true);
	});

	it('falls back to a generic breadcrumb name before the contact loads', async () => {
		const wrapper = mountOpenedContact();
		await new Promise((resolve) => setTimeout(resolve, 0));

		expect((wrapper.vm as any).path.at(-1).name).toBe('Contact');
	});

	it("uses the contact's common name in the breadcrumb once loaded", async () => {
		const wrapper = mountOpenedContact();
		await new Promise((resolve) => setTimeout(resolve, 0));

		(wrapper.vm as any).originalItemInstance = {
			id: 'contact-1',
			name: {
				commonName: 'Jest Doe',
			},
		};
		await wrapper.vm.$nextTick();

		expect((wrapper.vm as any).path.at(-1).name).toBe('Jest Doe');
	});

	it('deletes the contact through the API and navigates back to the list', async () => {
		const wrapper = mountOpenedContact();
		await new Promise((resolve) => setTimeout(resolve, 0));
		const cardStore = useContactCardStore();
		cardStore.itemId = 'contact-1';

		await (wrapper.vm as any).deleteContact();

		expect(deleteMock).toHaveBeenCalledWith({
			id: 'contact-1',
		});
		expect(pushMock).toHaveBeenCalledWith({
			name: 'contacts',
		});
	});

	it('closes the popup and reloads the contact once saved', async () => {
		const wrapper = mountOpenedContact();
		await new Promise((resolve) => setTimeout(resolve, 0));
		const cardStore = useContactCardStore();
		cardStore.itemId = 'contact-1';
		(wrapper.vm as any).isContactPopup = true;
		getMock.mockClear();

		await (wrapper.vm as any).onContactSaved();

		expect((wrapper.vm as any).isContactPopup).toBe(false);
		expect(getMock).toHaveBeenCalledWith(
			expect.objectContaining({
				itemId: 'contact-1',
			}),
		);
	});
});
