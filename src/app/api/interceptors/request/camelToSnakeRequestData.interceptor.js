/* eslint-disable no-param-reassign */
import { objCamelToSnake } from '@webitel/ui-sdk/src/scripts/caseConverters';

const onFulfilled = (DO_NOT_CONVERT_KEYS = []) => (request) => {
  if (request.method === 'post'
    || request.method === 'put'
    || request.method === 'patch') {
    if (typeof request.data === 'string') {
      request.data = JSON
        .stringify(objCamelToSnake(JSON.parse(request.data), DO_NOT_CONVERT_KEYS));
    } else {
      request.data = objCamelToSnake(request.data, DO_NOT_CONVERT_KEYS);
    }
  }
  return request;
};

const setup = (DO_NOT_CONVERT_KEYS = []) => [
  onFulfilled(DO_NOT_CONVERT_KEYS),
];

const camelToSnakeRequestData = {
  setup,
  default: [onFulfilled([])],
};

export default camelToSnakeRequestData;
