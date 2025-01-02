import {
  getDefaultGetListResponse,
  getDefaultGetParams,
  getDefaultInstance, getDefaultOpenAPIConfig,
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
import { DynamicGroupsApiFactory } from 'webitel-sdk';
import isEmpty from '@webitel/ui-sdk/src/scripts/isEmpty';

const instance = getDefaultInstance();
const configuration = getDefaultOpenAPIConfig();

const dynamicContactGroupsService = new DynamicGroupsApiFactory(configuration, '', instance);

const fieldsToSend = ['name', 'description', 'enabled', 'type', 'default_group', 'assignee'];

const preRequestHandler = (item) => {
  if (!isEmpty(item.defaultGroup)) {
    item.defaultGroup = item.defaultGroup.id;
  } else {
    item.defaultGroup = 0;
  }

  if (item.assignee) {
    item.assignee = item.assignee.id;
  }

  return {
    ...item,
    type: item.type.toUpperCase(),
  }
};

const addDynamicContactGroup = async (itemInstance) => {
  const item = applyTransform(itemInstance, [
    preRequestHandler,
    camelToSnake(),
    sanitize(fieldsToSend),
  ]);

  try {
    const response = await dynamicContactGroupsService.createDynamicGroup(item);
    return applyTransform(response.data, [
      snakeToCamel()
    ]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const updateDynamicContactGroup = async ({ itemInstance, itemId: id }) => {
  const item = applyTransform(itemInstance, [preRequestHandler, camelToSnake(), sanitize(fieldsToSend)]);

  try {
    const response = await dynamicContactGroupsService.updateDynamicGroup(id, item);
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const dynamicContactGroupsAPI = {
  add: addDynamicContactGroup,
  update: updateDynamicContactGroup,
}

export default dynamicContactGroupsAPI;
