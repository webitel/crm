import {
  getDefaultGetListResponse,
  getDefaultGetParams,
} from '@webitel/ui-sdk/src/api/defaults/index.js';
import applyTransform, {
  camelToSnake,
  merge,
  notify,
  sanitize,
  snakeToCamel,
  starToSearch,
} from '@webitel/ui-sdk/src/api/transformers/index.js';
import { VariablesApiFactory } from 'webitel-sdk';

import instance from '../../../../../app/api/instance';
import configuration from '../../../../../app/api/openAPIConfig';

const variablesService = new VariablesApiFactory(configuration, '', instance);

const getList = async (params) => {

  const fieldsToSend = [
    'parentId',
    'page',
    'size',
    'q',
    'sort',
    'fields',
    'id',
  ];
  const {
    parentId,
    page,
    size,
    q,
    sort,
    fields,
    id,
  } = applyTransform(params, [
    sanitize(fieldsToSend),
    merge(getDefaultGetParams()),
    starToSearch('q'),
  ]);
  try {
    const response = await variablesService.listVariables(
      parentId,
      page,
      size,
      q,
      sort,
      ['etag', ...fields],
      id,
    );
    const { data, next } = applyTransform(response.data, [
      snakeToCamel(),
      merge(getDefaultGetListResponse()),
    ]);
    return {
      items: data,
      next,
    };
  } catch (err) {
    throw applyTransform(err, [
      notify,
    ]);
  }
};

const get = async ({ parentId, itemId }) => {
  const fields = ['key', 'value', 'etag'];
  try {
    const response = await variablesService.listVariables(
      parentId,
      1,
      1,
      '',
      null,
      fields,
      [itemId],
    );
    const { data } = applyTransform(response.data, [
      snakeToCamel(),
    ]);
    return data[0];
  } catch (err) {
    throw applyTransform(err, [
      notify,
    ]);
  }
};

const fieldsToSend = ['key', 'value'];

const add = async ({ parentId, itemInstance }) => {
  const item = applyTransform(itemInstance, [
    sanitize(fieldsToSend),
    camelToSnake(),
  ]);
  try {
    const response = await variablesService.mergeVariables(parentId, [item]);
    return applyTransform(response.data, [
      snakeToCamel(),
    ]);
  } catch (err) {
    throw applyTransform(err, [

      notify,
    ]);
  }
};

const update = async ({ itemInstance, etag: id, parentId }) => {
  const item = applyTransform(itemInstance, [
    sanitize(fieldsToSend),
    camelToSnake(),
  ]);
  try {
    const response = await variablesService.updateVariable(parentId, id, item);
    return applyTransform(response.data, [
      snakeToCamel(),
    ]);
  } catch (err) {
    throw applyTransform(err, [

      notify,
    ]);
  }
};

const deleteItem = async ({ etag, parentId }) => {
  try {
    const response = await variablesService.deleteVariable(parentId, etag);
    return applyTransform(response.data, []);
  } catch (err) {
    throw applyTransform(err, [

      notify,
    ]);
  }
};

const VariablesAPI = {
  getList,
  get,
  add,
  update,
  delete: deleteItem,
};

export default VariablesAPI;
