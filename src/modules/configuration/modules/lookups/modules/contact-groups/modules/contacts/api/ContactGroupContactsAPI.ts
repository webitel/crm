import { ContactGroupsAPI,ContactsAPI } from '@webitel/api-services/api';

const ContactGroupContactsAPI = {
  delete: ContactGroupsAPI.removeContactsFromGroup,
  getList: ContactsAPI.getList,
};

export default ContactGroupContactsAPI;
