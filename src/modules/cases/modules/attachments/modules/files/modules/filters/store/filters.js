import FiltersStoreModule from '@webitel/ui-sdk/src/modules/Filters/store/FiltersStoreModule.js';

const filtersList = [
  {
    name: 'page',
    value: 1,
    defaultValue: 1,
  },
  {
    name: 'size',
    value: 100,
    defaultValue: 5,
  },
  { name: 'sort' },
  { name: 'search' },
];
const filters = new FiltersStoreModule().addFilter(filtersList).getModule();

export default filters;
