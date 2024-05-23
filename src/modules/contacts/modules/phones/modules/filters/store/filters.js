import FiltersStoreModule
  from '@webitel/ui-sdk/src/modules/Filters/store/FiltersStoreModule';
import { useRouter } from 'vue-router';

const router = useRouter();

const filtersList = [
  {
    name: 'page',
    value: 1,
    defaultValue: 1,
    router,
    get: ['value', 'query'],
    set: ['value', 'query'],
    restore: ['query'],
  },
  {
    name: 'size',
    value: 1000,
    defaultValue: 1000,
    router,
    get: ['value', 'query'],
    set: ['value', 'query'],
    restore: ['query'],
  },
  {
    name: 'sort',
    value: '',
    defaultValue: '',
    router,
    get: ['value', 'query'],
    set: ['value', 'query'],
    restore: ['query'],
  },
];

const filters = new FiltersStoreModule()
.addFilter(filtersList)
.getModule();

export default filters;
