import AccessMode
  from '../../../modules/contacts/modules/permissions/enums/AccessMode.enum';

export default {
  crm: 'CRM',
  contacts: {
    contact: 'Contact | Contacts',
    manager: 'Owner | Owners',
    timeline: {
      timeline: 'Timeline',
    },
    communications: {
      communications: 'Communication option | Communication options',
      channel: 'Channel',
      destination: 'Destination',
      setAsPrimary: 'Set as primary',
      emails: {
        dummy: 'There are no email addresses yet',
      },
      phones: {
        dummy: 'There are no phone numbers yet',
      },
    },
  },
  permissions: {
    read: 'Read',
    edit: 'Edit',
    delete: 'Delete',
    granteePopup: {
      title: 'Add grantee',
    },
    accessMode: {
      [AccessMode.ALLOW]: 'Allow',
      [AccessMode.FORBIDDEN]: 'Forbidden',
      [AccessMode.MANAGE]: 'Allow with delegation',
    },
  },
  filters: {
    variableSearchHint: 'Query format: "key=value"',
  },
};
