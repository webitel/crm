import ChatGatewayProvider
  from '@webitel/ui-sdk/src/enums/ChatGatewayProvider/ChatGatewayProvider.enum.js';
import { WebitelContactsTimelineEventType } from 'webitel-sdk';
import AccessMode
  from '../../../modules/contacts/modules/permissions/enums/AccessMode.enum.js';
import TimelineTaskStatusEnum
  from '../../../modules/contacts/modules/timeline/enums/TimelineTaskStatus.enum.js';

import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum';
import CrmConfigurationSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmConfigurationSections.enum';

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
    [CrmSections.CONFIGURATION]: {
      name: 'Конфигурация',
      text: 'Здесь вы можете просматривать Обращения, зарегистрированные в системе.',
    },
  },
  configuration: {
    [CrmConfigurationSections.CONTACT_GROUPS]: 'Группы контактов',
  },

  validation: {
    email: 'Введите адрес электронной почты',
    required: 'Обязательное поле для заполнения',
    sameAs: 'Неверный пароль',
    gatewayHostValidator: 'Should look like IPv4 or FQDN',
    ipValidator: 'Should look like IPv4',
    macValidator: 'Should look like MAC',
    minValue: 'Значение должно быть не менее',
    maxValue: 'Значение должно быть не слишком большим',
    numeric: 'Должны быть цифры',
    requiredArrayValue: 'Поле не должно быть пустым',
    isPositiveValue: 'Значение должно быть больше нуля',
    cron: 'Некорректное cron-выражение',
  },

  objects: {
    all: 'Все {entity}',
    administration: 'Управление',
    general: 'Общее',
    new: 'Новый объект',
    add: 'Добавить',
    create: 'Создать',
    read: 'Читать',
    edit: 'Редактировать',
    delete: 'Удалить',
    save: 'Сохранить',
    saved: 'Сохранено',
    saveAs: 'Сохранить как нового',
    close: 'Закрыть',
    next: 'Далее',
    back: 'Назад',
    change: 'Заменить',
    name: 'Имя',
    title: 'Название',
    description: 'Описание',
    user: 'Пользователь',
    users: 'Пользователи',
    action: 'Action',
    allow: 'Allow',
    password: 'Пароль',
    history: 'История',
    copy: 'Копировать',
    copied: 'Скопировано!',
    createdAt: 'Создано',
    createdBy: 'Кем создан',
    importCSV: 'Импортировать CSV',
    online: 'Онлайн',
    offline: 'Оффлайн',
    on: 'On',
    off: 'Off',
    ok: 'Ok',
    enabled: 'Включено',
    status: 'Статус',
    from: 'От',
    to: 'До',
    importJSON: 'Импортировать JSON',
    addNew: 'Добавить',
    provider: 'Провайдер',
    default: 'По умолчанию',
    service: 'Сервис',
    tts: 'Text-to-Speech',
    stt: 'Speech-to-Text',
    key: 'Ключ',
    ID: 'ID',
    email: 'Адрес электронной почты',
    updatedAt: 'Изменено',
    emptyWorkspace: 'Записи в разделе еще не созданы',
    emptyResultSearch: 'Поиск не дал результатов',

    deleteConfirmation: {
      title: 'Подтвердите удаление',
      askingAlert:
        'Вы уверенны, что хотите удалить {count} запись? | Вы уверенны, что хотите удалить {count} записей?',
      undoneActionAlert: 'Это действие не может быть отменено.',
      deleteAll: 'ВСЕ',
    },
    generalInfo: 'Общая информация',
    objectHeader: {},
    permissions: {
      permissions: 'Дозволи',
      permissionsRole: 'Роль | Ролі',
      allRoles: 'Всі ролі',
      searchPlaceholder: 'роль ..',
      roles: {
        permissions: {
          permissions: 'Право доступа роли | Права доступа ролей',
          add: 'Создавать',
          delete: 'Удалять',
          read: 'Выбирать',
          write: 'Редактировать',
          eavesdropCall: 'Прослушивать активный звонок',
          playbackRecordFile: 'Воспроизводить записи разговоров',
          exportDataGrid: 'Экспортировать данные',
          viewCdrPhoneNumbers: 'Просмотр незашифрованных номеров телефонов',
          manageUserRoles: 'Управление ролями пользователей',
          manageUserLicense: 'Управление лицензиями пользователей',
          changeUserPassword: 'Изменять пароли пользователей',
          systemSetting: 'Управление системными конфигурациями',
          addDescription: 'Предоставляет разрешение на создание объектов',
          deleteDescription: 'Предоставляет разрешение на удаление объектов',
          readDescription: 'Предоставляет разрешение на выбор объектов',
          writeDescription: 'Предоставляет разрешение на изменение  объектов',
          eavesdropCallDescription: 'Предоставляет разрешение на прослушивание активного разговора',
          playbackRecordFileDescription:
            'Предоставляет разрешение на воспроизведение файлов с записями разговоров',
          exportDataGridDescription: 'Предоставляет разрешение на экспорт данных',
          viewCdrPhoneNumbersDescription:
            'Предоставляет разрешение на отображение незашифрованных телефонных номеров',
          manageUserRolesDescription:
            'Предоставляет разрешение на управление набором ролей пользователей',
          manageUserLicenseDescription:
            'Предоставляет разрешение на управление набором пользовательских лицензий',
          changeUserPasswordDescription:
            'Предоставляет разрешение на изменение пароля пользователя',
          systemSettingDescription: 'Предоставляет разрешение на управление разделом Конфигурация',
          schemeVariables: 'Управление глобальными переменными',
          schemeVariablesDescription:
            'Предоставляет разрешение на управление разделом Глобальные переменные',
        },
        addPermission: 'Добавить право доступа для роли',
        usage: 'Использование',
        applicationsAccess: {
          applicationsAccess: 'Приложение | Приложения',
          access: 'Доступ',
        },
      },
      object: {
        object: 'Разделы',
        allObjects: 'Все разделы',
        ObAC: 'Управление действиями',
        RbAC: 'Управление записями',
        operations: 'Действия',
        searchPlaceholder: 'раздел ..',
        newPermissionRole: 'Новый владелец прав',
        rbacDefault: 'Права доступа по записям по умолчанию',
        grantor: 'Праводатель',
        grantee: 'Получатель',
        create: 'Создавать',
        delete: 'Удалять',
        accessMode: {
          1: 'Запрещено',
          2: 'Разрешено',
          3: 'Управление',
        },
      },
    },
    routing: {
      routing: 'Маршрутизация',
      ip: 'IP',
      protocol: 'Протокол',
      port: 'Порт',
      configuration: 'Конфигурация',
      schema: 'Схема звонка',
      json: 'JSON',

      flow: {
        flow: 'Схема | Схемы',
        allFlowSchemas: 'Все схемы',
        createFlowSelectionPopup: 'Создать новую схему',
        createNew: 'Создать новую схему?',
        editor: 'Редактор',
        diagram: {
          diagram: 'Диаграмма',
          description: 'Создать новую схему используя Webitel Flow Diagram',
        },
        code: {
          code: 'Код',
          description: 'Создать новую схему используя JSON-схему в редакторе кода',
        },
        askingAlert: 'Вы хотите сохранить изменения, внесенные в "{name}" ?',
      },

      dialplan: {
        dialplan: 'Исходящая маршрутизация',
        dialplanRules: 'Правила исходящей маршрутизации',
        pattern: 'Номер назначения',
        dialplanRule: 'Правило исходящей маршрутизации',
        position: 'Позиция',
      },

      chatplan: {
        chatplan:
          'Правило маршрутизации текстовых сообщений | Правила маршрутизации текстовых сообщений',
        allChatplans: 'Все правила маршрутизации текстовых сообщений',
      },

      gateways: {
        gateways: 'Шлюз | Шлюзы',
        allGateways: 'Все шлюзы',
        trunkingGateway: 'Многоканальный шлюз',
        registerGateway: 'Зарегистрировать шлюз',
        stateSuccess: 'Успешно',
        stateFailed: 'Неудачно',
        stateProgress: 'В процессе',
        stateNonreg: 'Не зарегистрирован',
        proxy: 'Прокси',
        searchPlaceholder: 'поиск шлюза...',
        host: 'Хост',
        trunkingACLTitle: 'Контроль доступа',
        trunkingACL: 'Многоканальный список доступа',
        hostnameTrunking: 'Сервер/Хост шлюза или IP',
        hostnameRegister: 'Регистратор/Сервер/Хост шлюза или IP',
        expire: 'Срок действия',
        authID: 'Имя пользователя',
        account: 'Аккаунт',
        outboundProxy: 'Адрес исходящего SIP-прокси',
        newGateway: 'Новый шлюз',
        newGatewayDescription: 'Описание нового шлюза',
        SIPregistrations: 'SIP-регистрация',
        SIPregistrationsDescription: 'Описание SIP-регистрации',
        SIPtrunking: 'SIP-транки',
        SIPtrunkingDescription: 'Описание SIP-транков',
      },

      chatGateways: {
        templates: {
          templates: 'Шаблоны',
          title: 'Анонимное имя абонента в Workspace',
          close: 'Сообщение завершения чата',
          join: 'Сообщение присоединения оператора',
          left: 'Сообщение отключения оператора',
        },
        chatGateways: 'Текстовый шлюз | Текстовые шлюзы',
        allChatGateways: 'Все текстовые шлюзы',
        telegramBot: {
          telegramBot: 'Telegram Бот',
        },
        telegramApp: {
          telegramApp: 'Telegram Приложение',
          signedAs: 'Вы авторизированы как',
          joinTelegram: 'Sign in to Telegram',
          metadata: {
            apiId: 'API идентификатор',
            apiHash: 'API хэш',
          },
        },
        infobip: {
          infobip: 'Infobip',
        },
        messenger: {
          meta: 'Meta',
          addOrRemovePages: 'Добавить или удалить страницы',
          accounts: 'Аккаунты',
          metadata: {
            clientId: 'App ID',
            clientSecret: 'App Secret',
          },
          facebook: {
            pages: 'Facebook страницы',
            subscription: 'Webhook подписки',
          },
          instagram: {
            instagram: 'Instagram',
            comments: 'Отслеживать комментарии',
            mentions: 'Отслеживать упоминания',
          },
          whatsapp: {
            whatsapp: 'Whatsapp',
            token: 'Токен',
            status: 'Статус',
            number: 'Номер телефона',
            review: 'Рассмотрение',
          },
        },
        viber: {
          viber: 'Viber',
          style: {
            style: 'Стиль',
            btnBackColor: 'Цвет фона кнопки',
            btnFontColor: 'Цвет текста кнопки',
          },
        },
        webchat: {
          webchat: 'Web chat',
          copyCode: 'Скопировать код',
          copyCodeHint:
            'Необходимо перегенерировать и вставить код Виджета на сайт после каждой модификации настроек',
          metadata: {
            mediaMaxSize: 'Максимальный размер файла (Мб)',
          },
          view: {
            borderRadius: 'Вид кнопки',
            language: 'Язык',
            view: 'Вид',
            position: 'Размещение',
            btnColor: 'Цвет кнопки',
            logoUrl: 'URL логотипа',
            logoHint: "Поддерживаемый формат логотипа - 'JPEG' or 'PNG', 24x24px",
            rounded: 'Круглая',
            square: 'Квадратная',
            right: 'Справа',
            left: 'Слева',
            static: 'Статическая',
          },
          recaptcha: {
            recaptcha: 'reCAPTCHA',
            sitekey: 'Site key',
            secret: 'Secret key',
            threshold: 'Порог',
            showFlag: 'Показывать значок reCAPTCHA',
          },
          chat: {
            chat: 'Чат',
            openTimeout: 'Включить задержку открытия',
            openTimeoutSec: 'Время задержки открытия',
          },
          appointment: {
            appointment: 'Заказ звонка',
            days: 'Количество дней',
            availableAgents: 'Свободные агенты',
            showEmailField: 'Показать поле ввода почты',
            showMessageField: 'Показать поле ввода сообщения',
            resultPageText: 'Текст та странице результата',
            headingText: 'Заголовок',
            subheadingText: 'Подзаголовок',
            showDefaultHeading:
              'Показать стандартный заголовок и подзаголовок на странице результата',
          },
          call: {
            title: 'Онлайн-звонок',
            url: 'WebSocket Endpoint',
          },
          alternativeChannels: {
            alternativeChannels: 'Альтернативные каналы',
            title: 'Текстовые каналы',
            email: 'Электронная почта',
            whatsapp: 'WhatsApp',
            telegram: 'Telegram',
            messenger: 'Messenger',
          },
        },
        customChat: {
          customChat: 'Custom Chat',
          customChatGateway: 'Custom Chat Gateway',
          appSecretHint: 'Изменение этого поля прервет интеграцию',
          metadata: {
            appSecret: 'App Secret',
            callback: 'Callback',
          },
        },
        uri: 'URI',
        newChatGateway: 'Новый текстовый шлюз',
        metadata: {
          apiKey: 'Api Key',
          number: 'Number',
          baseUrl: 'Base URL',
          sendApi: 'Send API',
          allowOrigin: 'Allow Origin',
          readTimeout: 'Read Timeout (sec)',
          writeTimeout: 'Write Timeout (sec)',
          handshakeTimeout: 'Handshake Timeout (sec)',
          messageSize: 'Message Size max (bytes)',
          botName: 'Bot Name',
          eventTypes: 'Event Types',
          telegramToken: 'Telegram BOT API Token',
          messengerApiUrl: 'Messenger API URL',
        },
      },

      callflow: {
        callflow: 'Конструктор звонка',
      },
    },
    pagination: {
      rowsPerPage: 'Количество строк на странице',
    },
  },

  lookups: {
    lookups: 'Справочники',
    sources: {
      caseSources: 'Источники обращений',
      type: 'Тип'
    },
    statuses: 'Statuses',

    contactGroups: {
      contactGroups: 'Группы контактов',
      groups: 'Группы',
      crm: 'CRM',
      configurations: 'Конфигурация',
    }
  },

  errorPages: {
    goToHome: 'Вернуться Домой',
    page403: {
      title: 'Нет доступа',
      text: 'Извините, у вас недостаточно прав доступа для просмотра этой страницы.',
    },
    page404: {
      title: 'Похоже, вы потерялись',
      text: 'Извините, мы не можем найти то, что вы ищете',
    },
  },

  iconHints: {
    upload: 'Загрузить',
    reload: 'Обновить',
    edit: 'Редактировать',
    delete: 'Удалить',
    deleteAll: 'Удалить все объекты',
    deleteSelected: 'Удалить {count} выбранных объектов',
    deleteFiltered: 'Удалить все отфильтрованные объекты',
    generate: 'Создать',
    add: 'Добавить',
    history: 'История',
    download: 'Скачать',
    downloadAll: 'Скачать все',
    draggable: 'Перетащить',
    play: 'Играть',
    pause: 'Пауза',
    resume: 'Возобновить',
    close: 'Закрыть',
    volume: 'Громкость',
    stop: 'Остановить',
    members: 'Абоненты',
    moveUp: 'Передвинуть вверх',
    moveDown: 'Передвинуть вниз',
    nextPage: 'Следующая страница',
    prevPage: 'Предыдущая страница',
    expand: 'Развернуть',
    collapse: 'Свернуть',
  },

  errors: {
    invalidJson: 'Некорректный JSON',
  },
  reusable: {
  },
};
