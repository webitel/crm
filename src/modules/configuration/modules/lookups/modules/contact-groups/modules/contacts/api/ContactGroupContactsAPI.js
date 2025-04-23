import { contactGroups } from '@webitel/ui-sdk/src/api/clients/index';
import { contacts } from '@webitel/ui-sdk/src/api/clients/сontacts/index';

const ContactGroupContactsAPI = {
  ...contactGroups,
  getList: contacts.getList,
};

export default ContactGroupContactsAPI;
