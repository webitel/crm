import AccessMode
  from '../../../modules/contacts/modules/permissions/enums/AccessMode.enum';

export default {
  crm: 'CRM',
  contacts: {
    contact: 'Контакт | Контактілер',
    manager: 'Иесі | Иелері',
    timeline: {
      timeline: 'Хронология',
    },
    communications: {
      communications: 'Байланыс құралдары',
      channel: 'Арна',
      destination: 'Мақсат',
      setAsPrimary: 'Негізгі ретінде орнату',
    },
  },
  permissions: {
    read: 'Оқу',
    edit: 'Өңдеу',
    delete: 'Жою',
    accessMode: {
      [AccessMode.FORBIDDEN]: 'Тыйым салынған',
      [AccessMode.ALLOW]: 'Рұқсат',
      [AccessMode.MANAGE]: 'Бақылау',
    },
  },
};
