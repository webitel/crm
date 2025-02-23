import ChatGatewayProvider from '@webitel/ui-sdk/src/enums/ChatGatewayProvider/ChatGatewayProvider.enum.js';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum';
import { CasesRelationType } from 'webitel-sdk';
import { CasesSourceType } from 'webitel-sdk';
import { WebitelContactsGroupType } from 'webitel-sdk';

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
      reactionTimeTitle: 'Плановий час реакції (dd:hh:mm)',
      resolutionTime: 'Плановий час вирішення',
      resolutionTimeTitle: 'Плановий час вирішення (dd:hh:mm)',
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

    serviceCatalogs: {
      serviceCatalogs: 'Каталог сервісів | Каталоги сервісів',
      prefix: 'Префікс',
      code: 'Код',
      statuses: ({ linked }) => linked(`lookups.statuses.statuses`, 2),
      skills: 'Навички',
    },

    service: {
      service: 'Cервіси | Cервіси',
    },

    contactGroups: {
      contactGroups: 'Група контактів | Групи контактів',
      defaultGroup: 'Група за замовчуванням',
      addGroup: 'Додати контакти',
      assignee: 'Виконавець',
      types: {
        [WebitelContactsGroupType.DYNAMIC]: 'Динамічна',
        [WebitelContactsGroupType.STATIC]: 'Статична',
      },
    },

    closeReasonGroups: {
      closeReasonGroups: 'Причини закриття',
      reason: 'Причина | Причини',
      addReason: 'Додати причину',
      editReason: 'Редагувати причину',
      sameConditionError: 'Така умова вже існує',
    },

    statuses: {
      statuses: 'Статус | Статуси',
      initial: 'Початковий',
      final: 'Кінцевий',
      addStatus: ({ linked }) =>
        `${linked('reusable.add')} ${linked(
          `lookups.statuses.statuses`,
          1,
        ).toLowerCase()}`,
      editStatus: ({ linked }) =>
        `${linked('reusable.edit')} ${linked(
          `lookups.statuses.statuses`,
          1,
        ).toLowerCase()}`,
      statusType: 'Тип статусу',
      finalStatusValidationText:
        'У вас має бути принаймні один кінцевий статус і лише один початковий.\n Будь ласка, поверніться і перевірте типи.',
    },
  },
  customization: {
    customization: 'Персоналізація',
    customLookups: {
      customLookups: 'Користувацькі довідники',
      code: 'Код',
      allValues: 'Всі значення',
      columns: 'Колонки',
      addColumn: 'Додати колонку',
      editColumn: 'Редагувати колонку',
      controlPermissions: 'Контролювати права доступу',
      field: {
        id: 'Ід',
        name: ({ linked }) => linked('reusable.name'),
        createdAt: ({ linked }) => linked('reusable.createdAt'),
        createdBy: ({ linked }) => linked('reusable.createdBy'),
        modifiedAt: ({ linked }) => linked('reusable.modifiedAt'),
        modifiedBy: ({ linked }) => linked('reusable.modifiedBy'),
      },
      fieldType: {
        string: 'Текст',
        int32: 'Число',
        int64: 'Число',
        lookup: 'Вибір',
        list: 'Мультивибір',
        datetime: 'Календар',
        bool: 'Логічне',
      },
    },
    extensions: {
      contacts: ({ linked }) => linked('contacts.contact'),
    },
  },
  cases: {
    case: 'Звернення | Звернення',
    id: 'ID',
    subject: 'Тема',
    priority: 'Пріоритет',
    status: 'Статус',
    source: 'Джерело',
    author: 'Автор',
    group: 'Група виконавців',
    service: '@:lookups.service.service',
    assignee: '@:lookups.contactGroups.assignee',
    reporter: 'Ініціатор',
    impacted: 'Впливає на',
    appliedSLA: 'Застосований SLA',
    appliedCondition: 'Застосована умова',
    reactionTime: '@:lookups.slas.reactionTime',
    resolutionTime: '@:lookups.slas.resolutionTime',
    actualReactionTime: 'Фактичний час реакції',
    actualResolutionTime: 'Фактичний час вирішення',
    reason: '@:lookups.closeReasonGroups.reason',
    result: 'Результат',
    rating: 'Оцінка',
    persons: 'Особи',
    selectAService: 'Виберіть сервіс',
    deadlines: 'Терміни',
    ratingComment: 'Коментар до оцінки',
    caseResult: 'Результат звернення',
    assignToMe: 'Призначити на мене',
    emptyCases: 'Тут ще немає {e}',
    caseInfo: {
      caseInfo: 'Інформація',
      contactInfo: 'Контактна інформація',
    },
    comments: {
      comments: 'Коментарі',
      edited: 'Редаговано',
      yourCommentHere: 'Ваш коментар тут',
    },
    attachments: {
      attachments: 'Додатки',
      links: 'Посилання',
      url: 'URL',
      linkText: 'Текст посилання',
    },
    relatedCases: {
      relatedCases: 'Звʼязані звернення',
      emptyText: 'Тут ще немає звʼязаних звернень',
      searchCasesPlaceholder: 'Шукати звернення',
      relationType: {
        [CasesRelationType.DUPLICATES]: 'дублює',
        [CasesRelationType.ISDUPLICATEDBY]: 'дублюється',
        [CasesRelationType.BLOCKS]: 'блокує',
        [CasesRelationType.ISBLOCKEDBY]: 'блокується',
        [CasesRelationType.CAUSES]: 'спричинило',
        [CasesRelationType.ISCAUSEDBY]: 'спричинене',
        [CasesRelationType.ISCHILDOF]: 'дочірнє до',
        [CasesRelationType.ISPARENTOF]: 'батьківське для',
        [CasesRelationType.RELATESTO]: 'стосується',
      },
    },
  },
};
