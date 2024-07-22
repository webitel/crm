import FiltersStoreModule
  from '@webitel/ui-sdk/src/modules/Filters/store/FiltersStoreModule';
import SearchMode from '../enums/SearchMode.enum';

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
  {
    name: SearchMode.NAME,
  },
  {
    name: SearchMode.LABELS,
  },
  {
    name: SearchMode.ABOUT,
  },
  {
    name: SearchMode.VARIABLES,
  },
  {
    name: SearchMode.DESTINATION,
  },
];

const filters = new FiltersStoreModule()
.addFilter(filtersList)
.getModule();

export default filters;
