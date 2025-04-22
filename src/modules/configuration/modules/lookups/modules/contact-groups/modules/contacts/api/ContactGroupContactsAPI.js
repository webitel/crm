import { contacts } from '@webitel/ui-sdk/src/api/clients/сontacts/index';

import { contactGroups } from '../../../../../../../../../../../../sdk/webitel-ui-sdk/src/api/clients';

const ContactGroupContactsAPI = {
  ...contacts,
  delete: contactGroups.removeContactsFromGroup,
};

export default ContactGroupContactsAPI;
