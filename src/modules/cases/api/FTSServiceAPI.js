import {
  applyTransform,
  camelToSnake,
  merge,
  notify,
  sanitize,
  snakeToCamel,
} from '@webitel/api-services/api/transformers';
import {
  getDefaultGetListResponse,
  getDefaultGetParams,
  getDefaultInstance,
  getDefaultOpenAPIConfig,
  } from '@webitel/api-services/api/defaults';
import { FTSServiceApiFactory } from 'webitel-sdk';

const instance = getDefaultInstance();
const configuration = getDefaultOpenAPIConfig();

const ftsService = new FTSServiceApiFactory(configuration, '', instance);

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
