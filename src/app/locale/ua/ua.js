import { WebitelContactsTimelineEventType } from 'webitel-sdk';
import { CasesSourceType } from 'webitel-sdk';
import ChatGatewayProvider
  from '@webitel/ui-sdk/src/enums/ChatGatewayProvider/ChatGatewayProvider.enum.js';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum';
import AccessMode
  from '../../../modules/contacts/modules/permissions/enums/AccessMode.enum.js';
import TimelineTaskStatusEnum
  from '../../../modules/contacts/modules/timeline/enums/TimelineTaskStatus.enum.js';
import TypesContactGroupsEnum
  from '../../../modules/configuration/modules/lookups/modules/contact-groups/enums/TypeContactGroups.enum.js';

export default {
  crm: 'CRM',
  contacts: {
    contact: 'Контакт | Контакти',
    manager: 'Власник | Власники',
    destination: 'Призначення',
    collapseAll: 'Згорнути все',
    timeline: {
      timeline: 'Хронологія',
      totalDuration: 'Загальна тривалість',
      actions: {
        openInHistory: 'Відкрити в історії',
        playRecording: 'Програти запис',
        transcription: 'Транскрипція',
      },
      status: {
        [TimelineTaskStatusEnum.STARTED]: 'Початок',
        [TimelineTaskStatusEnum.MISSED]: 'Пропущений',
        [TimelineTaskStatusEnum.TRANSFERRED]: 'Переведено',
        [TimelineTaskStatusEnum.ENDED]: 'Кінець',
        [TimelineTaskStatusEnum.SENT]: 'Надіслано',
        [TimelineTaskStatusEnum.RECEIVED]: 'Отримано',
      },
      eventType: {
        [WebitelContactsTimelineEventType.Call]: 'Дзвінок | Дзвінки',
        [WebitelContactsTimelineEventType.Chat]: 'Чат | Чати',
        [WebitelContactsTimelineEventType.Email]: 'Лист | Листи',
      },
      emails: {
        to: 'Кому',
        cc: 'CC',
        subject: 'Тема',
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
        username: 'Ім\'я користувача',
        dummy: 'Поки ще не було текстових діалогів',
        messengers: {
          [ChatGatewayProvider.TELEGRAM_BOT]: 'Telegram Бот',
          [ChatGatewayProvider.TELEGRAM_APP]: 'Telegram Застосунок',
          [ChatGatewayProvider.MESSENGER]: 'Meta',
          [ChatGatewayProvider.VIBER]: 'Viber',
          [ChatGatewayProvider.WEBCHAT]: 'Web chat',
          [ChatGatewayProvider.INFOBIP]: 'Infobip',
          [ChatGatewayProvider.CUSTOM]: 'Custom Chat Gateway',
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
  startPage: {
    [CrmSections.CONTACTS]: {
      name: 'Контакти',
      text: 'У цьому розділі ви можете працювати з Контактами: клієнтами, партнерами тощо.',
    },
    configuration: {
      name: 'Конфігурація',
      text: 'Тут ви можете переглядати Звернення, зареєстровані у системі.',
    },
  },
  lookups: {
    lookups: 'Довідники',

    slas: {
      slas: 'SLA | SLAs',
      conditions: 'Умова | Умови',
      editCondition: 'Редагувати умову',
      addCondition: 'Додати умову',
      reactionTime: 'Плановий час реакції',
      resolutionTime: 'Плановий час вирішення',
      validFrom: 'Дійсний з',
      validTo: 'Дійсний до',
    },

    sources: {
      sources: 'Джерело звернень | Джерела звернень',

      types: {
        [CasesSourceType.CALL]: 'Дзвінок',
        [CasesSourceType.CHAT]: 'Чат',
        [CasesSourceType.SOCIALMEDIA]: 'Соціальна мережа',
        [CasesSourceType.EMAIL]: 'Лист',
        [CasesSourceType.API]: 'API',
        [CasesSourceType.MANUAL]: 'Створене вручну',
      },
    },
    contactGroups: {
      contactGroups: 'Група контактів | Групи контактів',
      defaultGroup: 'Група за замовчуванням',
      addGroup: 'Додати контакти',
      types: {
        [TypesContactGroupsEnum.DYNAMIC]: 'Динамічна',
        [TypesContactGroupsEnum.STATIC]: 'Статична',
      },
    },
    [CrmSections.STATUSES]: 'Статуси',
  },
};
