import { createPinia, setActivePinia } from 'pinia';

import { TimelineEventType } from '../../enums/TimelineEventType';
import { listHandler } from '../timeline';

const { getListMock, getCountersMock } = vi.hoisted(() => ({
	getListMock: vi.fn(() =>
		Promise.resolve({
			days: [],
			next: false,
		}),
	),
	getCountersMock: vi.fn(() => Promise.resolve({})),
}));

vi.mock('@webitel/api-services/api', () => ({
	TimelineAPI: {
		getList: getListMock,
		getCounters: getCountersMock,
	},
}));

const TYPE_FILTER_STORAGE_KEY = 'timelineDataList/type';

async function createTimelineStore(initialStoredType?: unknown[]) {
	if (initialStoredType === undefined) {
		sessionStorage.removeItem(TYPE_FILTER_STORAGE_KEY);
	} else {
		sessionStorage.setItem(
			TYPE_FILTER_STORAGE_KEY,
			JSON.stringify(initialStoredType),
		);
	}
	const { useTimelineStore } = await import('../timeline');
	return useTimelineStore();
}

describe('listHandler', () => {
	it('returns an empty list for an empty input', () => {
		expect(listHandler([])).toEqual([]);
	});

	it('flattens each item from its type-keyed payload and defaults a missing type to chat', () => {
		const days = [
			{
				id: 1,
				dayTimestamp: 1700000000,
				items: [
					{
						type: 'call',
						createdAt: '2024-01-01T00:00:00Z',
						call: {
							id: 'call-1',
							duration: 42,
						},
					},
					{
						// no explicit type -> falls back to "chat"
						createdAt: '2024-01-01T00:05:00Z',
						chat: {
							id: 'chat-1',
							text: 'hi',
						},
					},
				],
			},
		];

		expect(listHandler(days)).toEqual([
			{
				id: 1,
				dayTimestamp: 1700000000,
				items: [
					{
						id: 'call-1',
						duration: 42,
						type: 'call',
						createdAt: '2024-01-01T00:00:00Z',
					},
					{
						id: 'chat-1',
						text: 'hi',
						type: 'chat',
						createdAt: '2024-01-01T00:05:00Z',
					},
				],
			},
		]);
	});

	it('drops items whose payload has no string id', () => {
		const days = [
			{
				id: 1,
				items: [
					{
						type: 'email',
						createdAt: '2024-01-01T00:10:00Z',
						email: {
							subject: 'no id here',
						},
					},
				],
			},
		];

		expect(listHandler(days)[0].items).toEqual([]);
	});

	it('does not mutate the input', () => {
		const days = [
			{
				id: 1,
				items: [],
			},
		];

		listHandler(days);

		expect(days).toEqual([
			{
				id: 1,
				items: [],
			},
		]);
	});
});

describe('useTimelineStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
		getListMock.mockClear();
		getCountersMock.mockClear();
		sessionStorage.clear();
	});

	it('starts with no parent/mode selected and not loading', async () => {
		const store = await createTimelineStore();

		expect(store.parentId).toBeNull();
		expect(store.mode).toBeNull();
		expect(store.isLoading).toBe(false);
		expect(store.isLoadingMore).toBe(false);
	});

	it('defaults the type filter to call/chat/email when sessionStorage has nothing stored', async () => {
		const store = await createTimelineStore();

		await store.initialize({
			parentId: 'contact-1',
			mode: 'contact',
		});

		expect(store.typeFilter).toEqual([
			TimelineEventType.Call,
			TimelineEventType.Chat,
			TimelineEventType.Email,
		]);
		expect(store.parentId).toBe('contact-1');
		expect(store.mode).toBe('contact');
	});

	it('restores the type filter stored in sessionStorage', async () => {
		const store = await createTimelineStore([
			'call',
		]);

		await store.initialize({
			parentId: 'contact-1',
			mode: 'contact',
		});

		expect(store.typeFilter).toEqual([
			'call',
		]);
	});

	it('restores multiple stored type filter values', async () => {
		const store = await createTimelineStore([
			'call',
			'chat',
		]);

		await store.initialize({
			parentId: 'contact-1',
			mode: 'contact',
		});

		expect(store.typeFilter).toEqual([
			'call',
			'chat',
		]);
	});

	it('requests the parentId/mode passed to initialize', async () => {
		const store = await createTimelineStore();

		await store.initialize({
			parentId: 'contact-1',
			mode: 'contact',
		});

		expect(getListMock).toHaveBeenCalledWith(
			expect.objectContaining({
				entity: 'contact',
				parentId: 'contact-1',
			}),
		);
	});

	it('updates the filter and persists it in sessionStorage, not the route query', async () => {
		const store = await createTimelineStore();

		await store.initialize({
			parentId: 'contact-1',
			mode: 'contact',
		});
		store.setTypeFilter([
			TimelineEventType.Email,
		]);

		expect(store.typeFilter).toEqual([
			TimelineEventType.Email,
		]);
		expect(sessionStorage.getItem(TYPE_FILTER_STORAGE_KEY)).toBe(
			JSON.stringify([
				TimelineEventType.Email,
			]),
		);
	});

	it('resets the data list, pagination and next flag', async () => {
		const store = await createTimelineStore();

		await store.initialize({
			parentId: 'contact-1',
			mode: 'contact',
		});
		store.resetState();

		expect(store.dataList).toEqual([]);
		expect(store.page).toBe(1);
		expect(store.size).toBe(15);
		expect(store.next).toBe(false);
	});

	it('does not load more when there is no next page', async () => {
		const store = await createTimelineStore();

		await store.initialize({
			parentId: 'contact-1',
			mode: 'contact',
		});
		await store.loadNext();

		// only the initial `initialize` load, no extra append call
		expect(getListMock).toHaveBeenCalledTimes(1);
		expect(store.isLoadingMore).toBe(false);
	});

	it('loads the next page and toggles isLoadingMore around it', async () => {
		getListMock
			.mockResolvedValueOnce({
				days: [],
				next: true,
			})
			.mockResolvedValueOnce({
				days: [],
				next: false,
			});
		const store = await createTimelineStore();

		await store.initialize({
			parentId: 'contact-1',
			mode: 'contact',
		});
		expect(store.next).toBe(true);

		const loadNextPromise = store.loadNext();
		expect(store.isLoadingMore).toBe(true);
		await loadNextPromise;

		expect(store.isLoadingMore).toBe(false);
		expect(getListMock).toHaveBeenCalledTimes(2);
	});

	it('requests counters for the given parentId using the current mode', async () => {
		const store = await createTimelineStore();

		await store.initialize({
			parentId: 'contact-1',
			mode: 'contact',
		});
		await store.getCounters('contact-1');

		expect(getCountersMock).toHaveBeenCalledWith({
			entity: 'contact',
			parentId: 'contact-1',
		});
	});
});
