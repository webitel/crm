import {
  WebitelCasesRelationType,
  WebitelCasesSourceType,
  WebitelContactsGroupType,
} from '@webitel/api-services/gen/models';
import ChatGatewayProvider from '@webitel/ui-sdk/src/enums/ChatGatewayProvider/ChatGatewayProvider.enum.js';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum';

import { SearchMode } from '../../../modules/cases/enums/SearchMode.ts';
import AccessMode from '../../../modules/contacts/modules/permissions/enums/AccessMode.enum.js';
import { TimelineEventType } from '../../../modules/timeline/enums/TimelineEventType';
import TimelineTaskStatusEnum from '../../../modules/timeline/enums/TimelineTaskStatus.enum.js';

export default {
  crm: 'CRM',
  contacts: {
    contact: 'Контакт | Контакти',
    manager: 'Власник | Власники',
    destination: 'Призначення',
    collapseAll: 'Згорнути все',
    allContacts: ({ linked }) =>
      `${linked('reusable.all')} ${linked(`contacts.contact`).toLowerCase()}`,
    addContacts: ({ linked }) =>
      `${linked('reusable.add')} ${linked(`vocabulary.contact`).toLowerCase()}`,
    communications: {
      communications: "Засіб зв'язку | Засоби зв'язку",
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
        username: "Ім'я користувача",
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
    details: 'Деталі',
    attributes: 'Атрибут | Атрибути',
  },
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
      [TimelineEventType.Call]: 'Дзвінок | Дзвінки',
      [TimelineEventType.Chat]: 'Чат | Чати',
      [TimelineEventType.Email]: 'Лист | Листи',
    },
    emails: {
      to: 'Кому',
      cc: 'CC',
      subject: 'Тема',
    },
  },
  permissions: {
    read: 'Читати',
    edit: 'Редагувати',
    delete: 'Видаляти',
    granteePopup: {
      title: 'Додати власника прав',
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
    [CrmSections.CASES]: {
      name: 'Звернення',
      text: 'Тут ви можете переглядати Звернення, зареєстровані у системі.',
    },
    configuration: {
      name: 'Конфігурація',
      text: 'У цьому розділі ви можете налаштувати процес роботи зі Зверненнями.',
    },
  },
  cases: {
    case: 'Звернення | Звернення',
    allCases: ({ linked }) =>
      `${linked('reusable.all')} ${linked(`cases.case`).toLowerCase()}`,
    addCase: ({ linked }) =>
      `${linked('reusable.add')} ${linked(`cases.case`).toLowerCase()}`,
    caseInfo: 'Інформація про звернення',
    caseDetails: 'Деталі звернення',
    caseDescription: 'Опис звернення',
    caseResolution: 'Рішення',
    caseResolutionDescription: 'Опис рішення',
    caseResolutionDate: 'Дата рішення',
    caseResolutionUser: 'Користувач рішення',
    caseResolutionReason: 'Причина рішення',
    caseResolutionReasonGroup: 'Група причин рішення',
    caseResolutionReasonGroups: 'Групи причин рішення',
    caseResolutionReasons: 'Причини рішення',
    caseResolutionReasonDescription: 'Опис причини рішення',
    caseResolutionReasonGroupDescription: 'Опис групи причин рішення',
    caseResolutionReasonGroupName: 'Назва групи причин рішення',
    caseResolutionReasonName: 'Назва причини рішення',
    caseResolutionReasonGroupEmpty: 'Групи причин рішення ще не створені',
    caseResolutionReasonEmpty: 'Причини рішення ще не створені',
    caseResolutionReasonGroupSelect: 'Виберіть групу причин рішення',
    caseResolutionReasonSelect: 'Виберіть причину рішення',
    caseResolutionReasonGroupAdd: 'Додати групу причин рішення',
    caseResolutionReasonAdd: 'Додати причину рішення',
    caseResolutionReasonGroupEdit: 'Редагувати групу причин рішення',
    caseResolutionReasonEdit: 'Редагувати причину рішення',
    caseResolutionReasonGroupDelete: 'Видалити групу причин рішення',
    caseResolutionReasonDelete: 'Видалити причину рішення',
    caseResolutionReasonGroupDeleteConfirm:
      'Ви впевнені, що хочете видалити групу причин рішення?',
    caseResolutionReasonDeleteConfirm:
      'Ви впевнені, що хочете видалити причину рішення?',
    caseResolutionReasonGroupDeleteSuccess: 'Група причин рішення видалена',
    caseResolutionReasonDeleteSuccess: 'Причина рішення видалена',
    caseResolutionReasonGroupAddSuccess: 'Група причин рішення додана',
    caseResolutionReasonAddSuccess: 'Причина рішення додана',
    caseResolutionReasonGroupEditSuccess: 'Група причин рішення відредагована',
    caseResolutionReasonEditSuccess: 'Причина рішення відредагована',
    caseResolutionReasonGroupAddError: 'Помилка додавання групи причин рішення',
    caseResolutionReasonAddError: 'Помилка додавання причини рішення',
    caseResolutionReasonGroupEditError:
      'Помилка редагування групи причин рішення',
    caseResolutionReasonEditError: 'Помилка редагування причини рішення',
    caseResolutionReasonGroupDeleteError:
      'Помилка видалення групи причин рішення',
    caseResolutionReasonDeleteError: 'Помилка видалення причини рішення',
    caseResolutionReasonGroupRequired: "Група причин рішення обов'язкова",
    caseResolutionReasonRequired: "Причина рішення обов'язкова",
    caseResolutionReasonGroupNameRequired: "Назва групи причин рішення обов'язкова",
    caseResolutionReasonNameRequired: "Назва причини рішення обов'язкова",
    caseResolutionReasonGroupDescriptionRequired:
      "Опис групи причин рішення обов'язковий",
    caseResolutionReasonDescriptionRequired: "Опис причини рішення обов'язковий",
    caseResolutionReasonGroupNameExists: 'Група причин рішення з такою назвою вже існує',
    caseResolutionReasonNameExists: 'Причина рішення з такою назвою вже існує',
    caseResolutionReasonGroupDescriptionExists:
      'Група причин рішення з таким описом вже існує',
    caseResolutionReasonDescriptionExists: 'Причина рішення з таким описом вже існує',
    caseResolutionReasonGroupNameLength:
      'Назва групи причин рішення повинна бути не більше 255 символів',
    caseResolutionReasonNameLength:
      'Назва причини рішення повинна бути не більше 255 символів',
    caseResolutionReasonGroupDescriptionLength:
      'Опис групи причин рішення повинен бути не більше 255 символів',
    caseResolutionReasonDescriptionLength:
      'Опис причини рішення повинен бути не більше 255 символів',
    caseResolutionReasonGroupNamePattern:
      'Назва групи причин рішення повинна містити тільки літери, цифри, пробіли та символи - _ . , ( )',
    caseResolutionReasonNamePattern:
      'Назва причини рішення повинна містити тільки літери, цифри, пробіли та символи - _ . , ( )',
    caseResolutionReasonGroupDescriptionPattern:
      'Опис групи причин рішення повинен містити тільки літери, цифри, пробіли та символи - _ . , ( )',
    caseResolutionReasonDescriptionPattern:
      'Опис причини рішення повинен містити тільки літери, цифри, пробіли та символи - _ . , ( )',
    caseResolutionReasonGroupNameUnique: 'Назва групи причин рішення повинна бути унікальною',
    caseResolutionReasonNameUnique: 'Назва причини рішення повинна бути унікальною',
    caseResolutionReasonGroupDescriptionUnique:
      'Опис групи причин рішення повинен бути унікальним',
    caseResolutionReasonDescriptionUnique: 'Опис причини рішення повинен бути унікальним',
    caseResolutionReasonGroupNameRequired: "Назва групи причин рішення обов'язкова",
    caseResolutionReasonNameRequired: "Назва причини рішення обов'язкова",
    caseResolutionReasonGroupDescriptionRequired:
      "Опис групи причин рішення обов'язковий",
    caseResolutionReasonDescriptionRequired: "Опис причини рішення обов'язковий",
    caseResolutionReasonGroupNameExists: 'Група причин рішення з такою назвою вже існує',
    caseResolutionReasonNameExists: 'Причина рішення з такою назвою вже існує',
    caseResolutionReasonGroupDescriptionExists:
      'Група причин рішення з таким описом вже існує',
    caseResolutionReasonDescriptionExists: 'Причина рішення з таким описом вже існує',
    caseResolutionReasonGroupNameLength:
      'Назва групи причин рішення повинна бути не більше 255 символів',
    caseResolutionReasonNameLength:
      'Назва причини рішення повинна бути не більше 255 символів',
    caseResolutionReasonGroupDescriptionLength:
      'Опис групи причин рішення повинен бути не більше 255 символів',
    caseResolutionReasonDescriptionLength:
      'Опис причини рішення повинен бути не більше 255 символів',
    caseResolutionReasonGroupNamePattern:
      'Назва групи причин рішення повинна містити тільки літери, цифри, пробіли та символи - _ . , ( )',
    caseResolutionReasonNamePattern:
      'Назва причини рішення повинна містити тільки літери, цифри, пробіли та символи - _ . , ( )',
    caseResolutionReasonGroupDescriptionPattern:
      'Опис групи причин рішення повинен містити тільки літери, цифри, пробіли та символи - _ . , ( )',
    caseResolutionReasonDescriptionPattern:
      'Опис причини рішення повинен містити тільки літери, цифри, пробіли та символи - _ . , ( )',
    caseResolutionReasonGroupNameUnique: 'Назва групи причин рішення повинна бути унікальною',
    caseResolutionReasonNameUnique: 'Назва причини рішення повинна бути унікальною',
    caseResolutionReasonGroupDescriptionUnique:
      'Опис групи причин рішення повинен бути унікальним',
    caseResolutionReasonDescriptionUnique: 'Опис причини рішення повинен бути унікальним',
    search: {
      [SearchMode.Search]: 'Звичайний пошук',
      [SearchMode.Fts]: 'Повнотекстовий пошук',
      [SearchMode.Description]: 'Опис',
    },
    relationType: {
      [WebitelCasesRelationType.PARENT]: 'Батьківське',
      [WebitelCasesRelationType.CHILD]: 'Дочірнє',
      [WebitelCasesRelationType.RELATED]: "Пов'язане",
    },
    sourceType: {
      [WebitelCasesSourceType.CALL]: 'Дзвінок',
      [WebitelCasesSourceType.CHAT]: 'Чат',
      [WebitelCasesSourceType.EMAIL]: 'Електронна пошта',
      [WebitelCasesSourceType.FORM]: 'Форма',
      [WebitelCasesSourceType.MANUAL]: 'Вручну',
    },
  },
  contactGroups: {
    contactGroup: 'Група контактів | Групи контактів',
    allContactGroups: ({ linked }) =>
      `${linked('reusable.all')} ${linked(
        `contactGroups.contactGroup`,
      ).toLowerCase()}`,
    addContactGroup: ({ linked }) =>
      `${linked('reusable.add')} ${linked(
        `contactGroups.contactGroup`,
      ).toLowerCase()}`,
    contactGroupInfo: 'Інформація про групу контактів',
    contactGroupDetails: 'Деталі групи контактів',
    contactGroupDescription: 'Опис групи контактів',
    contactGroupType: 'Тип групи контактів',
    contactGroupTypes: {
      [WebitelContactsGroupType.STATIC]: 'Статична',
      [WebitelContactsGroupType.DYNAMIC]: 'Динамічна',
    },
  },
};