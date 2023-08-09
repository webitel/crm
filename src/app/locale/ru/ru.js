import AccessMode
  from '../../../modules/contacts/modules/permissions/enums/AccessMode.enum';

export default {
  crm: 'CRM',
  contacts: {
    contact: 'Контакт | Контакты',
    manager: 'Владелец | Владельцы',
    timeline: {
      timeline: 'Хронология',
    },
    communications: {
      communications: 'Средство связи | Средства связи',
      channel: 'Канал',
      destination: 'Назначение',
      setAsPrimary: 'Установить как основной',
    },
  },
  permissions: {
    read: 'Читать',
    edit: 'Редактировать',
    delete: 'Удалить',
    granteePopup: {
      title: 'Добавить получателя',
    },
    accessMode: {
      [AccessMode.FORBIDDEN]: 'Запрещено',
      [AccessMode.ALLOW]: 'Разрешено',
      [AccessMode.MANAGE]: 'Управление',
    },
  },
};
