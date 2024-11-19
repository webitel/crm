import {
  getDefaultGetListResponse,
  getDefaultGetParams,
  getDefaultInstance,
} from '@webitel/ui-sdk/src/api/defaults/index.js';
import applyTransform, {
  camelToSnake,
  generateUrl,
  merge,
  mergeEach,
  notify,
  sanitize,
  snakeToCamel,
  starToSearch,
} from '@webitel/ui-sdk/src/api/transformers/index.js';

const instance = getDefaultInstance();

const baseUrl = '/slas';
const nestedUrl = 'sla_conditions';

const fieldsToSend = ['name', 'priorities', 'sla_id', 'reaction_time', 'resolution_time'];

const getConditionsList = async ({parentId, ...rest}) => {
  const fieldsToSend = ['page', 'size', 'q', 'sort', 'fields', 'id'];

  const url = applyTransform(rest, [
    merge(getDefaultGetParams()),
    starToSearch('search'),
    (params) => ({ ...params, q: params.search }),
    sanitize(fieldsToSend),
    camelToSnake(),
    generateUrl(`${baseUrl}/${parentId}/${nestedUrl}`),
  ]);
  try {
    const response = await instance.get(url);
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
};

const getCondition = async ({ parentId, itemId: id }) => {
  const itemResponseHandler = (item) => {
    return item.slaCondition;
  };

  const url = `${baseUrl}/${parentId}/sla_condition/${id}`;

  try {
    const response = await instance.get(url);
    return applyTransform(response.data, [snakeToCamel(), itemResponseHandler]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const updateCondition = async ({ itemInstance, itemId: id }) => {
  const item = applyTransform(itemInstance, [
    // preRequestHandler,
    sanitize(fieldsToSend),
    camelToSnake(),
  ]);

  const url = `${baseUrl}/${itemInstance.slaId}/${nestedUrl}/${id}`;
  try {
    const response = await instance.put(url, item);
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const addCondition = async ({ itemInstance, parentId }) => {
  const item = applyTransform(itemInstance, [sanitize(fieldsToSend), camelToSnake()]);
  const url = `${baseUrl}/${parentId}/${nestedUrl}`;
  try {
    const response = await instance.post(url, item);
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const deleteCondition = async ({ id, parentId }) => {
  const url = `${baseUrl}/${parentId}/${nestedUrl}/${id}`;
  try {
    const response = await instance.delete(url);
    return applyTransform(response.data, []);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};


const ConditionsAPI = {
  getList: getConditionsList,
  get: getCondition,
  update: updateCondition,
  delete: deleteCondition,
  add: addCondition,
}

export default ConditionsAPI;
