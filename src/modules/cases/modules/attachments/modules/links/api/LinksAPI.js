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
import { CaseLinksApiFactory } from 'webitel-sdk';

const instance = getDefaultInstance();
const configuration = getDefaultOpenAPIConfig();

const linksService = new CaseLinksApiFactory(configuration, '', instance);

const getLinksList = async ({
  parentId,
  ...rest
}) => {
  const fieldsToSend = ['etag', 'page', 'size', 'q'];
  const {
    page,
    size,
    q,
  } = applyTransform(rest, [
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
    const response = await linksService.listLinks(
      parentId,
      page,
      size,
      q,
    );

    const {
      items,
      next,
    } = applyTransform(response.data, [
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

const addLink = async ({
  parentId,
  input,
}) => {
  const fieldsToSend = ['name', 'url'];
  const {
    url,
    name,
  } = input;

  try {

    const response = await linksService.createLink(parentId, fieldsToSend, null, url, name);
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const patchLink = async ({
  parentId,
  linkId,
  changes,
}) => {
  const fieldsToSend = ['name', 'url'];
  const body = applyTransform(changes, [
    sanitize(fieldsToSend),
    camelToSnake(),
  ]);

  try {
    const response = await linksService.updateLink(parentId, linkId, body);
    return applyTransform(response.data, [
      snakeToCamel(),
    ]);
  } catch (err) {
    throw applyTransform(err, [
      notify,
    ]);
  }
};

const deleteLink = async ({
  parentId,
  etag,
}) => {
  try {
    const response = await linksService.deleteLink(parentId, etag);
    return applyTransform(response.data, []);
  } catch (err) {
    throw applyTransform(err, [
      notify,
    ]);
  }
};

const linksAPI = {
  getList: getLinksList,
  delete: deleteLink,
  add: addLink,
  patch: patchLink,
};

export default linksAPI;
