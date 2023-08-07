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
    },
  },
  permissions: {
    read: 'Read',
    edit: 'Edit',
    delete: 'Delete',
    accessMode: {
      [AccessMode.ALLOW]: 'Allow',
      [AccessMode.FORBIDDEN]: 'Forbidden',
      [AccessMode.MANAGE]: 'Allow with delegation',
    },
  },
};
