import FiltersStoreModule from '@webitel/ui-sdk/src/modules/Filters/store/FiltersStoreModule';

const filtersList = [
  {
    name: 'page',
    value: 1,
    defaultValue: 1,
  },
  {
    name: 'size',
    value: 10,
    defaultValue: 10,
  },
  {
    name: 'sort',
  },
  { name: 'search' },
];

const filters = new FiltersStoreModule().addFilter(filtersList).getModule();

export default filters;
