import ChatGatewayProvider
  from '@webitel/ui-sdk/src/enums/ChatGatewayProvider/ChatGatewayProvider.enum';
import AccessMode
  from '../../../modules/contacts/modules/permissions/enums/AccessMode.enum';

export default {
  crm: 'CRM',
  contacts: {
    contact: 'Контакт | Контакти',
    manager: 'Власник | Власники',
    destination: 'Призначення',
    collapseAll: 'Згорнути все',
    timeline: {
      timeline: 'Хронологія',
      actions: {
        openInHistory: 'Відкрити в історії',
        playRecording: 'Програти запис',
        transcription: 'Транскрипція',
      },
      status: {
        started: 'Начало',
        missed: 'Пропущен',
        transferred: 'Переведено',
        ended: 'Конец',
      },
      mouth: {
        jan: 'Січень',
        feb: 'Лютий',
        mar: 'Березень',
        apr: 'квітень',
        may: 'Травень',
        jun: 'Червень',
        jul: 'Липень',
        aug: 'Серпень',
        sep: 'Вересень',
        oct: 'Жовтень',
        nov: 'Листопад',
        dec: 'Грудень',
      },
      dayWeek: {
        mon: 'Понеділок',
        tue: 'Вівторок',
        wed: 'Середа',
        thu: 'Четвер',
        fri: 'П\'ятниця',
        sat: 'Субота',
        syn: 'Неділя',
      },
    },
    communications: {
      communications: 'Засіб зв\'язку | Засоби зв\'язку',
      channel: 'Канал',
      destination: 'Призначення',
      setAsPrimary: 'Встановити як основний',
      emails: {
        addTitle: 'Додати електронну адресу',
        editTitle: 'Редагувати електронну адресу',
        dummy: 'Електронні адреси ще не додано',
      },
      phones: {
        addTitle: 'Додати номер телефону',
        editTitle: 'Редагувати номер телефону',
        dummy: 'Телефонні номери ще не додано',
      },
      messaging: {
        gateway: 'Шлюз',
        provider: 'Провайдер',
        dummy: 'Поки ще не було текстових діалогів',
        messengers: {
          [ChatGatewayProvider.TELEGRAM_BOT]: 'Telegram Бот',
          [ChatGatewayProvider.TELEGRAM_APP]: 'Telegram Застосунок',
          [ChatGatewayProvider.MESSENGER]: 'Meta',
          [ChatGatewayProvider.VIBER]: 'Viber',
          [ChatGatewayProvider.WEBCHAT]: 'Web chat',
          [ChatGatewayProvider.INFOBIP]: 'Infobip',
        },
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
