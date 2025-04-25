import { contactGroups } from '@webitel/ui-sdk/src/api/clients/index';
import { contacts } from '@webitel/ui-sdk/src/api/clients/сontacts/index';

const ContactGroupContactsAPI = {
  delete: contactGroups.removeContactsFromGroup,
  getList: contacts.getList,
};

export default ContactGroupContactsAPI;
