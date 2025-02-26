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
} from '@webitel/ui-sdk/src/api/transformers/index.js';
import { FTSServiceApi } from 'webitel-sdk';

const instance = getDefaultInstance();
const configuration = getDefaultOpenAPIConfig();

const ftsService = new FTSServiceApi(configuration, '', instance);

const getSearchList = async (params) => {
  const fieldsToSend = ['page', 'size', 'q', 'sort', 'fields', 'object_name'];

  const { page, size, q, sort, fields, options, object_name } = applyTransform(
    params,
    [
      merge(getDefaultGetParams()),
      (params) => ({ ...params, q: params.fts }),
      sanitize(fieldsToSend),
      camelToSnake(),
    ],
  );

  try {
    const response = await ftsService.search(
      page,
      size,
      q,
      sort,
      fields,
      object_name,
      options,
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

const ftsServiceAPI = {
  getList: getSearchList,
};

export default ftsServiceAPI;
