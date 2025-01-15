// import applyTransform, {
//   camelToSnake,
//   merge,
//   notify,
//   sanitize,
//   snakeToCamel,
// } from '@webitel/ui-sdk/src/api/transformers/index.js';
// import getDefaultGetListResponse
//   from '../../../../../app/api/defaults/getDefaultGetListResponse.js';
//
// // Sample data for catalogs API (now includes the catalog object)
// const catalogsData = {
//   page: "1",
//   next: true,
//   items: [
//     {
//       id: "cat1",
//       name: "Catalog 1",
//       description: "This is Catalog 1.",
//       prefix: "CAT1",
//       code: "C1",
//       state: true,
//       sla: {
//         id: "sla1",
//         name: "Critical SLA"
//       },
//       status: {
//         id: "s1",
//         name: "Active"
//       },
//       closeReason: {
//         id: "cr1",
//         name: "Resolved"
//       },
//       teams: [
//         {
//           id: "team1",
//           name: "Support Team"
//         }
//       ],
//       skills: [
//         {
//           id: "skill1",
//           name: "Network Troubleshooting"
//         }
//       ],
//       createdAt: "2024-11-01T10:00:00Z",
//       updatedAt: "2024-11-02T10:00:00Z",
//       createdBy: {
//         id: "u1",
//         name: "User One"
//       },
//       updatedBy: {
//         id: "u2",
//         name: "User Two"
//       },
//       service: [
//         {
//           id: "srv1",
//           name: "Network Support",
//           rootId: "root1",
//           description: "Service for network support.",
//           code: "NS",
//           state: true,
//           sla: {
//             id: "sla1",
//             name: "Critical SLA"
//           },
//           group: {
//             id: "group1",
//             name: "Support"
//           },
//           assignee: {
//             id: "u3",
//             name: "User Three"
//           },
//           createdAt: "2024-11-01T10:00:00Z",
//           updatedAt: "2024-11-02T10:00:00Z",
//           createdBy: {
//             id: "u1",
//             name: "User One"
//           },
//           updatedBy: {
//             id: "u2",
//             name: "User Two"
//           },
//           catalogId: "cat1",
//           service: []
//         }
//       ]
//     },
//     {
//       id: 'catalog1',
//       name: 'Main Catalog',
//       description: 'This is the main service catalog.',
//       prefix: 'CAT',
//       code: 'CAT001',
//       state: true,
//       sla: {
//         id: 'sla1',
//         name: 'Standard SLA',
//       },
//       status: {
//         id: 's1',
//         name: 'Active',
//       },
//       closeReason: {
//         id: 'close1',
//         name: 'Resolved',
//       },
//       teams: [
//         {
//           id: 'team1',
//           name: 'Support Team',
//         },
//       ],
//       skills: [
//         {
//           id: 'skill1',
//           name: 'Troubleshooting',
//         },
//       ],
//       createdAt: '2024-11-01T10:00:00Z',
//       updatedAt: '2024-11-05T12:00:00Z',
//       createdBy: {
//         id: 'user1',
//         name: 'Admin User',
//       },
//       updatedBy: {
//         id: 'user2',
//         name: 'Manager User',
//       },
//       service: [
//         {
//           id: 'service1',
//           name: 'Network Support',
//           rootId: 'root1',
//           description: 'Handles network-related issues.',
//           code: 'NET001',
//           state: true,
//           sla: {
//             id: 'sla1',
//             name: 'Standard SLA',
//           },
//           group: {
//             id: 'group1',
//             name: 'IT Group',
//           },
//           assignee: {
//             id: 'user3',
//             name: 'John Doe',
//           },
//           createdAt: '2024-11-01T10:30:00Z',
//           updatedAt: '2024-11-05T11:00:00Z',
//           createdBy: {
//             id: 'user1',
//             name: 'Admin User',
//           },
//           updatedBy: {
//             id: 'user2',
//             name: 'Manager User',
//           },
//           catalogId: 'catalog1',
//           service: [
//             {
//               id: 'subservice1',
//               name: 'Wi-Fi Support',
//               rootId: 'root2',
//               description: 'Assistance with Wi-Fi connectivity issues.',
//               code: 'WF001',
//               state: true,
//               sla: {
//                 id: 'sla2',
//                 name: 'Priority SLA',
//               },
//               group: {
//                 id: 'group2',
//                 name: 'Network Team',
//               },
//               assignee: {
//                 id: 'user4',
//                 name: 'Jane Smith',
//               },
//               createdAt: '2024-11-02T09:00:00Z',
//               updatedAt: '2024-11-04T15:00:00Z',
//               createdBy: {
//                 id: 'user1',
//                 name: 'Admin User',
//               },
//               updatedBy: {
//                 id: 'user2',
//                 name: 'Manager User',
//               },
//               catalogId: 'catalog1',
//               service: [
//                 {
//                   id: 'subservice2',
//                   name: 'Router Configuration',
//                   rootId: 'root3',
//                   description: 'Guidance on router setup and troubleshooting.',
//                   code: 'RT001',
//                   state: true,
//                   sla: {
//                     id: 'sla3',
//                     name: 'Critical SLA',
//                   },
//                   group: {
//                     id: 'group3',
//                     name: 'Infrastructure Team',
//                   },
//                   assignee: {
//                     id: 'user5',
//                     name: 'Mark Lee',
//                   },
//                   createdAt: '2024-11-03T12:00:00Z',
//                   updatedAt: '2024-11-05T14:00:00Z',
//                   createdBy: {
//                     id: 'user1',
//                     name: 'Admin User',
//                   },
//                   updatedBy: {
//                     id: 'user2',
//                     name: 'Manager User',
//                   },
//                   catalogId: 'catalog1',
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//   ],
// };
//
// // Get method for the Catalogs API
// const getList = async (params) => {
//   try {
//     const { items, next } = applyTransform(catalogsData, [
//       snakeToCamel(),
//       merge(getDefaultGetListResponse()),
//     ]);
//     return new Promise((resolve) => {
//       resolve({
//         items,
//         next,
//       });
//     });
//   } catch (err) {
//     throw applyTransform(err, [notify]);
//   }
// };
//
// const get = async ({ itemId: id }) => {
//   try {
//     const bucketData = catalogsData.items.find((item) => item.id === id);
//
//     if (!bucketData) {
//       throw new Error("Item not found");
//     }
//
//     const transformedData = applyTransform(bucketData, [snakeToCamel()]);
//
//     return new Promise((resolve) => {
//       resolve(transformedData);
//     });
//   } catch (err) {
//     throw applyTransform(err, [notify]);
//   }
// };
//
//
// const catalogsAPI = {
//   getList,
//   get,
// };
//
// export default catalogsAPI;

import {
  getDefaultGetListResponse,
  getDefaultGetParams,
  getDefaultInstance,
  getDefaultOpenAPIConfig
} from '@webitel/ui-sdk/src/api/defaults/index.js';
import { CatalogsApiFactory } from 'webitel-sdk';
import applyTransform, {
  camelToSnake,
  merge, notify,
  sanitize, snakeToCamel,
  starToSearch
} from '@webitel/ui-sdk/src/api/transformers/index.js';

const instance = getDefaultInstance();
const configuration = getDefaultOpenAPIConfig();

const catalogsService = new CatalogsApiFactory(configuration, '', instance);

const fieldsToSend = ['id', 'name', 'code', 'sla', 'teams', 'skills', 'status', 'state', 'prefix', 'close_reason', 'reason', 'description', 'services'];
const servicesFieldsToSend = ['id', 'name', 'group', 'description', 'code', 'prefix', 'state', 'sla', 'root_id'];

const getCatalogsList = async (params) => {
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
    const response = await catalogsService.listCatalogs(
      page,
      size,
      [...fields, 'services'],
      sort,
      id,
      q,
      true,
      undefined,
      servicesFieldsToSend
    );
    const { items, next } = applyTransform(response.data, [
      merge(getDefaultGetListResponse()),
    ]);
    return {
      items: applyTransform(items, []),
      next,
    };
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const getCatalog = async ({ itemId: id }) => {
  try {
    const response = await catalogsService.locateCatalog(id, fieldsToSend);
    return applyTransform(response.data, [
      snakeToCamel(),
    ]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const preRequestHandler = (item) => {
  return {
    ...item,
    state: item.state ?? true,
    sla_id: item.sla?.id,
    status_id: item.status?.id,
    close_reason_id: item.closeReason?.id,
    team_ids: item.teams?.map((team) => team.id),
    skill_ids: item.skills?.map((skill) => skill.id),
  }
};

const addCatalog = async ({ itemInstance }) => {
  const fieldsToSend = ['name', 'description', 'prefix', 'code',  'state', 'sla_id', 'status_id', 'close_reason_id', 'team_ids', 'skill_ids'];
  const item = applyTransform(itemInstance, [
    preRequestHandler,
    camelToSnake(),
    sanitize(fieldsToSend),
  ]);
  try {
    const response = await catalogsService.createCatalog(item);
    return applyTransform(response.data, [
      snakeToCamel()
    ]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const updateCatalog = async ({ itemInstance, itemId: id }) => {
  const fieldsToSend = ['name', 'description', 'prefix', 'code',  'state', 'sla_id', 'status_id', 'close_reason_id', 'team_ids', 'skill_ids'];
  const item = applyTransform(itemInstance, [
    preRequestHandler,
    camelToSnake(),
    sanitize(fieldsToSend)]);
  try {
    const response = await catalogsService.updateCatalog(id, item);
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const patchCatalog = async ({ itemInstance, itemId: id }) => {
  const fieldsToSend = ['name', 'description', 'prefix', 'code',  'state', 'sla_id', 'status_id', 'close_reason_id', 'team_ids', 'skill_ids'];
  const item = applyTransform(itemInstance, [
    preRequestHandler,
    camelToSnake(),
    sanitize(fieldsToSend)]);
  try {
    const response = await catalogsService.updateCatalog2(id, item);
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const deleteCatalog = async ({ id }) => {
  try {
    const response = await catalogsService.deleteCatalog(id);
    return applyTransform(response.data, []);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const catalogsAPI = {
  getList: getCatalogsList,
  get: getCatalog,
  add: addCatalog,
  update: updateCatalog,
  patch: patchCatalog,
  delete: deleteCatalog,
}

export default catalogsAPI;
