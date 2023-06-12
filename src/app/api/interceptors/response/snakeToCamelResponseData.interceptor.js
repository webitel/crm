/* eslint-disable no-param-reassign */
import { objSnakeToCamel } from '@webitel/ui-sdk/src/scripts/caseConverters';

const onFulfilled = (DO_NOT_CONVERT_KEYS = []) => (response) => (
  objSnakeToCamel(response.data, DO_NOT_CONVERT_KEYS)
);

const setup = (DO_NOT_CONVERT_KEYS = []) => [
  onFulfilled(DO_NOT_CONVERT_KEYS),
];

const snakeToCamelResponseData = {
  setup,
  default: [onFulfilled([])],
};

export default snakeToCamelResponseData;
