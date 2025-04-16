import { CrmSections } from '@webitel/ui-sdk/enums';
import { type RouteRecordRaw } from 'vue-router';

import { checkRouteAccess } from '../../../app/router/internals/guards';
import OpenedContact from '../components/opened-contact.vue';
import ContactCommunications from '../components/opened-contact-communications.vue';
import TheContacts from '../components/the-contacts.vue';
import ContactCases from '../modules/cases/components/the-contact-cases.vue';
import ContactDetails from '../modules/details/components/the-details.vue';
import ContactPermissions from '../modules/permissions/components/the-permissions.vue';
import ContactTimeline from '../modules/timeline/components/contact-timeline.vue';
import ContactVariables from '../modules/variables/components/the-variables.vue';

const contactsRoutes: RouteRecordRaw[] = [
  {
    path: 'contacts',
    name: CrmSections.Contacts,
    component: TheContacts,
    beforeEnter: checkRouteAccess,
    // redirect: { name: `the-start-page` },
  },
  {
    path: 'contacts/:id',
    name: `${CrmSections.Contacts}-card`,
    component: OpenedContact,
    beforeEnter: checkRouteAccess,
    redirect: { name: `${CrmSections.Contacts}-timeline` },
    children: [
      {
        path: 'timeline',
        name: `${CrmSections.Contacts}-timeline`,
        component: ContactTimeline,
      },
      {
        path: 'cases',
        name: `${CrmSections.Contacts}-cases`,
        component: ContactCases,
      },
      {
        path: 'communications',
        redirect: {
          name: `${CrmSections.Contacts}-communications-phones`,
        },
        name: `${CrmSections.Contacts}-communications`,
        component: ContactCommunications,
        children: [
          {
            path: 'phones/:commId?',
            name: `${CrmSections.Contacts}-communications-phones`,
            component: ContactCommunications,
          },
          {
            path: 'messaging/:commId?',
            name: `${CrmSections.Contacts}-communications-messaging`,
            component: ContactCommunications,
          },
          {
            path: 'emails/:commId?',
            name: `${CrmSections.Contacts}-communications-emails`,
            component: ContactCommunications,
          },
        ],
      },
      {
        path: 'variables/:variableId?',
        name: `${CrmSections.Contacts}-variables`,
        component: ContactVariables,
      },
      {
        path: 'details',
        name: `${CrmSections.Contacts}-details`,
        component: ContactDetails,
      },
      {
        path: 'permissions/:permissionId?',
        name: `${CrmSections.Contacts}-permissions`,
        component: ContactPermissions,
      },
    ],
  },
];

export default contactsRoutes;
