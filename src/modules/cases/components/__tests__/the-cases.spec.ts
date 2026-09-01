import { createTestingPinia } from '@pinia/testing';
import { shallowMount } from '@vue/test-utils';
import { CrmSections, IconAction } from '@webitel/ui-sdk/enums';

import { useCasesEditModeStore } from '../../stores/card/casesEditModeStore';
import { useCasesDatalistStore } from '../../stores/datalist/casesDatalistStore';
import TheCases from '../the-cases.vue';

const { exportDataMock, downloadFileMock, deleteMock } = vi.hoisted(() => ({
	exportDataMock: vi.fn(() =>
		Promise.resolve({
			response: 'file-contents',
		}),
	),
	downloadFileMock: vi.fn(),
	deleteMock: vi.fn(() => Promise.resolve({})),
}));

vi.mock('@webitel/api-services/api', async (importOriginal) => {
	const actual =
		await importOriginal<typeof import('@webitel/api-services/api')>();
	return {
		...actual,
		CasesAPI: {
			...actual.CasesAPI,
			exportData: exportDataMock,
			delete: deleteMock,
		},
	};
});

vi.mock('@webitel/ui-sdk/scripts', async (importOriginal) => {
	const actual =
		await importOriginal<typeof import('@webitel/ui-sdk/scripts')>();
	return {
		...actual,
		downloadFile: downloadFileMock,
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

function mountTheCases() {
	return shallowMount(TheCases, {
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

describe('TheCases', () => {
	beforeEach(() => {
		pushMock.mockClear();
		exportDataMock.mockClear();
		downloadFileMock.mockClear();
		deleteMock.mockClear();
	});

	it('renders a component', () => {
		const wrapper = mountTheCases();
		expect(wrapper.isVisible()).toBe(true);
	});

	it('unmounts without throwing', () => {
		const wrapper = mountTheCases();
		expect(() => wrapper.unmount()).not.toThrow();
	});

	it('navigates to a new case card on add', () => {
		const wrapper = mountTheCases();

		(wrapper.vm as any).add();

		expect(pushMock).toHaveBeenCalledWith({
			name: `${CrmSections.Cases}-card`,
			params: {
				id: 'new',
			},
		});
	});

	it('enables edit mode and navigates to the case card on edit', () => {
		const wrapper = mountTheCases();
		const editModeStore = useCasesEditModeStore();

		(wrapper.vm as any).edit({
			id: 'case-1',
		});

		expect(editModeStore.isEditMode).toBe(true);
		expect(pushMock).toHaveBeenCalledWith({
			name: `${CrmSections.Cases}-card`,
			params: {
				id: 'case-1',
			},
		});
	});

	it('asks for confirmation before deleting the selected rows, then delegates to the store', async () => {
		const wrapper = mountTheCases();
		const tableStore = useCasesDatalistStore();

		tableStore.$patch({
			selected: [
				{
					id: 'case-1',
				},
				{
					id: 'case-2',
				},
			],
		});

		(wrapper.vm as any).deleteSelectedItems();

		expect((wrapper.vm as any).isDeleteConfirmationPopup).toBe(true);
		expect((wrapper.vm as any).deleteCount).toBe(2);

		await (wrapper.vm as any).deleteCallback();

		expect(deleteMock).toHaveBeenCalledWith(
			expect.objectContaining({
				id: 'case-1',
			}),
		);
		expect(deleteMock).toHaveBeenCalledWith(
			expect.objectContaining({
				id: 'case-2',
			}),
		);
	});

	it('exports cases with the current pagination, fields and filters', async () => {
		const wrapper = mountTheCases();
		const tableStore = useCasesDatalistStore();
		tableStore.$patch({
			page: 2,
			size: 25,
		});

		await (wrapper.vm as any).exportCases({
			format: 'csv',
			separator: ',',
		});

		expect(exportDataMock).toHaveBeenCalledWith(
			expect.objectContaining({
				page: 2,
				size: 25,
				format: 'csv',
				separator: ',',
			}),
		);
		expect(downloadFileMock).toHaveBeenCalledWith(
			expect.objectContaining({
				response: 'file-contents',
				fileFormat: 'csv',
			}),
		);
	});

	it('scopes the export to the selected rows when any are selected', async () => {
		const wrapper = mountTheCases();
		const tableStore = useCasesDatalistStore();
		tableStore.$patch({
			selected: [
				{
					id: 'case-1',
				},
			],
		});

		await (wrapper.vm as any).exportCases({
			format: 'xlsx',
		});

		expect(exportDataMock).toHaveBeenCalledWith(
			expect.objectContaining({
				ids: [
					'case-1',
				],
			}),
		);
	});

	it('marks a finished case row for the success style', () => {
		const wrapper = mountTheCases();

		expect(
			(wrapper.vm as any).rowClass({
				statusCondition: {
					final: true,
				},
			}),
		).toBe('row-success');
		expect(
			(wrapper.vm as any).rowClass({
				statusCondition: {
					final: false,
				},
			}),
		).toBeUndefined();
	});

	it('disables row expansion only when there is neither a description nor comments', () => {
		const wrapper = mountTheCases();

		expect((wrapper.vm as any).isRowExpansionDisabled({})).toBe(true);
		expect(
			(wrapper.vm as any).isRowExpansionDisabled({
				description: 'text',
			}),
		).toBe(false);
		expect(
			(wrapper.vm as any).isRowExpansionDisabled({
				comments: [],
			}),
		).toBe(false);
	});

	it('shows the full action set while the table is not in its initial-empty state', () => {
		const wrapper = mountTheCases();

		expect((wrapper.vm as any).displayIncludeActions).toEqual([
			IconAction.ADD,
			IconAction.REFRESH,
			IconAction.FILTERS,
			IconAction.COLUMNS,
			IconAction.DELETE,
		]);
	});
});
