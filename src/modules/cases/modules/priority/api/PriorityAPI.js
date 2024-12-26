import applyTransform, {
  camelToSnake,
  merge,
  notify,
  sanitize,
  snakeToCamel,
} from '@webitel/ui-sdk/src/api/transformers/index.js';
import getDefaultGetListResponse
  from '../../../../../app/api/defaults/getDefaultGetListResponse.js';

// Sample data for the API
const data = {
  page: 0,
  next: true,
  items: [
    {
      id: "p1",
      name: "High",
      description: 'Description for Item One',
      createdAt: '2024-11-01T10:00:00Z',
      updatedAt: '2024-11-02T12:00:00Z',
      createdBy: {
        id: 'user1',
        name: 'Creator One',
      },
      updatedBy: {
        id: 'user2',
        name: 'Updater Two',
      },
      color: '#FF5733',
    },
    {
      id: "p2",
      name: "Medium",
      description: 'Description for Item Two',
      createdAt: '2024-11-03T14:00:00Z',
      updatedAt: '2024-11-05T16:00:00Z',
      createdBy: {
        id: 'user3',
        name: 'Creator Three',
      },
      updatedBy: {
        id: 'user4',
        name: 'Updater Four',
      },
      color: '#33FF57',
    },
  ],
};

// `getList` method
const getList = async (params = {}) => {
  try {
    const { fields, page = 1, perPage = 10, search = '' } = params;

    // Filter and paginate items
    const allItems = applyTransform(data.items, [snakeToCamel()]);
    const filteredItems = allItems.filter((item) =>
      search
        ? Object.values(item)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
        : true
    );

    const paginatedItems = filteredItems.slice((page - 1) * perPage, page * perPage);

    // If fields are specified, filter the items to include only those fields
    const finalItems = fields
      ? paginatedItems.map((item) =>
        Object.keys(item)
        .filter((key) => fields.includes(key))
        .reduce((obj, key) => {
          obj[key] = item[key];
          return obj;
        }, {})
      )
      : paginatedItems;

    return new Promise((resolve) => {
      resolve({
        items: finalItems,
        next: page * perPage < filteredItems.length,
      });
    });
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

// `get` method
const get = async ({ itemId: id }) => {
  try {
    const item = data.items.find((item) => item.id === id);

    if (!item) {
      throw new Error('Item not found');
    }

    const transformedData = applyTransform(item, [snakeToCamel()]);

    return new Promise((resolve) => {
      resolve(transformedData);
    });
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

// `getLookup` method
const getLookup = (params) =>
  getList({
    fields: ['id', 'name'] || params.fields,
    ...params,
  });

const PriorityAPI = {
  getList,
  get,
  getLookup,
};

export default PriorityAPI;
