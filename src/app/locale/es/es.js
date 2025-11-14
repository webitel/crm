import {
  ContactsGroupType,
  WebitelCasesRelationType,
  WebitelCasesSourceType,
} from '@webitel/api-services/gen/models';
import { ChatGatewayProvider } from '@webitel/ui-sdk/enums';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum';

import { SearchMode } from '../../../modules/cases/enums/SearchMode.ts';
import AccessMode from '../../../modules/contacts/modules/permissions/enums/AccessMode.enum.js';
import { TimelineEventType } from '../../../modules/timeline/enums/TimelineEventType';
import TimelineTaskStatusEnum from '../../../modules/timeline/enums/TimelineTaskStatus.enum.js';

export default {
  crm: 'CRM',
  contacts: {
    contact: 'Contacto | Contactos',
    manager: 'Propietario | Propietarios',
    destination: 'Destino',
    collapseAll: 'Contraer todo',
    allContacts: ({ linked }) =>
      `${linked('reusable.all')} ${linked(`vocabulary.contact`).toLowerCase()}`,
    addContacts: ({ linked }) =>
      `${linked('reusable.add')} ${linked(`vocabulary.contact`).toLowerCase()}`,
    communications: {
      communications: 'Opción de comunicación | Opciones de comunicación',
      channel: 'Canal',
      destination: 'Destino',
      setAsPrimary: 'Establecer como principal',
      emails: {
        addTitle: 'Agregar el correo electrónico',
        editTitle: 'Editar el correo electrónico',
        dummy: 'No hay direcciones de correo electrónico todavía',
      },
      phones: {
        addTitle: 'Agregar el número de teléfono',
        editTitle: 'Editar el número de teléfono',
        dummy: 'No hay números de teléfono todavía',
      },
      messaging: {
        gateway: 'Pasarela',
        provider: 'Proveedor ',
        username: 'Nombre de usuario',
        dummy: 'No hay opciones de mensajería todavía',
        sendMessage: 'Enviar mensaje',
        messengers: {
          [ChatGatewayProvider.TELEGRAM_BOT]: 'Bot de Telegram',
          [ChatGatewayProvider.TELEGRAM_APP]: 'Aplicación de Telegram',
          [ChatGatewayProvider.MESSENGER]: 'Meta',
          [ChatGatewayProvider.VIBER]: 'Viber',
          [ChatGatewayProvider.WEBCHAT]: 'Chat web',
          [ChatGatewayProvider.INFOBIP]: 'Infobip',
          [ChatGatewayProvider.CUSTOM]: 'Pasarela de chat personalizada',
          [ChatGatewayProvider.PORTAL]: 'Portal',
        },
      },
    },
    details: 'Detalles',
    attributes: 'Atributo | Atributos',
  },
  timeline: {
    timeline: 'Línea de tiempo',
    totalDuration: 'Duración total',
    actions: {
      openInHistory: 'Abrir en historial',
      playRecording: 'Reproducir grabación',
      transcription: 'Transcripción',
    },
    status: {
      [TimelineTaskStatusEnum.STARTED]: 'Iniciado',
      [TimelineTaskStatusEnum.MISSED]: 'Perdido',
      [TimelineTaskStatusEnum.TRANSFERRED]: 'Transferido',
      [TimelineTaskStatusEnum.ENDED]: 'Finalizado',
      [TimelineTaskStatusEnum.SENT]: 'Enviado',
      [TimelineTaskStatusEnum.RECEIVED]: 'Recibido',
    },
    eventType: {
      [TimelineEventType.Call]: 'Llamada | Llamadas',
      [TimelineEventType.Chat]: 'Chat | Chats',
      [TimelineEventType.Email]: 'Correo | Correos',
    },
    emails: {
      to: 'Para',
      cc: 'CC',
      subject: 'Asunto',
    },
  },
  permissions: {
    read: 'Leer',
    edit: 'Editar',
    delete: 'Eliminar',
    granteePopup: {
      title: 'Agregar beneficiario',
    },
    accessMode: {
      [AccessMode.ALLOW]: 'Permitir',
      [AccessMode.FORBIDDEN]: 'Prohibido',
      [AccessMode.MANAGE]: 'Permitir con delegación',
    },
  },
  startPage: {
    [CrmSections.CONTACTS]: {
      name: 'Contactos',
      text: 'En esta sección, puede trabajar con sus contactos: clientes, consumidores, etc.',
    },
    [CrmSections.CASES]: {
      name: 'Casos',
      text: 'Aquí puede ver los Casos registrados en el sistema.',
    },
    configuration: {
      name: 'Configuración',
      text: 'En esta sección, configurará el proceso de gestión de Casos.',
    },
  },
  lookups: {
    lookups: 'Búsquedas',

    slas: {
      slas: 'SLA | SLAs',
      conditions: 'Condición | Condiciones',
      editCondition: 'Editar condición',
      addCondition: 'Agregar condición',
      reactionTime: 'Tiempo de reacción',
      reactionTimeTitle: 'Tiempo de reacción (dd:hh:mm)',
      resolutionTime: 'Tiempo de resolución',
      resolutionTimeTitle: 'Tiempo de resolución (dd:hh:mm)',
      validFrom: 'Válido desde',
      validTo: 'Válido hasta',
      error: {
        duplicateConditionName: 'Ya existe una condición con este nombre',
      },
    },

    sources: {
      sources: 'Fuente de caso | Fuentes de caso',
      types: {
        [WebitelCasesSourceType.Call]: 'Llamada',
        [WebitelCasesSourceType.Chat]: 'Chat',
        [WebitelCasesSourceType.SocialMedia]: 'Redes sociales',
        [WebitelCasesSourceType.Email]: 'Correo electrónico',
        [WebitelCasesSourceType.Api]: 'API',
        [WebitelCasesSourceType.Manual]: 'Manual',
      },
    },

    serviceCatalogs: {
      serviceCatalogs: 'Catálogo de servicios | Catálogos de servicios',
      prefix: 'Prefijo',
      code: 'Código',
      statuses: ({ linked }) => linked(`lookups.statuses.statuses`, 2),
      skills: 'Habilidades',
    },

    service: {
      service: 'Servicio | Servicios',
    },

    contactGroups: {
      contactGroups: 'Grupo de contactos | Grupos de contactos',
      defaultGroup: 'Grupo predeterminado',
      addGroup: 'Agregar grupo',
      assignee: 'Asignado',
      types: {
        [ContactsGroupType.Dynamic]: 'Dinámico',
        [ContactsGroupType.Static]: 'Estático',
      },
    },

    closeReasonGroups: {
      closeReasonGroups: 'Razones de cierre',
      reason: 'Razón | Razones',
      addReason: 'Agregar razón',
      editReason: 'Editar razón',
      sameConditionError: 'Ya existe tal condición',
    },

    statuses: {
      statuses: 'Estado | Estados',
      initial: 'Inicial',
      final: 'Final',
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
      statusType: 'Tipo de estado',
      finalStatusValidationText:
        'Debe tener al menos un estado final y solo uno inicial.\n Por favor, regrese y verifique su tipo.',
    },
  },
  customization: {
    customLookups: {
      allValues: 'Todos los valores',
      code: 'Código',
      columns: 'Columnas',
      addColumn: 'Agregar columna',
      editColumn: 'Editar columna',
      defaultValue: 'Valor predeterminado',
      confirmDeleteColumn:
        'Después de eliminar la columna y guardar, todos los datos ingresados en el campo correspondiente también se eliminarán.',
      controlPermissions: 'Controlar permisos',
      field: {
        id: 'ID',
        name: ({ linked }) => linked('reusable.name'),
        createdAt: ({ linked }) => linked('reusable.createdAt'),
        createdBy: ({ linked }) => linked('reusable.createdBy'),
        modifiedAt: ({ linked }) => linked('reusable.modifiedAt'),
        modifiedBy: ({ linked }) => linked('reusable.modifiedBy'),
      },
      fieldType: {
        string: 'Texto',
        int32: 'Número',
        int64: 'Número',
        lookup: 'Selección',
        list: 'Selección múltiple',
        datetime: 'Calendario',
        bool: 'Booleano',
      },
    },
    extensions: {
      contacts: ({ linked }) => linked('contacts.contact'),
      cases: ({ linked }) => linked('cases.case'),
    },
  },
  cases: {
    case: 'Caso | Casos',
    id: 'ID',
    subject: 'Asunto',
    priority: 'Prioridad',
    status: 'Estado',
    source: 'Fuente',
    author: 'Autor',
    service: '@:lookups.service.service',
    assignee: '@:lookups.contactGroups.assignee',
    reporter: 'Informante',
    impacted: 'Afectado',
    appliedSLA: 'SLA aplicado',
    appliedCondition: 'Condición aplicada',
    reactionTime: '@:lookups.slas.reactionTime',
    resolutionTime: '@:lookups.slas.resolutionTime',
    actualReactionTime: 'Tiempo de reacción real',
    actualResolutionTime: 'Tiempo de resolución real',
    closureReason: 'Razón de cierre',
    result: 'Resultado',
    rating: 'Calificación',
    persons: 'Personas',
    selectAService: 'Seleccione un servicio',
    deadlines: 'Plazos',
    ratingComment: 'Comentario de calificación',
    caseResult: 'Resultado del caso',
    assignToMe: 'Asignarme',
    company: 'Empresa',
    department: 'Departamento',
    position: 'Cargo',
    location: 'Ubicación',
    serviceValidation: 'Por favor, seleccione un servicio primero',
    caseNumber: 'Número de caso',
    caseInfo: {
      caseInfo: 'Información del caso',
      contactInfo: 'Información de contacto',
    },
    comments: {
      comments: 'Comentarios',
      edited: 'Editado',
      yourCommentHere: 'Tu comentario aquí',
      emptyText: 'No hay comentarios todavía',
    },
    attachments: {
      attachments: 'Archivos adjuntos',
      files: 'Archivos',
      links: 'Enlaces',
      url: 'URL',
      linkText: 'Texto del enlace',
      emptyFilesText: 'No hay archivos adjuntos todavía',
      emptyLinksText: 'No hay enlaces todavía',
    },
    details: {
      details: 'Detalles',
    },
    relatedCases: {
      relatedCases: 'Casos relacionados',
      emptyText: 'No hay casos relacionados todavía',
      searchCasesPlaceholder: 'Buscar un caso',
      relationType: {
        [WebitelCasesRelationType.Duplicates]: 'duplica',
        [WebitelCasesRelationType.IsDuplicatedBy]: 'es duplicado por',
        [WebitelCasesRelationType.Blocks]: 'bloquea',
        [WebitelCasesRelationType.IsBlockedBy]: 'está bloqueado por',
        [WebitelCasesRelationType.Causes]: 'causa',
        [WebitelCasesRelationType.IsCausedBy]: 'es causado por',
        [WebitelCasesRelationType.IsChildOf]: 'es hijo de',
        [WebitelCasesRelationType.IsParentOf]: 'es padre de',
        [WebitelCasesRelationType.RelatesTo]: 'se relaciona con',
      },
    },
    slaRecalculationPopup: {
      title: 'Recálculo de SLA',
      message:
        'Después de cambiar el servicio y guardar, el SLA del Caso será recalculado.',
    },
  },
  filters: {
    search: {
      [SearchMode.Search]: 'Búsqueda regular',
      [SearchMode.Fts]: 'Búsqueda de texto completo',
    },
  },
};
