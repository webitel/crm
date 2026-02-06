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
    contact: 'Kontakt | Kontakty',
    manager: 'Właściciel | Właściciele',
    destination: 'Cel',
    collapseAll: 'Zwiń wszystko',
    allContacts: ({ linked }) =>
      `${linked('reusable.all')} ${linked(`vocabulary.contact`).toLowerCase()}`,
    addContacts: ({ linked }) =>
      `${linked('reusable.add')} ${linked(`vocabulary.contact`).toLowerCase()}`,
    communications: {
      communications: 'Opcja komunikacji | Opcje komunikacji',
      channel: 'Kanał',
      destination: 'Cel',
      setAsPrimary: 'Ustaw jako główny',
      emails: {
        addTitle: 'Dodaj email',
        editTitle: 'Edytuj email',
        dummy: 'Nie ma jeszcze adresów email',
      },
      phones: {
        addTitle: 'Dodaj numer telefonu',
        editTitle: 'Edytuj numer telefonu',
        dummy: 'Nie ma jeszcze numerów telefonów',
      },
      messaging: {
        gateway: 'Bramka',
        provider: 'Dostawca ',
        username: 'Nazwa użytkownika',
        dummy: 'Nie ma jeszcze opcji wiadomości',
        sendMessage: 'Хабар жіберу',
        messengers: {
          [ChatGatewayProvider.TELEGRAM_BOT]: 'Bot Telegram',
          [ChatGatewayProvider.TELEGRAM_APP]: 'Aplikacja Telegram',
          [ChatGatewayProvider.MESSENGER]: 'Meta',
          [ChatGatewayProvider.VIBER]: 'Viber',
          [ChatGatewayProvider.WEBCHAT]: 'Czat internetowy',
          [ChatGatewayProvider.INFOBIP]: 'Infobip',
          [ChatGatewayProvider.CUSTOM]: 'Niestandardowa bramka czatu',
          [ChatGatewayProvider.PORTAL]: 'Portal',
        },
      },
    },
    details: 'Szczegóły',
    attributes: 'Atrybut | Atrybuty',
  },
  timeline: {
    timeline: 'Oś czasu',
    totalDuration: 'Całkowity czas trwania',
    actions: {
      openInHistory: 'Otwórz w historii',
      playRecording: 'Odtwórz nagranie',
      transcription: 'Transkrypcja',
    },
    status: {
      [TimelineTaskStatusEnum.STARTED]: 'Rozpoczęte',
      [TimelineTaskStatusEnum.MISSED]: 'Nieodebrane',
      [TimelineTaskStatusEnum.TRANSFERRED]: 'Przekazane',
      [TimelineTaskStatusEnum.ENDED]: 'Zakończone',
      [TimelineTaskStatusEnum.SENT]: 'Wysłane',
      [TimelineTaskStatusEnum.RECEIVED]: 'Otrzymane',
    },
    eventType: {
      [TimelineEventType.Call]: 'Połączenie | Połączenia',
      [TimelineEventType.Chat]: 'Czat | Czaty',
      [TimelineEventType.Email]: 'Email | Emaile',
    },
    emails: {
      to: 'Do',
      cc: 'DW',
      subject: 'Temat',
    },
  },
  permissions: {
    read: 'Odczyt',
    edit: 'Edycja',
    delete: 'Usuń',
    granteePopup: {
      title: 'Dodaj uprawnienia',
    },
    accessMode: {
      [AccessMode.ALLOW]: 'Zezwól',
      [AccessMode.FORBIDDEN]: 'Zabronione',
      [AccessMode.MANAGE]: 'Zezwól z delegowaniem',
    },
  },
  startPage: {
    [CrmSections.Contacts]: {
      name: 'Kontakty',
      text: 'W tej sekcji możesz pracować ze swoimi kontaktami: klientami, klientami itp.',
    },
    [CrmSections.Cases]: {
      name: 'Sprawy',
      text: 'Tutaj możesz przeglądać Sprawy zarejestrowane w systemie.',
    },
    configuration: {
      name: 'Konfiguracja',
      text: 'W tej sekcji skonfigurujesz proces zarządzania Sprawami.',
    },
  },
  lookups: {
    lookups: 'Wyszukiwania',

    slas: {
      slas: 'SLA | SLA',
      conditions: 'Warunek | Warunki',
      editCondition: 'Edytuj warunek',
      addCondition: 'Dodaj warunek',
      reactionTime: 'Czas reakcji',
      reactionTimeTitle: 'Czas reakcji (dd:hh:mm)',
      resolutionTime: 'Czas rozwiązania',
      resolutionTimeTitle: 'Czas rozwiązania (dd:hh:mm)',
      validFrom: 'Ważne od',
      validTo: 'Ważne do',
      error: {
        duplicateConditionName: 'Warunek o takiej nazwie już istnieje',
      },
    },

    sources: {
      sources: 'Źródło sprawy | Źródła spraw',
      types: {
        [WebitelCasesSourceType.Call]: 'Połączenie',
        [WebitelCasesSourceType.Chat]: 'Czat',
        [WebitelCasesSourceType.SocialMedia]: 'Media społecznościowe',
        [WebitelCasesSourceType.Email]: 'Email',
        [WebitelCasesSourceType.Api]: 'API',
        [WebitelCasesSourceType.Manual]: 'Ręczne',
      },
    },

    serviceCatalogs: {
      serviceCatalogs: 'Katalog usług | Katalogi usług',
      prefix: 'Prefiks',
      code: 'Kod',
      statuses: ({ linked }) => linked(`lookups.statuses.statuses`, 2),
      skills: 'Umiejętności',
    },

    service: {
      service: 'Usługa | Usługi',
    },

    contactGroups: {
      contactGroups: 'Grupa kontaktów | Grupy kontaktów',
      defaultGroup: 'Grupa domyślna',
      addGroup: 'Dodaj grupę',
      assignee: 'Przypisany',
      types: {
        [ContactsGroupType.Dynamic]: 'Dynamiczna',
        [ContactsGroupType.Static]: 'Statyczna',
      },
    },

    closeReasonGroups: {
      closeReasonGroups: 'Powody zamknięcia',
      reason: 'Powód | Powody',
      addReason: 'Dodaj powód',
      editReason: 'Edytuj powód',
      sameConditionError: 'Taki warunek już istnieje',
    },

    statuses: {
      statuses: 'Status | Statusy',
      initial: 'Początkowy',
      final: 'Końcowy',
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
      statusType: 'Typ statusu',
      finalStatusValidationText:
        'Powinieneś mieć co najmniej jeden status końcowy i tylko jeden początkowy.\n Proszę wrócić i sprawdzić jego typ.',
    },
  },
  customization: {
    customLookups: {
      allValues: 'Wszystkie wartości',
      code: 'Kod',
      columns: 'Kolumny',
      addColumn: 'Dodaj kolumnę',
      editColumn: 'Edytuj kolumnę',
      defaultValue: 'Wartość domyślna',
      confirmDeleteColumn:
        'Po usunięciu kolumny i zapisaniu, wszystkie wprowadzone dane w odpowiednim polu zostaną również usunięte.',
      controlPermissions: 'Kontroluj uprawnienia',
      field: {
        id: 'ID',
        name: ({ linked }) => linked('reusable.name'),
        createdAt: ({ linked }) => linked('reusable.createdAt'),
        createdBy: ({ linked }) => linked('reusable.createdBy'),
        modifiedAt: ({ linked }) => linked('reusable.modifiedAt'),
        modifiedBy: ({ linked }) => linked('reusable.modifiedBy'),
      },
      fieldType: {
        string: 'Tekst',
        int32: 'Liczba',
        int64: 'Liczba',
        lookup: 'Wybór',
        list: 'Wielokrotny wybór',
        datetime: 'Kalendarz',
        bool: 'Boolean',
      },
    },
    extensions: {
      contacts: ({ linked }) => linked('contacts.contact'),
      cases: ({ linked }) => linked('cases.case'),
    },
  },
  cases: {
    case: 'Sprawa | Sprawy',
    id: 'ID',
    subject: 'Temat',
    priority: 'Priorytet',
    status: 'Status',
    source: 'Źródło',
    author: 'Autor',
    service: '@:lookups.service.service',
    assignee: '@:lookups.contactGroups.assignee',
    reporter: 'Zgłaszający',
    impacted: 'Dotknięty',
    appliedSLA: 'Zastosowane SLA',
    appliedCondition: 'Zastosowany warunek',
    reactionTime: '@:lookups.slas.reactionTime',
    resolutionTime: '@:lookups.slas.resolutionTime',
    actualReactionTime: 'Rzeczywisty czas reakcji',
    actualResolutionTime: 'Rzeczywisty czas rozwiązania',
    closureReason: 'Powód zamknięcia',
    result: 'Wynik',
    rating: 'Ocena',
    persons: 'Osoby',
    selectAService: 'Wybierz usługę',
    deadlines: 'Terminy',
    ratingComment: 'Komentarz do oceny',
    caseResult: 'Wynik sprawy',
    assignToMe: 'Przypisz do mnie',
    company: 'Firma',
    department: 'Dział',
    position: 'Stanowisko',
    location: 'Lokalizacja',
    serviceValidation: 'Proszę najpierw wybrać usługę',
    caseNumber: 'Numer sprawy',
    caseInfo: {
      caseInfo: 'Informacje o sprawie',
      contactInfo: 'Informacje kontaktowe',
    },
    comments: {
      comments: 'Komentarze',
      edited: 'Edytowano',
      yourCommentHere: 'Twój komentarz tutaj',
      emptyText: 'Nie ma jeszcze komentarzy',
    },
    attachments: {
      attachments: 'Załączniki',
      files: 'Pliki',
      links: 'Linki',
      url: 'URL',
      linkText: 'Tekst linku',
      emptyFilesText: 'Nie ma jeszcze załączników',
      emptyLinksText: 'Nie ma jeszcze linków',
    },
    details: {
      details: 'Szczegóły',
    },
    relatedCases: {
      relatedCases: 'Powiązane sprawy',
      emptyText: 'Nie ma jeszcze powiązanych spraw',
      searchCasesPlaceholder: 'Szukaj sprawy',
      relationType: {
        [WebitelCasesRelationType.Duplicates]: 'duplikuje',
        [WebitelCasesRelationType.IsDuplicatedBy]: 'jest duplikowany przez',
        [WebitelCasesRelationType.Blocks]: 'blokuje',
        [WebitelCasesRelationType.IsBlockedBy]: 'jest blokowany przez',
        [WebitelCasesRelationType.Causes]: 'powoduje',
        [WebitelCasesRelationType.IsCausedBy]: 'jest spowodowany przez',
        [WebitelCasesRelationType.IsChildOf]: 'jest dzieckiem',
        [WebitelCasesRelationType.IsParentOf]: 'jest rodzicem',
        [WebitelCasesRelationType.RelatesTo]: 'jest powiązany z',
      },
    },
    slaRecalculationPopup: {
      title: 'Przeliczanie SLA',
      message:
        'Po zmianie usługi i zapisaniu, SLA Sprawy zostanie przeliczone.',
    },
  },
  filters: {
    search: {
      [SearchMode.Search]: 'Wyszukiwanie zwykłe',
      [SearchMode.Fts]: 'Wyszukiwanie pełnotekstowe',
    },
  },
};
