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
import { RelatedCasesApiFactory } from 'webitel-sdk';

const instance = getDefaultInstance();
const configuration = getDefaultOpenAPIConfig();

const relatedCasesService = new RelatedCasesApiFactory(
  configuration,
  '',
  instance,
);

const getRelatedCasesList = async ({ parentId, ...rest }) => {
  const fieldsToSend = [
    'etag',
    'page',
    'size',
    'q',
    'sort',
    'fields',
    'ids',
    'filters',
  ];

  const { page, size, q, ids, sort, fields, options } = applyTransform(rest, [
    merge(getDefaultGetParams()),
    starToSearch('search'),
    (params) => ({
      ...params,
      q: params.search,
      fields: [...params.fields, 'primary_case'],
    }),
    sanitize(fieldsToSend),
    camelToSnake(),
  ]);

  try {
    const response = await relatedCasesService.listRelatedCases(
      parentId,
      page,
      size,
      q,
      sort,
      fields,
      ids,
      options,
    );

    const { data, next } = applyTransform(response.data, [
      merge(getDefaultGetListResponse()),
    ]);

    return {
      items: applyTransform(data, [snakeToCamel()]),
      next,
    };
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const addRelatedCase = async ({ parentId, input }) => {
  try {
    const response = await relatedCasesService.createRelatedCase(
      parentId,
      input,
    );
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const deleteRelatedCase = async ({ id }) => {
  try {
    const response = await relatedCasesService.deleteRelatedCase(id);
    return applyTransform(response.data, []);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const relatedCasesAPI = {
  getList: getRelatedCasesList,
  delete: deleteRelatedCase,
  add: addRelatedCase,
};

export default relatedCasesAPI;
