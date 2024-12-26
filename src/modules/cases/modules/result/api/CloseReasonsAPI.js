import applyTransform, {
  camelToSnake,
  snakeToCamel,
  notify,
} from '@webitel/ui-sdk/src/api/transformers/index.js';

// Sample data for CloseReasonsAPI
const sampleCloseReasonsData = {
  page: 0,
  next: true,
  items: [
    {
      id: 'cr1',
      name: 'Reason One',
      description: 'This is the first close reason',
      closeReasonGroupId: 'close1',
      createdAt: '2024-11-01T08:00:00Z',
      updatedAt: '2024-11-02T10:00:00Z',
      createdBy: {
        id: 'user1',
        name: 'Creator One',
      },
      updatedBy: {
        id: 'user2',
        name: 'Updater Two',
      },
    },
    {
      id: 'cr2',
      name: 'Reason Two',
      description: 'This is the second close reason',
      closeReasonGroupId: 'close1',
      createdAt: '2024-11-03T09:00:00Z',
      updatedAt: '2024-11-04T11:00:00Z',
      createdBy: {
        id: 'user3',
        name: 'Creator Three',
      },
      updatedBy: {
        id: 'user4',
        name: 'Updater Four',
      },
    },
  ],
};

// Simulated `getList` API for close reasons
const getList = async ({
  closeReasonGroupId,
  page = 1,
  perPage = 10,
  search = '',
  fields,
} = {}) => {
  try {
    if (!closeReasonGroupId) {
      throw new Error('closeReasonGroupId is required');
    }

    // Filter data by `closeReasonGroupId`
    const filteredByGroup = sampleCloseReasonsData.items.filter(
      (item) => item.closeReasonGroupId === closeReasonGroupId
    );

    // Transform and search in the data
    const transformedItems = applyTransform(filteredByGroup, [snakeToCamel()]);
    const filteredItems = transformedItems.filter((item) =>
      search
        ? Object.values(item).some((value) =>
          String(value).toLowerCase().includes(search.toLowerCase())
        )
        : true
    );

    // Paginate results
    const paginatedItems = filteredItems.slice(
      (page - 1) * perPage,
      page * perPage
    );

    // Select specific fields if provided
    const finalItems = fields
      ? paginatedItems.map((item) =>
        Object.keys(item)
        .filter((key) => fields.includes(key))
        .reduce((acc, key) => {
          acc[key] = item[key];
          return acc;
        }, {})
      )
      : paginatedItems;

    return {
      items: finalItems,
      next: page * perPage < filteredItems.length,
    };
  } catch (error) {
    throw applyTransform(error, [notify]);
  }
};

// Simulated `get` API for a specific close reason
const get = async ({ itemId }) => {
  try {
    const item = sampleCloseReasonsData.items.find(
      (entry) => entry.id === itemId
    );

    if (!item) {
      throw new Error('Item not found');
    }

    return applyTransform(item, [snakeToCamel()]);
  } catch (error) {
    throw applyTransform(error, [notify]);
  }
};

// Simulated `getLookup` API for close reasons
const getLookup = async (params) => {
  return getList({
    ...params,
    fields: ['id', 'name'],
  });
};

// Exporting the simulated CloseReasonsAPI
const CloseReasonsAPI = {
  getList,
  get,
  getLookup,
};

export default CloseReasonsAPI;
