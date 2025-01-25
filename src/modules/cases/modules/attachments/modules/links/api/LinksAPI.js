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
import { CaseCommentsApiFactory } from 'webitel-sdk';

const instance = getDefaultInstance();
const configuration = getDefaultOpenAPIConfig();

const commentsService = new CaseCommentsApiFactory(configuration, '', instance);

const getCommentsList = async ({
  parentId,
  ...rest
}) => {
  const fieldsToSend = ['etag', 'page', 'size', 'q', 'ids', 'sort', 'filters',];
  const {
    page,
    size,
    q,
    ids,
    sort,
    fields,
    options,
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
    const response = await commentsService.listComments(
      parentId,
      page,
      size,
      q,
      ids,
      sort,
      fields,
      options,
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

const addComment = async ({
  parentId,
  input,
}) => {
  try {
    const response = await commentsService.publishComment(parentId, input);
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const patchComment = async ({
  commentId,
  changes,
}) => {
  const fieldsToSend = ['text'];
  const body = applyTransform(changes, [
    sanitize(fieldsToSend),
    camelToSnake(),
  ]);

  try {
    const response = await commentsService.updateComment(commentId, body);
    return applyTransform(response.data, [
      snakeToCamel(),
    ]);
  } catch (err) {
    throw applyTransform(err, [
      notify,
    ]);
  }
};

const deleteComment = async ({ etag }) => {
  try {
    const response = await commentsService.deleteComment(etag);
    return applyTransform(response.data, []);
  } catch (err) {
    throw applyTransform(err, [
      notify,
    ]);
  }
};

const linksAPI = {
  getList: getCommentsList,
  delete: deleteComment,
  add: addComment,
  patch: patchComment,
};

export default linksAPI;
