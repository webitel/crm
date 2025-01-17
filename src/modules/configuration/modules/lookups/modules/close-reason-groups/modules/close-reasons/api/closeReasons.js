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
import { CloseReasonsApiFactory } from 'webitel-sdk';

const instance = getDefaultInstance();
const configuration = getDefaultOpenAPIConfig();

const closeReasonsService = new CloseReasonsApiFactory(configuration, '', instance);

const fieldsToSend = ['name', 'description'];

const getCloseReasonsList = async ({ parentId, ...rest }) => {
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
    const response = await closeReasonsService.listCloseReasons(
      parentId,
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
};

const getCloseReason = async ({ parentId, itemId: id }) => {
  const itemResponseHandler = (item) => {
    return item.closeReason;
  };

  try {
    const response = await closeReasonsService.locateCloseReason(parentId, id);
    return applyTransform(response.data, [snakeToCamel(), itemResponseHandler]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const addCloseReason = async ({ itemInstance, parentId }) => {
  const item = applyTransform(itemInstance, [
    camelToSnake(),
    sanitize(fieldsToSend),
  ]);


  try {
    const response = await closeReasonsService.createCloseReason(parentId, item);
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const updateCloseReason = async ({ itemInstance, itemId: id }) => {
  const item = applyTransform(itemInstance, [
    camelToSnake(),
  ]);

  try {
    const response = await closeReasonsService.updateCloseReason(itemInstance.id, id, item);
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const deleteCloseReason = async ({ id, parentId }) => {
  try {
    const response = await closeReasonsService.deleteCloseReason(parentId, id);
    return applyTransform(response.data, []);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const ConditionsAPI = {
  getList: getCloseReasonsList,
  get: getCloseReason,
  add: addCloseReason,
  update: updateCloseReason,
  delete: deleteCloseReason,
};

export default ConditionsAPI;
