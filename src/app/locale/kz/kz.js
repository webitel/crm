import AccessMode
  from '../../../modules/contacts/modules/permissions/enums/AccessMode.enum.js';

export default {
  crm: 'CRM',
  contacts: {
    contact: 'Байланыс | Байланыстар',
    manager: 'Иесі | Иелері',
    communications: {
      communications: 'Байланыс құралы | Байланыс құралдары',
      channel: 'Арна',
      destination: 'Тағайындау',
      setAsPrimary: 'Негізгісі ретінде орнату',
    },
  },
  timeline: {
    timeline: 'Хронология',
  },
  permissions: {
    read: 'Оқу',
    edit: 'Редакциялау',
    delete: 'Жою',
    accessMode: {
      [AccessMode.FORBIDDEN]: 'Тыйым салынған',
      [AccessMode.ALLOW]: 'Рұқсат берілген',
      [AccessMode.MANAGE]: 'Басқару',
    },
  },
};
