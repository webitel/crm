import AccessMode
  from '../../../modules/contacts/modules/permissions/enums/AccessMode.enum';

export default {
  crm: 'CRM',
  contacts: {
    contact: 'Контакт | Контакти',
    manager: 'Власник | Власники',
    destination: 'Призначення',
    timeline: {
      timeline: 'Хронологія',
    },
    communications: {
      communications: 'Засіб зв\'язку | Засоби зв\'язку',
      channel: 'Канал',
      destination: 'Призначення',
      setAsPrimary: 'Встановити як основний',
      emails: {
        title: 'Електронна адреса',
        dummy: 'Електронні адреси ще не додано',
      },
      phones: {
        title: 'Номер телефону',
        dummy: 'Телефонні номери ще не додано',
      },
    },
    attributes: 'Атрибут | Атрибути',
  },
  permissions: {
    read: 'Читати',
    edit: 'Редагувати',
    delete: 'Видаляти',
    granteePopup: {
      title: 'Додати отримувача',
    },
    accessMode: {
      [AccessMode.FORBIDDEN]: 'Заборонено',
      [AccessMode.ALLOW]: 'Дозволено',
      [AccessMode.MANAGE]: 'Управління',
    },
  },
};
