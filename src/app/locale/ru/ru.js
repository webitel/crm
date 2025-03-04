import ChatGatewayProvider from '@webitel/ui-sdk/src/enums/ChatGatewayProvider/ChatGatewayProvider.enum.js';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum';
import { CasesRelationType } from 'webitel-sdk';
import { CasesSourceType } from 'webitel-sdk';
import { WebitelContactsGroupType } from 'webitel-sdk';

import { SearchMode } from '../../../modules/cases/filters/SearchMode.js';
import AccessMode from '../../../modules/contacts/modules/permissions/enums/AccessMode.enum.js';
import { TimelineEventType } from '../../../modules/timeline/enums/TimelineEventType';
import TimelineTaskStatusEnum from '../../../modules/timeline/enums/TimelineTaskStatus.enum.js';

export default {
  crm: 'CRM',
  contacts: {
    contact: 'Контакт | Контакты',
    manager: 'Владелец | Владельцы',
    group: ({ linked }) => {
      return linked('cases.group');
    },
    destination: 'Назначение',
    collapseAll: 'Свернуть все',
    communications: {
      communications: 'Средство связи | Средства связи',
      channel: 'Канал',
      destination: 'Назначение',
      setAsPrimary: 'Установить как основной',
      emails: {
        addTitle: 'Добавить электронный адрес',
        editTitle: 'Редактировать электронный адрес',
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
        username: 'Имя пользователя',
        dummy: 'Пока еще не было текстовых диалогов',
        messengers: {
          [ChatGatewayProvider.TELEGRAM_BOT]: 'Telegram Бот',
          [ChatGatewayProvider.TELEGRAM_APP]: 'Telegram Приложение',
          [ChatGatewayProvider.MESSENGER]: 'Meta',
          [ChatGatewayProvider.VIBER]: 'Viber',
          [ChatGatewayProvider.WEBCHAT]: 'Web chat',
          [ChatGatewayProvider.INFOBIP]: 'Infobip',
          [ChatGatewayProvider.CUSTOM]: 'Custom Chat Gateway',
        },
      },
    },
    attributes: 'Атрибут | Атрибуты',
  },
  timeline: {
    timeline: 'Хронология',
    totalDuration: 'Общая длительность',
    actions: {
      openInHistory: 'Открыть в истории',
      playRecording: 'Проиграть запись',
      transcription: 'Транскрипция',
    },
    status: {
      [TimelineTaskStatusEnum.STARTED]: 'Начало',
      [TimelineTaskStatusEnum.MISSED]: 'Пропущен',
      [TimelineTaskStatusEnum.TRANSFERRED]: 'Переведено',
      [TimelineTaskStatusEnum.ENDED]: 'Конец',
      [TimelineTaskStatusEnum.SENT]: 'Отправлено',
      [TimelineTaskStatusEnum.RECEIVED]: 'Получено',
    },
    eventType: {
      [TimelineEventType.Call]: 'Звонок | Звонки',
      [TimelineEventType.Chat]: 'Чат | Чаты',
      [TimelineEventType.Email]: 'Письмо | Письма',
    },
    emails: {
      to: 'Кому',
      cc: 'CC',
      subject: 'Тема',
    },
  },
  permissions: {
    read: 'Читать',
    edit: 'Редактировать',
    delete: 'Удалить',
    granteePopup: {
      title: 'Добавить владельца прав',
    },
    accessMode: {
      [AccessMode.FORBIDDEN]: 'Запрещено',
      [AccessMode.ALLOW]: 'Разрешено',
      [AccessMode.MANAGE]: 'Управление',
    },
  },
  startPage: {
    [CrmSections.CONTACTS]: {
      name: 'Контакты',
      text: 'В этом разделе вы можете работать с Контактами: клиентами, партнерами и т.д.',
    },
    [CrmSections.CASES]: {
      name: 'Обращения',
      text: 'Здесь вы можете просматривать Обращения, зарегистрированные в системе.',
    },
    configuration: {
      name: 'Конфигурация',
      text: 'В этом разделе вы можете настроить процесс работы с Обращениями.',
    },
  },
  lookups: {
    lookups: 'Справочники',

    slas: {
      slas: 'SLA | SLAs',
      conditions: 'Условие | Условия',
      editCondition: 'Редактировать условие',
      addCondition: 'Добавить условие',
      reactionTime: 'Плановое время реакции',
      reactionTimeTitle: 'Плановое время реакции (dd:hh:mm)',
      resolutionTime: 'Плановое время решения',
      resolutionTimeTitle: 'Плановое время решения (dd:hh:mm)',
      validFrom: 'Действителен с',
      validTo: 'Действителен до',
    },

    sources: {
      sources: 'Источник обращений | Источники обращений',
      types: {
        [CasesSourceType.CALL]: 'Звонок',
        [CasesSourceType.CHAT]: 'Чат',
        [CasesSourceType.SOCIALMEDIA]: 'Социальная сеть',
        [CasesSourceType.EMAIL]: 'Письмо',
        [CasesSourceType.API]: 'API',
        [CasesSourceType.MANUAL]: 'Созданное вручную',
      },
    },

    serviceCatalogs: {
      serviceCatalogs: 'Каталог сервисов | Каталоги сервисов',
      prefix: 'Префикс',
      code: 'Код',
      statuses: ({ linked }) => linked(`lookups.statuses.statuses`, 2),
      skills: 'Навыки',
    },

    service: {
      service: 'Сервисы | Сервисы',
    },

    contactGroups: {
      contactGroups: 'Группа контактов | Группы контактов',
      defaultGroup: 'Группа по умолчанию',
      addGroup: 'Добавить контакты',
      assignee: 'Исполнитель',
      types: {
        [WebitelContactsGroupType.DYNAMIC]: 'Динамическая',
        [WebitelContactsGroupType.STATIC]: 'Статическая',
      },
    },

    closeReasonGroups: {
      closeReasonGroups: 'Причины закрытия',
      reason: 'Причина | Причины',
      addReason: 'Добавить причину',
      editReason: 'Редактировать причину',
      sameConditionError: 'Такое условие уже существует',
    },

    statuses: {
      statuses: 'Статус | Статусы',
      initial: 'Начальный',
      final: 'Конечный',
      addStatus: ({ linked }) =>
        `${linked('reusable.add')} ${linked(`lookups.statuses.statuses`, 1).toLowerCase()}`,
      editStatus: ({ linked }) =>
        `${linked('reusable.edit')} ${linked(`lookups.statuses.statuses`, 1).toLowerCase()}`,
      statusType: 'Тип статуса',
      finalStatusValidationText:
        'У вас должен быть хотя бы один конечный статус и только один начальный.\n Пожалуйста, вернитесь и проверте типы.',
    },
  },
  customization: {
    customization: 'Персонализация',
    customLookups: {
      customLookups: 'Пользовательские справочники',
      code: 'Код',
      allValues: 'Все значения',
      columns: 'Колонки',
      addColumn: 'Добавить колонку',
      editColumn: 'Редактировать колонку',
      confirmDeleteColumn:
        'После удаления колонки и сохранения все заполненные данные будут тоже удалены.',
      controlPermissions: 'Контролировать права доступа',
      field: {
        id: 'Ид',
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
        lookup: 'Выбор',
        list: 'Мультивыбор',
        datetime: 'Календарь',
        bool: 'Логическое',
      },
    },
    extensions: {
      contacts: ({ linked }) => linked('contacts.contact'),
    },
  },
  cases: {
    case: 'Обращение | Обращения',
    id: 'ID',
    subject: 'Тема',
    priority: 'Приоритет',
    status: 'Статус',
    source: 'Источник',
    author: 'Автор',
    group: 'Группа исполнителей',
    service: '@:lookups.service.service',
    assignee: '@:lookups.contactGroups.assignee',
    reporter: 'Инициатор',
    impacted: 'Влияет на',
    appliedSLA: 'Примененный SLA',
    appliedCondition: 'Примененное условие',
    reactionTime: '@:lookups.slas.reactionTime',
    resolutionTime: '@:lookups.slas.resolutionTime',
    actualReactionTime: 'Фактическое время реакции',
    actualResolutionTime: 'Фактическое время решения',
    reason: 'Причина закрытия',
    result: 'Результат',
    rating: 'Оценка',
    persons: 'Персоны',
    selectAService: 'Выбрать сервис',
    deadlines: 'Сроки',
    ratingComment: 'Комментарий к оценке',
    caseResult: 'Результат обращения',
    assignToMe: 'Взять на себя',
    caseInfo: {
      caseInfo: 'Информация',
      contactInfo: 'Контактная информация',
    },
    comments: {
      comments: 'Комментарии',
      edited: 'Редактировано',
      yourCommentHere: 'Ваш комментарий здесь',
      emptyText: 'Тут еще нет комментариев',
    },
    attachments: {
      attachments: 'Вложения',
      files: 'Файлы',
      links: 'Ссылки',
      url: 'URL',
      linkText: 'Текст ссылки',
      emptyFilesText: 'Тут еще нет вложений',
      emptyLinksText: 'Тут еще нет ссылок',
    },
    relatedCases: {
      relatedCases: 'Связанные обращения',
      emptyText: 'Тут еще нет связанных обращений',
      searchCasesPlaceholder: 'Найти обращение',
      relationType: {
        [CasesRelationType.DUPLICATES]: 'дублирует',
        [CasesRelationType.ISDUPLICATEDBY]: 'дублируется',
        [CasesRelationType.BLOCKS]: 'блокирует',
        [CasesRelationType.ISBLOCKEDBY]: 'блокируется',
        [CasesRelationType.CAUSES]: 'вызывает',
        [CasesRelationType.ISCAUSEDBY]: 'вызванное',
        [CasesRelationType.ISCHILDOF]: 'дочернее для',
        [CasesRelationType.ISPARENTOF]: 'родительское для',
        [CasesRelationType.RELATESTO]: 'относится к',
      },
    },
    slaRecalculationPopup: {
      title: 'Перерасчет SLA',
      message: 'После изменения сервиса SLA обращения будет пересчитан.',
    },
  },
  filters: {
    search: {
      [SearchMode.Search]: 'Обычный поиск',
      [SearchMode.Fts]: 'Полнотекстовый поиск',
    },
  },
};
