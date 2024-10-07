import ChatGatewayProvider
  from '@webitel/ui-sdk/src/enums/ChatGatewayProvider/ChatGatewayProvider.enum.js';
import { WebitelContactsTimelineEventType } from 'webitel-sdk';
import AccessMode
  from '../../../modules/contacts/modules/permissions/enums/AccessMode.enum.js';
import TimelineTaskStatusEnum
  from '../../../modules/contacts/modules/timeline/enums/TimelineTaskStatus.enum.js';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum';

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
    [CrmSections.CONFIGURATION]: {
      name: 'Configuration',
      text: 'In this section, you will set up the Case management process.',
    },
  },
};
