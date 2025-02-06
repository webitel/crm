import ChatGatewayProvider from '@webitel/ui-sdk/src/enums/ChatGatewayProvider/ChatGatewayProvider.enum.js';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum';
import { WebitelContactsTimelineEventType } from 'webitel-sdk';
import { CasesSourceType } from 'webitel-sdk';
import { WebitelContactsGroupType } from 'webitel-sdk';

import AccessMode from '../../../modules/contacts/modules/permissions/enums/AccessMode.enum.js';
import TimelineTaskStatusEnum from '../../../modules/contacts/modules/timeline/enums/TimelineTaskStatus.enum.js';

export default {
  crm: 'CRM',
  contacts: {
    contact: 'Contact | Contacts',
    manager: 'Owner | Owners',
    destination: 'Destination',
    collapseAll: 'Collapse all',
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
        [WebitelContactsTimelineEventType.Call]: 'Call | Calls',
        [WebitelContactsTimelineEventType.Chat]: 'Chat | Chats',
        [WebitelContactsTimelineEventType.Email]: 'Email | Emails',
      },
      emails: {
        to: 'To',
        cc: 'CC',
        subject: 'Subject',
      },
    },
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
      controlPermissions: 'Control permissions',
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
    caseInfo: {
      caseInfo: 'Case info',
      contactInfo: 'Contact info',
    },
    comments: {
      comments: 'Comments',
      edited: 'Edited',
      yourCommentHere: 'Your comment here',
    },
    attachments: {
      attachments: 'Attachments',
      links: 'Links',
      url: 'URL',
      linkText: 'Link text',
    },
  },
};
