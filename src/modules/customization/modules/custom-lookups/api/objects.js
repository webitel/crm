import {
  getDefaultGetListResponse,
  getDefaultGetParams,
  getDefaultInstance,
  getDefaultOpenAPIConfig,
} from '@webitel/api-services/api/defaults';
import { applyTransform,
  camelToSnake,
  generateUrl,
  merge,
  notify,
  sanitize,
  snakeToCamel,
  starToSearch,
} from '@webitel/api-services/api/transformers';
import { TypesApiFactory } from 'webitel-sdk';

const instance = getDefaultInstance();
const configuration = getDefaultOpenAPIConfig();

const typeService = new TypesApiFactory(configuration, '', instance);

const getObjectList = async (params) => {
  const fieldsToSend = ['page', 'size', 'q', 'sort', 'fields', 'id'];

  const { page, size, fields, sort, id, q } = applyTransform(params, [
    merge(getDefaultGetParams()),
    starToSearch('search'),
    (params) => ({ ...params, q: params.search }),
    sanitize(fieldsToSend),
    camelToSnake(),
  ]);
  try {
    const response = await typeService.search(
      q,
      id,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      size,
      page,
      sort,
      fields,
    );
    const { data, next } = applyTransform(response.data, [
      merge(getDefaultGetListResponse()),
    ]);

    const itemResponseHandler = (items) =>
      (items || []).map((item) => ({
        ...item,
        id: item.repo,
      }));

    return {
      items: applyTransform(data, [snakeToCamel(), itemResponseHandler]),
      next,
    };
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const getObjectLookupList = async ({ ...params }) => {
  const fieldsToSend = [
    'page',
    'size',
    'q',
    'sort',
    'extensions',
    'fields',
    'id',
  ];

  const url = applyTransform(params, [
    merge(getDefaultGetParams()),
    (params) => ({ ...params, q: params.search, extensions: false }),
    sanitize(fieldsToSend),
    camelToSnake(),
    generateUrl('types'),
  ]);
  try {
    const response = await instance.get(url);
    const { data, next } = applyTransform(response.data, [
      snakeToCamel(),
      merge(getDefaultGetListResponse()),
    ]);

    return {
      items: data ?? [],
      next,
    };
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const getObjectLookup = async (params) =>
  getObjectLookupList({
    ...params,
    fields: params.fields || ['id', 'name'],
  });

const ObjectsApi = {
  getList: getObjectList,
  getLookup: getObjectLookup,
};

export default ObjectsApi;
