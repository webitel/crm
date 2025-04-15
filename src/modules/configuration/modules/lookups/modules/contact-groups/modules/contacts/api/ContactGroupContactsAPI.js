import {
  contacts,
  ContactsSearchMode,
} from '@webitel/ui-sdk/src/api/clients/сontacts/index';
import {
  getDefaultGetListResponse,
  getDefaultGetParams,
  getDefaultInstance,
  getDefaultOpenAPIConfig,
} from '@webitel/ui-sdk/src/api/defaults/index.js';
import applyTransform, {
  camelToSnake,
  merge,
  notify,
  sanitize,
  snakeToCamel,
} from '@webitel/ui-sdk/src/api/transformers/index';
import { ContactsApiFactory } from 'webitel-sdk';

const instance = getDefaultInstance();
const configuration = getDefaultOpenAPIConfig();

const contactService = new ContactsApiFactory(configuration, '', instance);

const formatAccessMode = (item) => ({
  ...item,
  access: {
    edit: item.mode.includes('w'),
    delete: item.mode.includes('d'),
  },
});

const getList = async ({ parentId, ...params }) => {
  const fieldsToSend = [
    'page',
    'size',
    'q',
    'sort',
    'fields',
    'id',
    'qin',
    'groupId',
    'notIdGroup',
  ];

  if (!params.fields) {
    params.fields = [
      'id',
      'etag',
      'name',
      'managers',
      'labels',
      'about',
      'variables',
      'timezones',
      'phones',
      'emails',
      'imclients',
    ];
  }

  const listResponseHandler = (items) =>
    items?.map((item) => ({
      ...item,
      name: item.name.commonName,
      managers: item.managers ? [...item.managers.data] : [],
      labels: item.labels ? [...item.labels.data] : [],
      groups: getGroupsFromResponse(item),
      variables: item.variables ? [...item.variables.data] : [],
      timezones: item.timezones ? [...item.timezones.data] : [],
      phones: item.phones ? [...item.phones.data] : [],
      emails: item.emails ? [...item.emails.data] : [],
    }));
  let changedParams;

  if (params?.search) {
    changedParams = { ...params, q: params.search };
  } else if (params?.q && params?.qin) {
    changedParams = { ...params };
  } else {
    let searchValue = '';
    let searchKey = '';

    if (params[ContactsSearchMode.NAME]) {
      searchValue = params[ContactsSearchMode.NAME];
      searchKey = ContactsSearchMode.NAME;
    } else if (params[ContactsSearchMode.LABELS]) {
      searchValue = params[ContactsSearchMode.LABELS];
      searchKey = ContactsSearchMode.LABELS;
    } else if (params[ContactsSearchMode.ABOUT]) {
      searchValue = params[ContactsSearchMode.ABOUT];
      searchKey = ContactsSearchMode.ABOUT;
    } else if (params[ContactsSearchMode.VARIABLES]) {
      searchValue = params[ContactsSearchMode.VARIABLES];
      searchKey = ContactsSearchMode.VARIABLES;
    } else if (params[ContactsSearchMode.DESTINATION]) {
      searchValue = params[ContactsSearchMode.DESTINATION];
      searchKey = 'emails,phones,imclients{user{name}}';
    }

    // This code needed for adding starToSearch method to applyTransform while searchKey !== SearchMode.VARIABLES because '*' in variables search mode brokes backend logic.
    // if (searchKey !== ContactsSearchMode.VARIABLES) {
    //   transformations.push(starToSearch('q')); WTEL-4265
    // }

    changedParams = {
      ...params,
      q: searchValue || '',
      qin: searchKey || '',
    };
  }

  const transformations = [
    sanitize(fieldsToSend),
    merge(getDefaultGetParams()),
    camelToSnake(),
  ];

  const { page, size, q, sort, fields, id, qin, mode, not_id_group } =
    applyTransform(changedParams, transformations);

  try {
    const response = await contactService.searchContacts(
      page,
      size,
      q,
      sort || '+name',
      ['mode', ...fields],
      id,
      qin,
      mode,
      [parentId],
      not_id_group,
    );

    const { items, next } = applyTransform(
      { ...response.data, items: response.data.data || [] },
      [snakeToCamel(['custom']), merge(getDefaultGetListResponse())],
    );

    return {
      items: applyTransform(items, [
        (items) => items?.map((item) => formatAccessMode(item)),
        listResponseHandler,
      ]),
      next,
    };
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const getGroupsFromResponse = (item) => {
  return item.groups ? [...item.groups.data.map((el) => el.group)] : [];
};

const ContactGroupContactsAPI = {
  ...contacts,
  getList,
};

export default ContactGroupContactsAPI;
