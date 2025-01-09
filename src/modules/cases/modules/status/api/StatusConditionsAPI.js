import {
  getDefaultGetListResponse,
  getDefaultGetParams,
  getDefaultInstance,
  getDefaultOpenAPIConfig,
} from '@webitel/ui-sdk/src/api/defaults/index.js';
import applyTransform, {
  camelToSnake,
  merge,
  notify,
  sanitize,
  snakeToCamel,
  starToSearch,
} from '@webitel/ui-sdk/src/api/transformers/index.js';

import { StatusConditionsApiFactory } from 'webitel-sdk';

const instance = getDefaultInstance();
const configuration = getDefaultOpenAPIConfig();

const statusConditionsService = new StatusConditionsApiFactory(configuration, '', instance);

const getStatusConditionsList = async ({ statusId, ...rest }) => {
  const fieldsToSend = ['page', 'size', 'q', 'sort', 'fields', 'id'];
  const {
    page,
    size,
    fields,
    sort,
    id,
    q,
  } = applyTransform(rest, [
    merge(getDefaultGetParams()),
    starToSearch('search'),
    (params) => ({ ...params, q: params.search }),
    sanitize(fieldsToSend),
    camelToSnake(),
  ]);
  console.log('statusId', statusId);

  try {
    const response = await statusConditionsService.listStatusConditions(
      statusId,
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


// // Sample data for StatusConditionsAPI
// const sampleStatusConditionsData = {
//   page: 0,
//   next: true,
//   items: [
//     {
//       id: "c1",
//       name: "Condition A",
//       description: "Initial condition for processing",
//       initial: true,
//       final: false,
//       statusId: "s1",
//       createdAt: "2024-10-01T08:00:00Z",
//       updatedAt: "2024-10-02T10:00:00Z",
//       createdBy: { id: "user1", name: "Creator One" },
//       updatedBy: { id: "user2", name: "Updater Two" },
//     },
//     {
//       id: "c2",
//       name: "Condition B",
//       description: "Final condition for processing",
//       initial: false,
//       final: true,
//       statusId: "s1",
//       createdAt: "2024-10-03T09:00:00Z",
//       updatedAt: "2024-10-04T11:00:00Z",
//       createdBy: { id: "user3", name: "Creator Three" },
//       updatedBy: { id: "user4", name: "Updater Four" },
//     },
//     {
//       id: "c3",
//       name: "Condition C",
//       description: "Initial condition for processing",
//       initial: true,
//       final: false,
//       statusId: "s2",
//       createdAt: "2024-10-01T08:00:00Z",
//       updatedAt: "2024-10-02T10:00:00Z",
//       createdBy: { id: "user1", name: "Creator One" },
//       updatedBy: { id: "user2", name: "Updater Two" },
//     },
//     {
//       id: "c4",
//       name: "Condition D",
//       description: "Final condition for processing",
//       initial: false,
//       final: true,
//       statusId: "s2",
//       createdAt: "2024-10-03T09:00:00Z",
//       updatedAt: "2024-10-04T11:00:00Z",
//       createdBy: { id: "user3", name: "Creator Three" },
//       updatedBy: { id: "user4", name: "Updater Four" },
//     },
//   ],
// };
//
// // Simulated `getList` API for status conditions
// const getList = async ({ statusId, page = 1, perPage = 10, search = "", fields } = {}) => {
//   try {
//     if (!statusId) {
//       throw new Error("statusId is required to fetch conditions.");
//     }
//
//     // Filter items by statusId
//     const itemsForStatus = sampleStatusConditionsData.items.filter(
//       (item) => item.statusId === statusId
//     );
//
//     // Transform and filter the data
//     const transformedItems = applyTransform(itemsForStatus, [snakeToCamel()]);
//     const filteredItems = transformedItems.filter((item) =>
//       search
//         ? Object.values(item).some((value) =>
//           String(value).toLowerCase().includes(search.toLowerCase())
//         )
//         : true
//     );
//
//     // Paginate results
//     const paginatedItems = filteredItems.slice(
//       (page - 1) * perPage,
//       page * perPage
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
//         }, {})
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
// // Simulated `get` API for a single status condition
// const get = async ({ itemId }) => {
//   try {
//     const item = sampleStatusConditionsData.items.find((entry) => entry.id === itemId);
//
//     if (!item) {
//       throw new Error("Item not found");
//     }
//
//     return applyTransform(item, [snakeToCamel()]);
//   } catch (error) {
//     throw applyTransform(error, [notify]);
//   }
// };
//
// // Simulated `getLookup` API for status conditions
// const getLookup = async ({ statusId, ...params }) => {
//   if (!statusId) {
//     throw new Error("statusId is required for lookup.");
//   }
//
//   return getList({
//     ...params,
//     statusId,
//     fields: ["id", "name", "initial", "final"],
//   });
// };

//TODO: change fields after all apis is implemented
const getStatusConditionsLookup = ({ statusId, ...rest }) => {
  return getStatusConditionsList({
    statusId,
    rest,
    fields: ['id', 'name', 'initial', 'final'],
  });
};

const StatusConditionsAPI = {
  getList: getStatusConditionsList,
  getLookup: getStatusConditionsLookup,
};

export default StatusConditionsAPI;
