import ChatGatewayProvider
  from '@webitel/ui-sdk/src/enums/ChatGatewayProvider/ChatGatewayProvider.enum';
import AccessMode
  from '../../../modules/contacts/modules/permissions/enums/AccessMode.enum';

export default {
  crm: 'CRM',
  contacts: {
    contact: 'Контакт | Контакты',
    manager: 'Владелец | Владельцы',
    destination: 'Назначение',
    collapseAll: 'Свернуть все',
    timeline: {
      timeline: 'Хронология',
      actions: {
        openInHistory: 'Открыть в истории',
        playRecording: 'Проиграть запись',
        transcription: 'Транскрипция',
      },
      status: {
        started: 'Початок',
        missed: 'Пропущений',
        transferred: 'Переведено',
        ended: 'Кінець',
      },
      mouth: {
        jan: 'Январь',
        feb: 'Февраль',
        mar: 'Март',
        apr: 'Апрель',
        may: 'Май',
        jun: 'Июнь',
        jul: 'Июль',
        aug: 'Август',
        sep: 'Сентябрь',
        oct: 'Октябрь',
        nov: 'Ноябрь',
        dec: 'Декабрь',
      },
      dayWeek: {
        mon: 'Понедельник',
        tue: 'Вторник',
        wed: 'Среда',
        thu: 'Четверг',
        fri: 'Пятница',
        sat: 'Суббота',
        syn: 'Воскресенье',
      },
    },
    communications: {
      communications: 'Средство связи | Средства связи',
      channel: 'Канал',
      destination: 'Назначение',
      setAsPrimary: 'Установить как основной',
      emails: {
        addTitle: 'Добавить електронный адрес',
        editTitle: 'Редактировать електронный адрес',
        dummy: 'Электронные адреса еще не добавлены',
      },
      phones: {
        addTitle: 'Добавить номер телефона',
        editTitle: 'Редактировать номер телефона',
        dummy: 'Телефонные номера еще не добавлены',
      },
      messaging: {
        gateway: 'Шлюз',
        provider: 'Провайдер',
        dummy: 'Пока еще не было текстовых диалогов',
        messengers: {
          [ChatGatewayProvider.TELEGRAM_BOT]: 'Telegram Бот',
          [ChatGatewayProvider.TELEGRAM_APP]: 'Telegram Приложение',
          [ChatGatewayProvider.MESSENGER]: 'Meta',
          [ChatGatewayProvider.VIBER]: 'Viber',
          [ChatGatewayProvider.WEBCHAT]: 'Web chat',
          [ChatGatewayProvider.INFOBIP]: 'Infobip',
        },
      },
    },
    attributes: 'Атрибут | Атрибуты',
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
