import {
  getDefaultInstance,
  getDefaultOpenAPIConfig,
} from '@webitel/ui-sdk/src/api/defaults/index.js';
import { ContactsApiFactory } from 'webitel-sdk';

const instance = getDefaultInstance();
const configuration = getDefaultOpenAPIConfig();

const dynamicGroupConditionsService = new DynamicConditionsApiFactory(
  configuration,
  '',
  instance,
);
