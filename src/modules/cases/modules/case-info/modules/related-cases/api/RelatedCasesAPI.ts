import {
  getDefaultGetListResponse,
  getDefaultGetParams,
  getDefaultInstance,
  getDefaultOpenAPIConfig,
} from '@webitel/ui-sdk/src/api/defaults/index';
import applyTransform, {
  camelToSnake,
  merge,
  notify,
  snakeToCamel,
  starToSearch,
} from '@webitel/ui-sdk/src/api/transformers/index';
import { RelatedCasesApiFactory, CasesRelatedCase } from 'webitel-sdk';
import type { ApiModule } from "@webitel/ui-sdk/src/api/types/ApiModule.d.ts";

const instance = getDefaultInstance();
const configuration = getDefaultOpenAPIConfig();

const relatedCasesService = RelatedCasesApiFactory(
  configuration,
  '',
  instance,
);

const getRelatedCasesList = async ({ parentId, ...rest }) => {
  const { page, size, q, ids, sort, fields, options } = applyTransform(rest, [
    merge(getDefaultGetParams()),
    starToSearch('search'),
    (params) => ({
      ...params,
      q: params.search,
      fields: [...params.fields, 'primary_case', 'id'],
    }),
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

    const { items, next } = applyTransform({ ...response.data, items: response.data?.data || [] }, [
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

export const RelatedCasesAPI: ApiModule<CasesRelatedCase> = {
  getList: getRelatedCasesList,
  delete: deleteRelatedCase,
  add: addRelatedCase,
};
