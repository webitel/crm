import FiltersStoreModule from '@webitel/ui-sdk/src/modules/Filters/store/FiltersStoreModule';

const filtersList = [
  {
    name: 'page',
    value: 1,
  },
  {
    name: 'size',
    value: 1000,
  },
  {
    name: 'sort',
  },
];

const filters = new FiltersStoreModule().addFilter(filtersList).getModule();

export default filters;
