import { createTestingPinia } from '@pinia/testing';
import { shallowMount } from '@vue/test-utils';

import { useCasesCardStore } from '../../stores/card/casesCardStore';
import { useCasesEditModeStore } from '../../stores/card/casesEditModeStore';
import OpenedCase from '../opened-case.vue';

const { patchMock } = vi.hoisted(() => ({
	patchMock: vi.fn(() => Promise.resolve({})),
}));

vi.mock('@webitel/api-services/api', async (importOriginal) => {
	const actual =
		await importOriginal<typeof import('@webitel/api-services/api')>();
	return {
		...actual,
		CasesAPI: {
			...actual.CasesAPI,
			patch: patchMock,
		},
	};
});

vi.mock('vue-router', async (importOriginal) => ({
	...(await importOriginal<typeof import('vue-router')>()),
	useRouter: () => ({
		push: vi.fn(),
		replace: vi.fn(() => Promise.resolve()),
	}),
}));

async function mountOpenedCase() {
	const wrapper = shallowMount(OpenedCase, {
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
	// let the card/extension-fields/userinfo initial async chains settle
	await new Promise((resolve) => setTimeout(resolve, 0));
	return wrapper;
}

describe('OpenedCase', () => {
	beforeEach(() => {
		patchMock.mockClear();
	});

	it('renders a component', async () => {
		const wrapper = await mountOpenedCase();
		expect(wrapper.isVisible()).toBe(true);
	});

	it('shows a "new" breadcrumb for a not-yet-created case', async () => {
		const wrapper = await mountOpenedCase();

		expect((wrapper.vm as any).path.at(-1)).toEqual({
			name: 'New',
		});
	});

	it('enables and disables edit mode', async () => {
		const wrapper = await mountOpenedCase();
		const editModeStore = useCasesEditModeStore();

		(wrapper.vm as any).toggleEditMode(true);
		expect(editModeStore.isEditMode).toBe(true);

		(wrapper.vm as any).toggleEditMode(false);
		expect(editModeStore.isEditMode).toBe(false);
	});

	it('turns edit mode off on unmount', async () => {
		const wrapper = await mountOpenedCase();
		const editModeStore = useCasesEditModeStore();

		(wrapper.vm as any).toggleEditMode(true);
		expect(editModeStore.isEditMode).toBe(true);

		wrapper.unmount();

		expect(editModeStore.isEditMode).toBe(false);
	});

	it('is not assignable to the current user until their contact is known', async () => {
		const wrapper = await mountOpenedCase();

		expect((wrapper.vm as any).isCaseAssignable).toBeFalsy();
	});

	it('is assignable when the case has no assignee yet, and stops being assignable once assigned', async () => {
		const wrapper = await mountOpenedCase();

		(wrapper.vm as any).userContact = {
			id: 'user-1',
			name: 'Current User',
		};
		await wrapper.vm.$nextTick();

		expect((wrapper.vm as any).isCaseAssignable).toBeTruthy();

		(wrapper.vm as any).itemInstance.assignee = {
			id: 'user-1',
			name: 'Current User',
		};
		await wrapper.vm.$nextTick();

		expect((wrapper.vm as any).isCaseAssignable).toBeFalsy();
	});

	it('assigns the case locally while it is still editable, without calling the API', async () => {
		const wrapper = await mountOpenedCase();

		(wrapper.vm as any).userContact = {
			id: 'user-1',
			name: 'Current User',
		};
		(wrapper.vm as any).itemInstance.custom = {};
		await wrapper.vm.$nextTick();

		await (wrapper.vm as any).assignCaseToMe();

		expect((wrapper.vm as any).itemInstance.assignee).toEqual({
			id: 'user-1',
			name: 'Current User',
		});
		expect(patchMock).not.toHaveBeenCalled();
	});

	it('assigns the case through the API once it is no longer editable', async () => {
		const wrapper = await mountOpenedCase();
		const cardStore = useCasesCardStore();
		cardStore.itemId = 'case-1';

		(wrapper.vm as any).userContact = {
			id: 'user-1',
			name: 'Current User',
		};
		(wrapper.vm as any).itemInstance.etag = 'etag-1';
		await wrapper.vm.$nextTick();

		await (wrapper.vm as any).assignCaseToMe();

		expect(patchMock).toHaveBeenCalledWith({
			changes: {
				assignee: {
					id: 'user-1',
					name: 'Current User',
				},
			},
			etag: 'etag-1',
		});
	});

	it('does nothing when trying to assign before the current user contact is known', async () => {
		const wrapper = await mountOpenedCase();

		await (wrapper.vm as any).assignCaseToMe();

		expect(patchMock).not.toHaveBeenCalled();
	});
});
