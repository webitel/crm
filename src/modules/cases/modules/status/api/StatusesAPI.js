import {
  getDefaultGetListResponse,
  getDefaultGetParams,
  getDefaultInstance,
  getDefaultOpenAPIConfig,
} from '@webitel/ui-sdk/src/api/defaults/index.js';
import applyTransform, {
  camelToSnake,
  merge,
  mergeEach,
  notify,
  sanitize,
  snakeToCamel,
  starToSearch,
} from '@webitel/ui-sdk/src/api/transformers/index.js';
import { StatusesApiFactory } from 'webitel-sdk';

const instance = getDefaultInstance();
const configuration = getDefaultOpenAPIConfig();

const statusesService = new StatusesApiFactory(configuration, '', instance);

const getStatusesList = async (params) => {
  const fieldsToSend = ['page', 'size', 'q', 'sort', 'fields', 'id'];

  const {
    page,
    size,
    fields,
    sort,
    id,
    q,
  } = applyTransform(params, [
    merge(getDefaultGetParams()),
    starToSearch('search'),
    (params) => ({ ...params, q: params.search }),
    sanitize(fieldsToSend),
    camelToSnake(),
  ]);

  try {
    const response = await statusesService.listStatuses(
      page,
      size,
      fields,
      sort,
      id,
      q,
    );
    const { items, next } = applyTransform(response.data, [
      merge(getDefaultGetListResponse()),
    ]);
    return {
      items: applyTransform(items, [snakeToCamel()]),
      next,
    };
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
}

const getStatus = async ({ statusId: id }) => {
  try {
    const response = await statusesService.locateStatus(id);
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
}

const getStatusesLookup = (params) => {
  return getStatusesList({
    ...params,
    fields: params.fields || ['id', 'name'],
  });
}

// Sample data for StatusesAPI
// const sampleStatusesData = {
//   page: 0,
//   next: true,
//   items: [
//     {
//       id: 's1',
//       name: 'Open',
//       description: 'Status for open cases',
//       createdAt: '2024-10-01T08:00:00Z',
//       updatedAt: '2024-10-02T10:00:00Z',
//       createdBy: {
//         id: 'user1',
//         name: 'Creator One',
//       },
//       updatedBy: {
//         id: 'user2',
//         name: 'Updater Two',
//       },
//     },
//     {
//       id: 's2',
//       name: 'In Progress',
//       description: 'Status for ongoing cases',
//       createdAt: '2024-10-03T09:00:00Z',
//       updatedAt: '2024-10-04T11:00:00Z',
//       createdBy: {
//         id: 'user3',
//         name: 'Creator Three',
//       },
//       updatedBy: {
//         id: 'user4',
//         name: 'Updater Four',
//       },
//     },
//     {
//       id: 's3',
//       name: 'Closed',
//       description: 'Status for completed cases',
//       createdAt: '2024-10-05T12:00:00Z',
//       updatedAt: '2024-10-06T14:00:00Z',
//       createdBy: {
//         id: 'user5',
//         name: 'Creator Five',
//       },
//       updatedBy: {
//         id: 'user6',
//         name: 'Updater Six',
//       },
//     },
//   ],
// };
//
// // Simulated `getList` API for statuses
// const getList = async ({
//   page = 1,
//   perPage = 10,
//   search = '',
//   fields,
// } = {}) => {
//   try {
//     // Transform and filter the data
//     const transformedItems = applyTransform(sampleStatusesData.items, [snakeToCamel()]);
//     const filteredItems = transformedItems.filter((item) =>
//       search
//         ? Object.values(item)
//         .some((value) =>
//           String(value)
//           .toLowerCase()
//           .includes(search.toLowerCase()),
//         )
//         : true,
//     );
//
//     // Paginate results
//     const paginatedItems = filteredItems.slice(
//       (page - 1) * perPage,
//       page * perPage,
//     );
//
//     // Select specific fields if provided
//     const finalItems = fields
//       ? paginatedItems.map((item) =>
//         Object.keys(item)
//         .filter((key) => fields.includes(key))
//         .reduce((acc, key) => {
//           acc[key] = item[key];
//           return acc;
//         }, {}),
//       )
//       : paginatedItems;
//
//     return {
//       items: finalItems,
//       next: page * perPage < filteredItems.length,
//     };
//   } catch (error) {
//     throw applyTransform(error, [notify]);
//   }
// };
//
// // Simulated `get` API for statuses
// const get = async ({ itemId }) => {
//   try {
//     const item = sampleStatusesData.items.find((entry) => entry.id === itemId);
//
//     if (!item) {
//       throw new Error('Item not found');
//     }
//
//     return applyTransform(item, [snakeToCamel()]);
//   } catch (error) {
//     throw applyTransform(error, [notify]);
//   }
// };
//
// // Simulated `getLookup` API for statuses
// const getLookup = async (params) => {
//   return getList({
//     ...params,
//     fields: ['id', 'name'],
//   });
// };

// Exporting the simulated StatusesAPI
const StatusesAPI = {
  getList: getStatusesList,
  get: getStatus,
  getLookup: getStatusesLookup,
};

export default StatusesAPI;
