import FiltersStoreModule
  from '@webitel/ui-sdk/src/modules/Filters/store/FiltersStoreModule';
import ContactsSearchMode
  from '@webitel/ui-sdk/src/api/crm/enums/ContactsSearchMode.js';

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
    name: ContactsSearchMode.NAME,
  },
  {
    name: ContactsSearchMode.LABELS,
  },
  {
    name: ContactsSearchMode.ABOUT,
  },
  {
    name: ContactsSearchMode.VARIABLES,
  },
  {
    name: ContactsSearchMode.DESTINATION,
  },
];

const filters = new FiltersStoreModule()
.addFilter(filtersList)
.getModule();

export default filters;
