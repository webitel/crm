import {
  getDefaultGetListResponse,
  getDefaultGetParams,
  getDefaultInstance,
  getDefaultOpenAPIConfig,
} from '@webitel/ui-sdk/src/api/defaults/index.js';
import applyTransform, {
  camelToSnake,
  merge,
  mergeEach,
  notify,
  sanitize,
  snakeToCamel,
  starToSearch,
} from '@webitel/ui-sdk/src/api/transformers/index.js';
import { CaseFilesApiFactory } from 'webitel-sdk';

const instance = getDefaultInstance();
const configuration = getDefaultOpenAPIConfig();

const filesService = new CaseFilesApiFactory(configuration, '', instance);

const getFilesList = async ({ parentId, ...rest }) => {
  const fieldsToSend = ['etag', 'page', 'size', 'q'];
  const { page, size, q } = applyTransform(rest, [
    merge(getDefaultGetParams()),
    starToSearch('search'),
    (params) => ({
      ...params,
      q: params.search,
    }),
    sanitize(fieldsToSend),
    camelToSnake(),
  ]);
  try {
    const response = await filesService.listFiles(parentId, page, size, q);

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

const deleteFile = async ({ parentId, id }) => {
  try {
    const response = await filesService.deleteFile(parentId, id);
    return applyTransform(response.data, []);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const filesAPI = {
  getList: getFilesList,
  delete: deleteFile,
};

export default filesAPI;
