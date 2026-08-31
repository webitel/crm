import { createTestingPinia } from '@pinia/testing';
import { shallowMount } from '@vue/test-utils';
import { CrmSections } from '@webitel/ui-sdk/enums';

import { CONTACT_VIEW_NAME } from '../../router/contactViewName';
import OpenedContactTabs from '../opened-contact-tabs.vue';

const { getExtensionFieldsMock } = vi.hoisted(() => ({
	getExtensionFieldsMock: vi.fn(() => Promise.resolve({})),
}));

vi.mock('@webitel/api-services/api', async (importOriginal) => {
	const actual =
		await importOriginal<typeof import('@webitel/api-services/api')>();
	return {
		...actual,
		WtTypeExtensionAPI: {
			...actual.WtTypeExtensionAPI,
			get: getExtensionFieldsMock,
		},
	};
});

const { routeMock } = vi.hoisted(() => ({
	routeMock: {
		name: 'crm-contacts-card-timeline' as string,
		matched: [] as {
			name?: string;
		}[],
	},
}));

vi.mock('vue-router', async (importOriginal) => ({
	...(await importOriginal<typeof import('vue-router')>()),
	useRoute: () => routeMock,
}));

function mountOpenedContactTabs() {
	return shallowMount(OpenedContactTabs, {
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

describe('OpenedContactTabs', () => {
	beforeEach(() => {
		routeMock.name = 'crm-contacts-card-timeline';
		getExtensionFieldsMock.mockReset();
		getExtensionFieldsMock.mockResolvedValue({});
	});

	it('renders a component', async () => {
		const wrapper = mountOpenedContactTabs();
		await new Promise((resolve) => setTimeout(resolve, 0));
		expect(wrapper.isVisible()).toBe(true);
	});

	it('shows the base tabs, without cases or details, by default', async () => {
		const wrapper = mountOpenedContactTabs();
		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(
			(wrapper.vm as any).tabs.map((tab: { value: string }) => tab.value),
		).toEqual([
			'timeline',
			'communications',
			'variables',
			'permissions',
		]);
	});

	it('adds a details tab once custom fields are loaded for the contact', async () => {
		getExtensionFieldsMock.mockResolvedValue({
			fields: [
				{
					id: 'field-1',
				},
			],
		});
		const wrapper = mountOpenedContactTabs();
		await new Promise((resolve) => setTimeout(resolve, 0));
		await wrapper.vm.$nextTick();

		expect(
			(wrapper.vm as any).tabs.map((tab: { value: string }) => tab.value),
		).toEqual([
			'timeline',
			'communications',
			'variables',
			'details',
			'permissions',
		]);
	});

	it('points tabs at the contact-view route names while inside a contact view', async () => {
		routeMock.name = `${CONTACT_VIEW_NAME}-something`;
		const wrapper = mountOpenedContactTabs();
		await new Promise((resolve) => setTimeout(resolve, 0));

		expect((wrapper.vm as any).tabs[0].pathName).toBe(
			`${CONTACT_VIEW_NAME}-timeline`,
		);
	});

	it('points tabs at the contacts-section route names outside of a contact view', async () => {
		routeMock.name = 'some-other-route';
		const wrapper = mountOpenedContactTabs();
		await new Promise((resolve) => setTimeout(resolve, 0));

		expect((wrapper.vm as any).tabs[0].pathName).toBe(
			`${CrmSections.Contacts}-timeline`,
		);
	});
});
