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
// // Sample data for service API (now includes the subservice2 object)
// const serviceData = {
//   page: "1",
//   next: true,
//   items: [
//     {
//       id: "service1",
//       name: "Network Support",
//       rootId: "root1",
//       description: "Service for network-related issues.",
//       code: "NET001",
//       state: true,
//       sla: {
//         id: "sla1",
//         name: "Standard SLA"
//       },
//       group: {
//         id: "group1",
//         name: "IT Group"
//       },
//       assignee: {
//         id: "user3",
//         name: "John Doe"
//       },
//       createdAt: "2024-11-01T10:30:00Z",
//       updatedAt: "2024-11-05T11:00:00Z",
//       createdBy: {
//         id: "user1",
//         name: "Admin User"
//       },
//       updatedBy: {
//         id: "user2",
//         name: "Manager User"
//       },
//       catalogId: "catalog1",
//       service: [
//         {
//           id: "subservice1",
//           name: "Wi-Fi Support",
//           rootId: "root2",
//           description: "Assistance with Wi-Fi connectivity issues.",
//           code: "WF001",
//           state: true,
//           sla: {
//             id: "sla2",
//             name: "Priority SLA"
//           },
//           group: {
//             id: "group2",
//             name: "Network Team"
//           },
//           assignee: {
//             id: "user4",
//             name: "Jane Smith"
//           },
//           createdAt: "2024-11-02T09:00:00Z",
//           updatedAt: "2024-11-04T15:00:00Z",
//           createdBy: {
//             id: "user1",
//             name: "Admin User"
//           },
//           updatedBy: {
//             id: "user2",
//             name: "Manager User"
//           },
//           catalogId: "catalog1",
//           service: [
//             {
//               id: "subservice2",
//               name: "Router Configuration",
//               rootId: "root3",
//               description: "Guidance on router setup and troubleshooting.",
//               code: "RT001",
//               state: true,
//               sla: {
//                 id: "sla1",
//                 name: "Critical SLA"
//               },
//               group: {
//                 id: "group3",
//                 name: "Infrastructure Team"
//               },
//               assignee: {
//                 id: "user5",
//                 name: "Mark Lee"
//               },
//               createdAt: "2024-11-03T12:00:00Z",
//               updatedAt: "2024-11-05T14:00:00Z",
//               createdBy: {
//                 id: "user1",
//                 name: "Admin User"
//               },
//               updatedBy: {
//                 id: "user2",
//                 name: "Manager User"
//               },
//               catalogId: "catalog1",
//             }
//           ]
//         }
//       ]
//     }
//   ]
// };
//
// const fieldsToSend = [
//   'id',
//   'name',
//   'rootId',
//   'description',
//   'code',
//   'state',
//   'sla',
//   'group',
//   'assignee',
//   'createdAt',
//   'updatedAt',
//   'createdBy',
//   'updatedBy',
//   'catalogId',
//   'service',
// ];
//
// // Get method for the Service API
// const getList = async (params) => {
//   try {
//     const { items, next } = applyTransform(serviceData, [
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
// const findServiceById = (items, id) => {
//   for (const item of items) {
//     if (item.id === id) {
//       return item;
//     }
//     if (item.service && item.service.length > 0) {
//       const found = findServiceById(item.service, id);
//       if (found) {
//         return found;
//       }
//     }
//   }
//   return null;
// };
//
// const get = async ({ itemId: id }) => {
//   try {
//     const bucketData = findServiceById(serviceData.items, id);
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
// const serviceAPI = {
//   getList,
//   get,
// };
//
// export default serviceAPI;

import {
  getDefaultGetListResponse,
  getDefaultGetParams,
  getDefaultInstance,
  getDefaultOpenAPIConfig
} from '@webitel/ui-sdk/src/api/defaults/index.js';
import { ServicesApiFactory } from 'webitel-sdk';
import applyTransform, {
  camelToSnake,
  merge, notify,
  sanitize, snakeToCamel,
  starToSearch
} from '@webitel/ui-sdk/src/api/transformers/index.js';

const instance = getDefaultInstance();
const configuration = getDefaultOpenAPIConfig();

const servicesService = new ServicesApiFactory(configuration, '', instance);

const fieldsToSend = ['id', 'name', 'description', 'prefix', 'code',  'state', 'sla_id', 'status_id', 'close_reason_id', 'team_ids', 'skill_ids'];

const getServicesList = async ({ rootId, ...rest }) => {
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
  try {
    const response = await servicesService.listServices(
      page,
      size,
      sort,
      id,
      q,
      rootId,
      undefined,
      fields
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

const getService = async ({ itemId: id }) => {
  const fieldsToSend = ['name', 'code', 'sla', 'teams', 'skills', 'status', 'state', 'close_reason', 'reason', 'description', 'services', 'root_id', 'catalog_id', 'group'];

  const itemResponseHandler = (item) => {
    return item.service;
  };

  try {
    const response = await servicesService.locateService(id, fieldsToSend);
    return applyTransform(response.data, [
      snakeToCamel(),
      itemResponseHandler,
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

const addService = async ({ itemInstance }) => {

  const item = applyTransform(itemInstance, [
    preRequestHandler,
    camelToSnake(),
    sanitize(fieldsToSend),
  ]);
  try {
    const response = await servicesService.createService(item);
    return applyTransform(response.data, [
      snakeToCamel()
    ]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const updateService = async ({ itemInstance, itemId: id }) => {
  const item = applyTransform(itemInstance, [
    preRequestHandler,
    camelToSnake(),
    sanitize(fieldsToSend)]);
  try {
    const response = await servicesService.updateService(id, item);
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const patchService = async ({ itemInstance, itemId: id }) => {
  const item = applyTransform(itemInstance, [
    preRequestHandler,
    camelToSnake(),
    sanitize(fieldsToSend)]);
  try {
    const response = await servicesService.updateService2(id, item);
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const deleteService = async ({ id }) => {
  try {
    const response = await servicesService.deleteService(id);
    return applyTransform(response.data, []);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const ServicesAPI = {
  getList: getServicesList,
  get: getService,
  add: addService,
  update: updateService,
  patch: patchService,
  delete: deleteService,
}

export default ServicesAPI;
