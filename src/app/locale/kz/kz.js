import {
  ContactsGroupType,
  WebitelCasesRelationType,
  WebitelCasesSourceType,
} from '@webitel/api-services/gen/models';
import { ChatGatewayProvider } from '@webitel/ui-sdk/enums';
import { CrmSections } from '@webitel/ui-sdk/enums';

import { SearchMode } from '../../../modules/cases/enums/SearchMode.ts';
import AccessMode from '../../../modules/contacts/modules/permissions/enums/AccessMode.enum.js';
import { TimelineEventType } from '../../../modules/timeline/enums/TimelineEventType';
import TimelineTaskStatusEnum from '../../../modules/timeline/enums/TimelineTaskStatus.enum.js';

export default {
  crm: 'CRM',
  contacts: {
    contact: 'Байланыс | Байланыстар',
    manager: 'Иесі | Иелері',
    destination: 'Тағайындау',
    collapseAll: 'Барлығын жию',
    allContacts: ({ linked }) =>
      `${linked('reusable.all')} ${linked(`vocabulary.contact`).toLowerCase()}`,
    addContacts: ({ linked }) =>
      `${linked('reusable.add')} ${linked(`vocabulary.contact`).toLowerCase()}`,
    communications: {
      communications: 'Байланыс құралы | Байланыс құралдары',
      channel: 'Арна',
      destination: 'Тағайындау',
      setAsPrimary: 'Негізгісі ретінде орнату',
      emails: {
        addTitle: 'Электрондық поштаны қосу',
        editTitle: 'Электрондық поштаны өңдеу',
        dummy: 'Әзірге электрондық пошта мекенжайлары жоқ',
      },
      phones: {
        addTitle: 'Телефон нөмірін қосу',
        editTitle: 'Телефон нөмірін өңдеу',
        dummy: 'Әзірге телефон нөмірлері жоқ',
      },
      messaging: {
        gateway: 'Шлюз',
        provider: 'Провайдер',
        username: 'Пайдаланушы аты',
        dummy: 'Әзірге хабарлама опциялары жоқ',
        sendMessage: 'Хабар жіберу',
        messengers: {
          [ChatGatewayProvider.TELEGRAM_BOT]: 'Telegram Бот',
          [ChatGatewayProvider.TELEGRAM_APP]: 'Telegram Қосымшасы',
          [ChatGatewayProvider.MESSENGER]: 'Meta',
          [ChatGatewayProvider.VIBER]: 'Viber',
          [ChatGatewayProvider.WEBCHAT]: 'Веб-чат',
          [ChatGatewayProvider.INFOBIP]: 'Infobip',
          [ChatGatewayProvider.CUSTOM]: 'Арнайы чат шлюзі',
          [ChatGatewayProvider.PORTAL]: 'Портал',
        },
      },
    },
    details: 'Егжей-тегжейлі',
    attributes: 'Атрибут | Атрибуттар',
  },
  timeline: {
    timeline: 'Хронология',
    totalDuration: 'Жалпы ұзақтығы',
    actions: {
      openInHistory: 'Тарихта ашу',
      playRecording: 'Жазбаны ойнату',
      transcription: 'Транскрипция',
    },
    status: {
      [TimelineTaskStatusEnum.STARTED]: 'Басталды',
      [TimelineTaskStatusEnum.MISSED]: 'Өткізіп жіберілді',
      [TimelineTaskStatusEnum.TRANSFERRED]: 'Ауыстырылды',
      [TimelineTaskStatusEnum.ENDED]: 'Аяқталды',
      [TimelineTaskStatusEnum.SENT]: 'Жіберілді',
      [TimelineTaskStatusEnum.RECEIVED]: 'Алынды',
    },
    eventType: {
      [TimelineEventType.Call]: 'Қоңырау | Қоңыраулар',
      [TimelineEventType.Chat]: 'Чат | Чаттар',
      [TimelineEventType.Email]: 'Электрондық пошта | Электрондық пошталар',
    },
    emails: {
      to: 'Кімге',
      cc: 'Көшірме',
      subject: 'Тақырып',
    },
  },
  permissions: {
    read: 'Оқу',
    edit: 'Редакциялау',
    delete: 'Жою',
    granteePopup: {
      title: 'Алушыны қосу',
    },
    accessMode: {
      [AccessMode.ALLOW]: 'Рұқсат берілген',
      [AccessMode.FORBIDDEN]: 'Тыйым салынған',
      [AccessMode.MANAGE]: 'Делегациямен рұқсат ету',
    },
  },
  startPage: {
    [CrmSections.Contacts]: {
      name: 'Байланыстар',
      text: 'Бұл бөлімде сіз байланыстарыңызбен жұмыс істей аласыз: клиенттер, тұтынушылар және т.б.',
    },
    [CrmSections.Cases]: {
      name: 'Кейстер',
      text: 'Мұнда сіз жүйеде тіркелген кейстерді көре аласыз.',
    },
    configuration: {
      name: 'Конфигурация',
      text: 'Бұл бөлімде сіз кейстерді басқару процесін орнатасыз.',
    },
  },
  lookups: {
    lookups: 'Анықтамалықтар',

    slas: {
      slas: 'SLA | SLA-лар',
      conditions: 'Шарт | Шарттар',
      editCondition: 'Шартты өңдеу',
      addCondition: 'Шарт қосу',
      reactionTime: 'Реакция уақыты',
      reactionTimeTitle: 'Реакция уақыты (кк:сс:мм)',
      resolutionTime: 'Шешім уақыты',
      resolutionTimeTitle: 'Шешім уақыты (кк:сс:мм)',
      validFrom: 'Бастап жарамды',
      validTo: 'Дейін жарамды',
      error: {
        duplicateConditionName: 'Осындай атауы бар шарт қазірдің өзінде бар',
      },
    },

    sources: {
      sources: 'Кейс көзі | Кейс көздері',
      types: {
        [WebitelCasesSourceType.Call]: 'Қоңырау',
        [WebitelCasesSourceType.Chat]: 'Чат',
        [WebitelCasesSourceType.SocialMedia]: 'Әлеуметтік желілер',
        [WebitelCasesSourceType.Email]: 'Электрондық пошта',
        [WebitelCasesSourceType.Api]: 'API',
        [WebitelCasesSourceType.Manual]: 'Қолмен',
      },
    },

    serviceCatalogs: {
      serviceCatalogs: 'Қызмет каталогы | Қызмет каталогтары',
      prefix: 'Префикс',
      code: 'Код',
      statuses: ({ linked }) => linked(`lookups.statuses.statuses`, 2),
      skills: 'Дағдылар',
    },

    service: {
      service: 'Қызмет | Қызметтер',
    },

    contactGroups: {
      contactGroups: 'Байланыс тобы | Байланыс топтары',
      defaultGroup: 'Әдепкі топ',
      addGroup: 'Топ қосу',
      assignee: 'Тағайындалған',
      types: {
        [ContactsGroupType.Dynamic]: 'Динамикалық',
        [ContactsGroupType.Static]: 'Статикалық',
      },
    },

    closeReasonGroups: {
      closeReasonGroups: 'Жабу себептері',
      reason: 'Себеп | Себептер',
      addReason: 'Себеп қосу',
      editReason: 'Себепті өңдеу',
      sameConditionError: 'Мұндай шарт бұрыннан бар',
    },

    statuses: {
      statuses: 'Мәртебе | Мәртебелер',
      initial: 'Бастапқы',
      final: 'Соңғы',
      addStatus: ({ linked }) =>
        `${linked('reusable.add')} ${linked(`lookups.statuses.statuses`, 1).toLowerCase()}`,
      editStatus: ({ linked }) =>
        `${linked('reusable.edit')} ${linked(`lookups.statuses.statuses`, 1).toLowerCase()}`,
      statusType: 'Мәртебе түрі',
      finalStatusValidationText:
        'Сізде кем дегенде бір соңғы мәртебе және тек бір бастапқы мәртебе болуы керек.\n Қайтып, оның түрін тексеріңіз.',
    },
  },
  customization: {
    customLookups: {
      allValues: 'Барлық мәндер',
      code: 'Код',
      columns: 'Бағандар',
      addColumn: 'Баған қосу',
      editColumn: 'Бағанды өңдеу',
      defaultValue: 'Әдепкі мән',
      confirmDeleteColumn:
        'Бағанды жойғаннан және сақтағаннан кейін, тиісті өрістегі барлық енгізілген деректер де жойылады.',
      controlPermissions: 'Рұқсаттарды басқару',
      field: {
        id: 'ID',
        name: ({ linked }) => linked('reusable.name'),
        createdAt: ({ linked }) => linked('reusable.createdAt'),
        createdBy: ({ linked }) => linked('reusable.createdBy'),
        modifiedAt: ({ linked }) => linked('reusable.modifiedAt'),
        modifiedBy: ({ linked }) => linked('reusable.modifiedBy'),
      },
      fieldType: {
        string: 'Мәтін',
        int32: 'Сан',
        int64: 'Сан',
        lookup: 'Таңдау',
        list: 'Көп таңдау',
        datetime: 'Күнтізбе',
        bool: 'Логикалық',
      },
    },
    extensions: {
      contacts: ({ linked }) => linked('contacts.contact'),
      cases: ({ linked }) => linked('cases.case'),
    },
  },
  cases: {
    case: 'Кейс | Кейстер',
    id: 'ID',
    subject: 'Тақырып',
    priority: 'Басымдық',
    status: 'Мәртебе',
    source: 'Көз',
    author: 'Автор',
    service: '@:lookups.service.service',
    assignee: '@:lookups.contactGroups.assignee',
    reporter: 'Хабарлаушы',
    impacted: 'Әсер етілген',
    appliedSLA: 'Қолданылған SLA',
    appliedCondition: 'Қолданылған шарт',
    reactionTime: '@:lookups.slas.reactionTime',
    resolutionTime: '@:lookups.slas.resolutionTime',
    actualReactionTime: 'Нақты реакция уақыты',
    actualResolutionTime: 'Нақты шешім уақыты',
    closureReason: 'Жабу себебі',
    result: 'Нәтиже',
    rating: 'Рейтинг',
    persons: 'Тұлғалар',
    selectAService: 'Қызметті таңдаңыз',
    deadlines: 'Мерзімдер',
    ratingComment: 'Рейтинг түсініктемесі',
    caseResult: 'Кейс нәтижесі',
    assignToMe: 'Маған тағайындау',
    company: 'Компания',
    department: 'Бөлім',
    position: 'Лауазым',
    location: 'Орналасқан жері',
    serviceValidation: 'Алдымен қызметті таңдаңыз',
    caseNumber: 'Кейс нөмірі',
    caseInfo: {
      caseInfo: 'Кейс туралы ақпарат',
      contactInfo: 'Байланыс ақпараты',
    },
    comments: {
      comments: 'Түсініктемелер',
      edited: 'Өңделген',
      yourCommentHere: 'Түсініктемеңізді осында жазыңыз',
      emptyText: 'Әзірге түсініктемелер жоқ',
    },
    attachments: {
      attachments: 'Тіркемелер',
      files: 'Файлдар',
      links: 'Сілтемелер',
      url: 'URL',
      linkText: 'Сілтеме мәтіні',
      emptyFilesText: 'Әзірге тіркемелер жоқ',
      emptyLinksText: 'Әзірге сілтемелер жоқ',
    },
    details: {
      details: 'Егжей-тегжейлі',
    },
    relatedCases: {
      relatedCases: 'Байланысты кейстер',
      emptyText: 'Әзірге байланысты кейстер жоқ',
      searchCasesPlaceholder: 'Кейсті іздеу',
      relationType: {
        [WebitelCasesRelationType.Duplicates]: 'қайталайды',
        [WebitelCasesRelationType.IsDuplicatedBy]: 'қайталанады',
        [WebitelCasesRelationType.Blocks]: 'блоктайды',
        [WebitelCasesRelationType.IsBlockedBy]: 'блокталады',
        [WebitelCasesRelationType.Causes]: 'себеп болады',
        [WebitelCasesRelationType.IsCausedBy]: 'себебі',
        [WebitelCasesRelationType.IsChildOf]: 'ішкі кейсі',
        [WebitelCasesRelationType.IsParentOf]: 'негізгі кейсі',
        [WebitelCasesRelationType.RelatesTo]: 'байланысты',
      },
    },
    slaRecalculationPopup: {
      title: 'SLA қайта есептеу',
      message:
        'Қызметті өзгерткеннен және сақтағаннан кейін, кейстің SLA қайта есептеледі.',
    },
  },
  filters: {
    search: {
      [SearchMode.Search]: 'Қарапайым іздеу',
      [SearchMode.Fts]: 'Толық мәтінді іздеу',
    },
  },
};
