import { createTestingPinia } from '@pinia/testing';
import { shallowMount } from '@vue/test-utils';
import { CrmSections } from '@webitel/ui-sdk/enums';

import { CASE_VIEW_NAME } from '../../router/caseViewName';
import { caseCustomFields } from '../../stores/_internals/caseCustomFields';
import { useCasesCardStore } from '../../stores/card/casesCardStore';
import OpenedCaseTabs from '../opened-case-tabs.vue';

const { routeMock } = vi.hoisted(() => ({
	routeMock: {
		name: 'crm-cases-case-info' as string,
		matched: [] as {
			name?: string;
		}[],
	},
}));

vi.mock('vue-router', async (importOriginal) => ({
	...(await importOriginal<typeof import('vue-router')>()),
	useRoute: () => routeMock,
}));

function mountOpenedCaseTabs() {
	return shallowMount(OpenedCaseTabs, {
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

describe('OpenedCaseTabs', () => {
	beforeEach(() => {
		routeMock.name = 'crm-cases-case-info';
	});

	afterEach(() => {
		// `caseCustomFields` is a module-level singleton ref, not pinia state,
		// so it survives across a fresh testing pinia and must be reset by hand.
		caseCustomFields.value = [];
	});

	it('renders a component', () => {
		const wrapper = mountOpenedCaseTabs();
		expect(wrapper.isVisible()).toBe(true);
	});

	it('shows only the base tabs for a not-yet-created case with no custom fields', () => {
		const wrapper = mountOpenedCaseTabs();

		expect(
			(wrapper.vm as any).tabs.map((tab: { value: string }) => tab.value),
		).toEqual([
			'case-info',
			'result',
			'attachments',
		]);
	});

	it('adds the timeline and permissions tabs once the case exists', () => {
		const wrapper = mountOpenedCaseTabs();
		useCasesCardStore().itemId = 'case-1';

		expect(
			(wrapper.vm as any).tabs.map((tab: { value: string }) => tab.value),
		).toEqual([
			'case-info',
			'result',
			'attachments',
			'timeline',
			'permissions',
		]);
	});

	it('adds the details tab, between the base tabs and permissions, when custom fields exist', () => {
		const wrapper = mountOpenedCaseTabs();
		useCasesCardStore().itemId = 'case-1';
		caseCustomFields.value = [
			{
				id: 'field-1',
			},
		] as any;

		expect(
			(wrapper.vm as any).tabs.map((tab: { value: string }) => tab.value),
		).toEqual([
			'case-info',
			'result',
			'attachments',
			'timeline',
			'details',
			'permissions',
		]);
	});

	it('points tabs at the case-view route names while inside a case view', () => {
		routeMock.name = `${CASE_VIEW_NAME}-something`;
		const wrapper = mountOpenedCaseTabs();

		expect((wrapper.vm as any).tabs[0].pathName).toBe(
			`${CASE_VIEW_NAME}-case-info`,
		);
	});

	it('points tabs at the cases-section route names outside of a case view', () => {
		routeMock.name = 'some-other-route';
		const wrapper = mountOpenedCaseTabs();

		expect((wrapper.vm as any).tabs[0].pathName).toBe(
			`${CrmSections.Cases}-case-info`,
		);
	});
});
