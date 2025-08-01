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
        [WebitelCasesSourceType.Call]: 'Дзвінок',
        [WebitelCasesSourceType.Chat]: 'Чат',
        [WebitelCasesSourceType.SocialMedia]: 'Соціальна мережа',
        [WebitelCasesSourceType.Email]: 'Лист',
        [WebitelCasesSourceType.Api]: 'API',
        [WebitelCasesSourceType.Manual]: 'Створене вручну',
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
        [WebitelContactsGroupType.Dynamic]: 'Динамічна',
        [WebitelContactsGroupType.Static]: 'Статична',
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
      confirmDeleteColumn:
        'Після видалення колонки та збереження всі введені дані у відповідних полях будуть також видалені.',
      controlPermissions: 'Контролювати права доступу',
      field: {
        id: 'ID',
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
      cases: ({ linked }) => linked('cases.case'),
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
    closureReason: 'Причина закриття',
    result: 'Результат',
    rating: 'Оцінка',
    persons: 'Особи',
    selectAService: 'Вибрати сервіс',
    deadlines: 'Терміни',
    ratingComment: 'Коментар до оцінки',
    caseResult: 'Результат звернення',
    assignToMe: 'Взяти на себе',
    company: 'Компанія',
    department: 'Відділ',
    position: 'Посада',
    location: 'Розташування',
    serviceValidation: 'Будь ласка, виберіть спочатку сервіс',
    caseNumber: 'Номер звернення',
    caseInfo: {
      caseInfo: 'Інформація',
      contactInfo: 'Контактна інформація',
    },
    comments: {
      comments: 'Коментарі',
      edited: 'Редаговано',
      yourCommentHere: 'Ваш коментар тут',
      emptyText: 'Тут ще немає коментарів',
    },
    attachments: {
      attachments: 'Вкладення',
      files: 'Файли',
      links: 'Посилання',
      url: 'URL',
      linkText: 'Текст посилання',
      emptyFilesText: 'Тут ще немає вкладень',
      emptyLinksText: 'Тут ще немає посилань',
    },
    details: {
      details: 'Деталі',
    },
    relatedCases: {
      relatedCases: 'Звʼязані звернення',
      emptyText: 'Тут ще немає звʼязаних звернень',
      searchCasesPlaceholder: 'Шукати звернення',
      relationType: {
        [WebitelCasesRelationType.Duplicates]: 'дублює',
        [WebitelCasesRelationType.IsDuplicatedBy]: 'дублюється',
        [WebitelCasesRelationType.Blocks]: 'блокує',
        [WebitelCasesRelationType.IsBlockedBy]: 'блокується',
        [WebitelCasesRelationType.Causes]: 'спричинило',
        [WebitelCasesRelationType.IsCausedBy]: 'спричинене',
        [WebitelCasesRelationType.IsChildOf]: 'дочірнє до',
        [WebitelCasesRelationType.IsParentOf]: 'батьківське для',
        [WebitelCasesRelationType.RelatesTo]: 'стосується',
      },
    },
    slaRecalculationPopup: {
      title: 'Перерахунок SLA',
      message:
        'Після зміни сервісу та збереження звернення SLA буде перераховано.',
    },
  },
  filters: {
    search: {
      [SearchMode.Search]: 'Звичайний пошук',
      [SearchMode.Fts]: 'Повнотекстовий пошук',
    },
  },
};
