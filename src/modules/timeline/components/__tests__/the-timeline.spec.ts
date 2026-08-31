import { createTestingPinia } from '@pinia/testing';
import { shallowMount } from '@vue/test-utils';

import { TimelineMode } from '../../enums/TimelineMode';
import { useTimelineStore } from '../../stores/timeline';
import TheTimeline from '../the-timeline.vue';

const { getListMock } = vi.hoisted(() => ({
	getListMock: vi.fn(() =>
		Promise.resolve({
			days: [],
			next: false,
		}),
	),
}));

vi.mock('@webitel/api-services/api', async (importOriginal) => {
	const actual =
		await importOriginal<typeof import('@webitel/api-services/api')>();
	return {
		...actual,
		TimelineAPI: {
			...actual.TimelineAPI,
			getList: getListMock,
		},
	};
});

function mountTheTimeline(
	props: { parentId: string; mode: TimelineMode } = {
		parentId: 'contact-1',
		mode: TimelineMode.Contact,
	},
) {
	return shallowMount(TheTimeline, {
		props,
		global: {
			plugins: [
				// a fresh instance per mount keeps each test's store state isolated,
				// while `stubActions: false` keeps real store logic (API calls, etc.) running
				createTestingPinia({
					stubActions: false,
				}),
			],
		},
	});
}

describe('TheTimeline', () => {
	beforeEach(() => {
		getListMock.mockClear();
		getListMock.mockResolvedValue({
			days: [],
			next: false,
		});
	});

	it('renders a component', () => {
		const wrapper = mountTheTimeline();
		expect(wrapper.isVisible()).toBe(true);
	});

	it('unmounts without throwing', () => {
		const wrapper = mountTheTimeline();
		expect(() => wrapper.unmount()).not.toThrow();
	});

	it('initializes the timeline store with its parentId and mode props', async () => {
		mountTheTimeline({
			parentId: 'contact-42',
			mode: TimelineMode.Contact,
		});
		// createTestingPinia wraps every action in a spy, which pushes the
		// resulting call onto a fresh microtask - a synchronous assertion right
		// after mount can otherwise run before it lands.
		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(getListMock).toHaveBeenCalledWith(
			expect.objectContaining({
				entity: 'contact',
				parentId: 'contact-42',
			}),
		);
	});

	it('fetches another page and toggles the "next page" loader around it', async () => {
		// the underlying table store's own filter-change watcher can trigger an
		// extra load on top of `initialize`'s own, so the initial page is
		// stubbed persistently rather than with a call-order-dependent "once".
		getListMock.mockResolvedValue({
			days: [],
			next: true,
		});
		const wrapper = mountTheTimeline();
		await new Promise((resolve) => setTimeout(resolve, 0));
		const callsBeforeLoadNext = getListMock.mock.calls.length;

		getListMock.mockResolvedValueOnce({
			days: [],
			next: false,
		});
		const loadNextPromise = (wrapper.vm as any).loadNext();
		expect((wrapper.vm as any).nextLoading).toBe(true);
		await loadNextPromise;

		expect((wrapper.vm as any).nextLoading).toBe(false);
		expect(getListMock).toHaveBeenCalledTimes(callsBeforeLoadNext + 1);
		expect(useTimelineStore().next).toBe(false);
	});

	it('resets the store state on unmount so a re-mount starts clean', async () => {
		// the underlying table store's own filter-change watcher can trigger an
		// extra load on top of `initialize`'s own — so this stubs every call
		// consistently, rather than relying on call order/count.
		getListMock.mockResolvedValue({
			days: [
				{
					id: 1,
					dayTimestamp: 1,
					items: [],
				},
			],
			next: true,
		});
		const wrapper = mountTheTimeline();
		await new Promise((resolve) => setTimeout(resolve, 0));

		const store = useTimelineStore();
		expect(store.next).toBe(true);

		wrapper.unmount();

		expect(store.dataList).toEqual([]);
		expect(store.next).toBe(false);
		expect(store.page).toBe(1);
	});
});
