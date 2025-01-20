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

const fieldsToSend = [
  'etag',
  'name',
  'subject',
  'description',
  'contact_info',
  'created_at',
  'planned_reaction_at',
  'planned_resolve_at',
  'status_lookup',
  'close_reason_lookup',
  'author',
  'assignee',
  'reporter',
  'impacted',
  'group',
  'priority',
  'source',
  'status',
  'close',
  'rate',
  'timing',
  'sla_condition',
  'difference_in_reaction',
  'sla',
  'service',
  'comments',
  'related_cases',
  'links',
  'status_condition',
];

const getCommentsList = async (params) => {
  console.log(params);
  const fieldsToSend = ['etag', 'page', 'size', 'q', 'ids', 'sort', 'filters'];

  const {
    etag,
    page,
    size,
    q,
    ids,
    sort,
    fields,
    options,
  } = applyTransform(params, [
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
      "ZwQwmQh",
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

const getCase = async ({ itemId: id }) => {
  try {
    const response = await casesService.locateCase(id, fieldsToSend);
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const deleteCase = async ({ id }) => {
  try {
    const response = await casesService.deleteCase(id);
    return applyTransform(response.data, []);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const updateCase = async ({ itemInstance, itemId: id }) => {
  const fieldsToSend = [
    'name',
    'subject',
    'description',
    'contact_info',
    'status_lookup',
    'close_reason_lookup',
    'author',
    'assignee',
    'reporter',
    'impacted',
    'group',
    'priority',
    'source',
    'status',
    'close',
    'rate',
    'sla_condition',
    'sla',
    'service',
    'status_condition',
  ];
  const item = applyTransform(itemInstance, [
    camelToSnake(),
    sanitize(fieldsToSend),
  ]);

  try {
    const response = await casesService.updateCase(id, item);
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const addComment = async ({ etag, input }) => {
  try {
    const response = await commentsService.publishComment(etag, input);
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const patchCase = async ({ changes, etag }) => {
  const fieldsToSend = ['status_condition', 'status'];
  const body = applyTransform(changes, [
    camelToSnake(),
    sanitize(fieldsToSend),
  ]);
  try {
    const response = await casesService.updateCase(etag, body);
    return applyTransform(response.data, [
      snakeToCamel(),
    ]);
  } catch (err) {
    throw applyTransform(err, [
      notify,
    ]);
  }
};

const commentsAPI = {
  getList: getCommentsList,
  // get: getComment,
  // delete: deleteComment,
  // update: updateComment,
  add: addComment,
  // patch: patchComment,
};

export default commentsAPI;
