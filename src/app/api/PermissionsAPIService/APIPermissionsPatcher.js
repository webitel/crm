import applyTransform, {
  camelToSnake,
  notify,
  snakeToCamel,
} from '@webitel/ui-sdk/src/api/transformers/index.js';
import instance from '../instance';

export default class APIPermissionsPatcher {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.patcher = async ({ changes, id }) => {
      const afterUrl = 'acl';
      const body = applyTransform(changes, [camelToSnake()]);
      const url = `${baseUrl}/${id}/${afterUrl}`;
      try {
        const response = await instance.patch(url, body);
        return applyTransform(response.data, [snakeToCamel()]);
      } catch (err) {
        throw applyTransform(err, [notify]);
      }
    };
  }

  async patchItem({ id, changes }) {
    return this.patcher({ id, changes });
  }
}
