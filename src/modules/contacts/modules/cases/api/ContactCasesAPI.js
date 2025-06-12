import {
  getDefaultGetListResponse,
  getDefaultGetParams,
} from '@webitel/ui-sdk/src/api/defaults/index.js';
import applyTransform, {
  camelToSnake,
  generateUrl,
  merge,
  notify,
  sanitize,
  snakeToCamel,
} from '@webitel/ui-sdk/src/api/transformers/index.js';
import { snakeToKebab } from '@webitel/ui-sdk/src/scripts/index.js';

import instance from '../../../../../app/api/instance.js';
import ftsServiceAPI from '../../../../cases/api/FTSServiceAPI.js';
import { stringifyCaseFilters } from '../../../../cases/api/stringifyCaseFilters.js';

function transformSourceType(data) {
  if (Array.isArray(data)) {
    return data.map((item) => {
      if (item.source?.type) {
        item.source.type = snakeToKebab(item.source.type.toLowerCase());
      }
      return item;
    });
  }

  if (data.source?.type) {
    data.source.type = snakeToKebab(data.source.type.toLowerCase());
  }
  return data;
}

const getContactCasesList = async (params) => {
  const fieldsToSend = [
    'page',
    'size',
    'q',
    'ids',
    'sort',
    'fields',
    'filters',
  ];

  let ftsIds;
  const { fts } = params;
  if (fts) {
    try {
      const { items } = await ftsServiceAPI.getList({
        page: params.page,
        size: params.size,
        fts: params.fts,
        sort: params.sort,
        object_name: ['cases', 'case_comments'],
      });
      ftsIds = items.map(({ id }) => id);
    } catch {
      // skip error, load cases without fts
    }
  }

  // @author @Lera24
  // [WTEL-6766](https://webitel.atlassian.net/browse/WTEL-6766)
  // Filter params and return only filters except for technical fields (example page, size and other)

  const filters = Object.fromEntries(
    Object.entries(params).filter(([key]) => !fieldsToSend.includes(key)),
  );
  const url = applyTransform(
    {
      ...params,
      ids: params.ids || ftsIds,
      fields: [...params.fields, 'etag', 'id'],
    },
    [
      merge(getDefaultGetParams()),
      (params) => ({
        ...params,
        q: params.search,
        filters: stringifyCaseFilters(filters),
      }),
      sanitize(fieldsToSend),
      camelToSnake(),
      generateUrl(`contacts/${params.parentId}/cases`),
    ],
  );

  try {
    const response = await instance.get(url);

    const { items, next } = applyTransform(response.data, [
      merge(getDefaultGetListResponse()),
    ]);
    return {
      items: applyTransform(items, [snakeToCamel(), transformSourceType]),
      next,
    };
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const ContactCasesAPI = {
  getList: getContactCasesList,
};

export default ContactCasesAPI;
