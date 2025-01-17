import { WebitelContactsTimelineEventType } from 'webitel-sdk';
import { CasesSourceType } from 'webitel-sdk';
import { WebitelContactsGroupType } from 'webitel-sdk';
import ChatGatewayProvider
  from '@webitel/ui-sdk/src/enums/ChatGatewayProvider/ChatGatewayProvider.enum.js';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum';
import AccessMode
  from '../../../modules/contacts/modules/permissions/enums/AccessMode.enum.js';
import TimelineTaskStatusEnum
  from '../../../modules/contacts/modules/timeline/enums/TimelineTaskStatus.enum.js';

export default {
  crm: 'CRM',
  contacts: {
    contact: 'Контакт | Контакты',
    manager: 'Владелец | Владельцы',
    destination: 'Назначение',
    collapseAll: 'Свернуть все',
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
        [WebitelContactsTimelineEventType.Call]: 'Звонок | Звонки',
        [WebitelContactsTimelineEventType.Chat]: 'Чат | Чаты',
        [WebitelContactsTimelineEventType.Email]: 'Письмо | Письма',
      },
      emails: {
        to: 'Кому',
        cc: 'CC',
        subject: 'Тема',
      },
    },
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
  startPage: {
    [CrmSections.CONTACTS]: {
      name: 'Контакты',
      text: 'В этом разделе вы можете работать с Контактами: клиентами, партнерами и т.д.',
    },
    configuration: {
      name: 'Конфигурация',
      text: 'Здесь вы можете просматривать Обращения, зарегистрированные в системе.',
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
      statuses: 'Статусы',
      closureReasons: 'Причины закрытия',
      skills: 'Навыки',
      assignee: 'Исполнитель',
      group: 'Группа исполнителей',
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
      addCondition: 'Добавить причину',
      editCondition: 'Редактировать причину',
    },
    [CrmSections.STATUSES]: 'Статусы',
  },
};
