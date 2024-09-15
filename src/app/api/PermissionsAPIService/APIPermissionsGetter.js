import { getDefaultGetListResponse, getDefaultGetParams } from '@webitel/ui-sdk/src/api/defaults/index.js';
import applyTransform, {
  camelToSnake,
  generateUrl,
  merge,
  mergeEach,
  notify,
  sanitize,
  snakeToCamel,
  starToSearch,
} from '@webitel/ui-sdk/src/api/transformers/index.js';
import instance from '../instance';

export default class APIPermissionsGetter {
  nestedUrl = 'acl';

  constructor(url) {
    this.baseUrl = url;

    this.listGetter = async ({ parentId, ...params }) => {
      const fieldsToSend = ['page', 'size', 'q', 'sort', 'fields', 'id'];

      const defaultObject = {
        user: false,
      };

      const url = applyTransform(params, [
        merge(getDefaultGetParams()),
        starToSearch('search'),
        (params) => ({
          ...params,
          q: params.search,
        }),
        sanitize(fieldsToSend),
        camelToSnake(),
        generateUrl(`${this.baseUrl}/${parentId}/${this.nestedUrl}`),
      ]);
      try {
        const response = await instance.get(url);
        const { items, next } = applyTransform(response.data, [
          snakeToCamel(),
          merge(getDefaultGetListResponse()),
        ]);
        return {
          items: applyTransform(items, [
            mergeEach(defaultObject),
            APIPermissionsGetter.handlePermissionsList,
          ]),
          next,
        };
      } catch (err) {
        throw applyTransform(err, [notify]);
      }
    };
  }

  static handlePermissionsList(items) {
    return items.map((item) => ({
      ...item,
      access: {
        x: {
          id: (item.granted.match(/x/g) || []).length + 1,
          rule: 'x'.repeat((item.granted.match(/x/g) || []).length),
        },
        r: {
          id: (item.granted.match(/r/g) || []).length + 1,
          rule: 'r'.repeat((item.granted.match(/r/g) || []).length),
        },
        w: {
          id: (item.granted.match(/w/g) || []).length + 1,
          rule: 'w'.repeat((item.granted.match(/w/g) || []).length),
        },
        d: {
          id: (item.granted.match(/d/g) || []).length + 1,
          rule: 'd'.repeat((item.granted.match(/d/g) || []).length),
        },
      },
    }));
  }

  async getList(params) {
    return this.listGetter(params);
  }
}
