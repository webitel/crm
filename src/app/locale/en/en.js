import ChatGatewayProvider from '@webitel/ui-sdk/src/enums/ChatGatewayProvider/ChatGatewayProvider.enum.js';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum';
import { CasesSourceType } from 'webitel-sdk';
import { WebitelContactsGroupType } from 'webitel-sdk';
import { CasesRelationType } from 'webitel-sdk';

import { SearchMode } from '../../../modules/cases/filters/SearchMode.js';
import AccessMode from '../../../modules/contacts/modules/permissions/enums/AccessMode.enum.js';
import { TimelineEventType } from '../../../modules/timeline/enums/TimelineEventType';
import TimelineTaskStatusEnum from '../../../modules/timeline/enums/TimelineTaskStatus.enum.js';

export default {
  crm: 'CRM',
  contacts: {
    contact: 'Contact | Contacts',
    manager: 'Owner | Owners',
    destination: 'Destination',
    collapseAll: 'Collapse all',
    communications: {
      communications: 'Communication option | Communication options',
      channel: 'Channel',
      destination: 'Destination',
      setAsPrimary: 'Set as primary',
      emails: {
        addTitle: 'Add the email',
        editTitle: 'Edit the email',
        dummy: 'There are no email addresses yet',
      },
      phones: {
        addTitle: 'Add the phone number',
        editTitle: 'Edit the phone number',
        dummy: 'There are no phone numbers yet',
      },
      messaging: {
        gateway: 'Gateway',
        provider: 'Provider ',
        username: 'Username',
        dummy: 'There are no messaging options yet',
        messengers: {
          [ChatGatewayProvider.TELEGRAM_BOT]: 'Telegram Bot',
          [ChatGatewayProvider.TELEGRAM_APP]: 'Telegram App',
          [ChatGatewayProvider.MESSENGER]: 'Meta',
          [ChatGatewayProvider.VIBER]: 'Viber',
          [ChatGatewayProvider.WEBCHAT]: 'Web chat',
          [ChatGatewayProvider.INFOBIP]: 'Infobip',
          [ChatGatewayProvider.CUSTOM]: 'Custom Chat Gateway',
        },
      },
    },
    attributes: 'Attribute | Attributes',
  },
  timeline: {
    timeline: 'Timeline',
    totalDuration: 'Total duration',
    actions: {
      openInHistory: 'Open in history',
      playRecording: 'Play recording',
      transcription: 'Transcription',
    },
    status: {
      [TimelineTaskStatusEnum.STARTED]: 'Started',
      [TimelineTaskStatusEnum.MISSED]: 'Missed',
      [TimelineTaskStatusEnum.TRANSFERRED]: 'Transferred',
      [TimelineTaskStatusEnum.ENDED]: 'Ended',
      [TimelineTaskStatusEnum.SENT]: 'Sent',
      [TimelineTaskStatusEnum.RECEIVED]: 'Received',
    },
    eventType: {
      [TimelineEventType.Call]: 'Call | Calls',
      [TimelineEventType.Chat]: 'Chat | Chats',
      [TimelineEventType.Email]: 'Email | Emails',
    },
    emails: {
      to: 'To',
      cc: 'CC',
      subject: 'Subject',
    },
  },
  permissions: {
    read: 'Read',
    edit: 'Edit',
    delete: 'Delete',
    granteePopup: {
      title: 'Add grantee',
    },
    accessMode: {
      [AccessMode.ALLOW]: 'Allow',
      [AccessMode.FORBIDDEN]: 'Forbidden',
      [AccessMode.MANAGE]: 'Allow with delegation',
    },
  },
  startPage: {
    [CrmSections.CONTACTS]: {
      name: 'Contacts',
      text: 'In this section, you can work with your contacts: clients, customers etc.',
    },
    [CrmSections.CASES]: {
      name: 'Cases',
      text: 'Here you can view Cases registered in the system.',
    },
    configuration: {
      name: 'Configuration',
      text: 'In this section, you will set up the Case management process.',
    },
  },
  lookups: {
    lookups: 'Lookups',

    slas: {
      slas: 'SLA | SLAs',
      conditions: 'Condition | Conditions',
      editCondition: 'Edit condition',
      addCondition: 'Add condition',
      reactionTime: 'Reaction time',
      reactionTimeTitle: 'Reaction time (dd:hh:mm)',
      resolutionTime: 'Resolution time',
      resolutionTimeTitle: 'Resolution time (dd:hh:mm)',
      validFrom: 'Valid from',
      validTo: 'Valid to',
    },

    sources: {
      sources: 'Case source | Case sources',
      types: {
        [CasesSourceType.CALL]: 'Call',
        [CasesSourceType.CHAT]: 'Chat',
        [CasesSourceType.SOCIALMEDIA]: 'Social Media',
        [CasesSourceType.EMAIL]: 'Email',
        [CasesSourceType.API]: 'API',
        [CasesSourceType.MANUAL]: 'Manual',
      },
    },

    serviceCatalogs: {
      serviceCatalogs: 'Service catalog | Service catalogs',
      prefix: 'Prefix',
      code: 'Code',
      statuses: ({ linked }) => linked(`lookups.statuses.statuses`, 2),
      skills: 'Skills',
    },

    service: {
      service: 'Service | Services',
    },

    contactGroups: {
      contactGroups: 'Contact group | Contact groups',
      defaultGroup: 'Default group',
      addGroup: 'Add group',
      assignee: 'Assignee',
      types: {
        [WebitelContactsGroupType.DYNAMIC]: 'Dynamic',
        [WebitelContactsGroupType.STATIC]: 'Static',
      },
    },

    closeReasonGroups: {
      closeReasonGroups: 'Closure reasons',
      reason: 'Reason | Reasons',
      addReason: 'Add reason',
      editReason: 'Edit reason',
      sameConditionError: 'Such condition already exists',
    },

    statuses: {
      statuses: 'Status | Statuses',
      initial: 'Initial',
      final: 'Final',
      addStatus: ({ linked }) =>
        `${linked('reusable.add')} ${linked(`lookups.statuses.statuses`, 1).toLowerCase()}`,
      editStatus: ({ linked }) =>
        `${linked('reusable.edit')} ${linked(`lookups.statuses.statuses`, 1).toLowerCase()}`,
      statusType: 'Status type',
      finalStatusValidationText:
        'You should have at least one final status and only one initial.\n Please, return and check its type.',
    },
  },
  customization: {
    customization: 'Customization',
    customLookups: {
      customLookups: 'Custom lookups',
      allValues: 'All values',
      code: 'Code',
      columns: 'Columns',
      addColumn: 'Add column',
      editColumn: 'Edit column',
      confirmDeleteColumn:
        'After deleting the column and saving, all the entered data in the corresponding field will be deleted as well.',
      controlPermissions: 'Control permissions',
      field: {
        id: 'Id',
        name: ({ linked }) => linked('reusable.name'),
        createdAt: ({ linked }) => linked('reusable.createdAt'),
        createdBy: ({ linked }) => linked('reusable.createdBy'),
        modifiedAt: ({ linked }) => linked('reusable.modifiedAt'),
        modifiedBy: ({ linked }) => linked('reusable.modifiedBy'),
      },
      fieldType: {
        string: 'Text',
        int32: 'Number',
        int64: 'Number',
        lookup: 'Select',
        list: 'Multiselect',
        datetime: 'Calendar',
        bool: 'Boolean',
      },
    },
    extensions: {
      contacts: ({ linked }) => linked('contacts.contact'),
    },
  },
  cases: {
    case: 'Case | Cases',
    id: 'ID',
    subject: 'Subject',
    priority: 'Priority',
    status: 'Status',
    source: 'Source',
    author: 'Author',
    group: 'Group',
    service: '@:lookups.service.service',
    assignee: '@:lookups.contactGroups.assignee',
    reporter: 'Reporter',
    impacted: 'Impacted',
    appliedSLA: 'Applied SLA',
    appliedCondition: 'Applied condition',
    reactionTime: '@:lookups.slas.reactionTime',
    resolutionTime: '@:lookups.slas.resolutionTime',
    actualReactionTime: 'Actual reaction time',
    actualResolutionTime: 'Actual resolution time',
    reason: '@:lookups.closeReasonGroups.reason',
    result: 'Result',
    rating: 'Rating',
    persons: 'Persons',
    selectAService: 'Select a service',
    deadlines: 'Deadlines',
    ratingComment: 'Rating comment',
    caseResult: 'Case result',
    assignToMe: 'Assign to me',
    caseInfo: {
      caseInfo: 'Case info',
      contactInfo: 'Contact info',
    },
    comments: {
      comments: 'Comments',
      edited: 'Edited',
      yourCommentHere: 'Your comment here',
      emptyText: 'There are no comments yet',
    },
    attachments: {
      attachments: 'Attachments',
      files: 'Files',
      links: 'Links',
      url: 'URL',
      linkText: 'Link text',
      emptyFilesText: 'There are no attachments yet',
      emptyLinksText: 'There are no links yet',
    },
    relatedCases: {
      relatedCases: 'Related cases',
      emptyText: 'There are no related cases yet',
      searchCasesPlaceholder: 'Search for a case',
      relationType: {
        [CasesRelationType.DUPLICATES]: 'duplicates',
        [CasesRelationType.ISDUPLICATEDBY]: 'is duplicated by',
        [CasesRelationType.BLOCKS]: 'blocks',
        [CasesRelationType.ISBLOCKEDBY]: 'is blocked by',
        [CasesRelationType.CAUSES]: 'causes',
        [CasesRelationType.ISCAUSEDBY]: 'is caused by',
        [CasesRelationType.ISCHILDOF]: 'is child of',
        [CasesRelationType.ISPARENTOF]: 'is parent of',
        [CasesRelationType.RELATESTO]: 'relates to',
      },
    },
    slaRecalculationPopup: {
      title: 'SLA recalculation',
      message: 'After changing the service, the SLA of the Case will be recalculated.',
    },
  },
  filters: {
    search: {
      [SearchMode.Search]: 'Regular search',
      [SearchMode.Fts]: 'Full text search',
    },
  },
};
