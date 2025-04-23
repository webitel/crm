import { contactGroups } from '@webitel/ui-sdk/src/api/clients/index';
import { contacts } from '@webitel/ui-sdk/src/api/clients/сontacts/index';

const ContactGroupContactsAPI = {
  delete: contactGroups.delete,
  getList: contacts.getList,
};

export default ContactGroupContactsAPI;
