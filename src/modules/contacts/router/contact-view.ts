import { type RouteRecordRaw } from 'vue-router';

import ContactCommunications from '../components/opened-contact-communications.vue';
import OpenedContactView from '../components/opened-contact-view.vue';
import ContactCases from '../modules/cases/components/the-contact-cases.vue';
import ContactDetails from '../modules/details/components/the-details.vue';
import ContactPermissions from '../modules/permissions/components/the-permissions.vue';
import ContactTimeline from '../modules/timeline/components/contact-timeline.vue';
import ContactVariables from '../modules/variables/components/the-variables.vue';

const CONTACT_VIEW_NAME = 'contact_view';

const contactsChildrenRoutes: RouteRecordRaw[] = [
  {
    path: 'timeline',
    name: `${CONTACT_VIEW_NAME}-timeline`,
    component: ContactTimeline,
  },
  {
    path: 'cases',
    name: `${CONTACT_VIEW_NAME}-cases`,
    component: ContactCases,
  },
  {
    path: 'communications',
    redirect: {
      name: `${CONTACT_VIEW_NAME}-communications-phones`,
    },
    name: `${CONTACT_VIEW_NAME}-communications`,
    component: ContactCommunications,
    children: [
      {
        path: 'phones/:commId?',
        name: `${CONTACT_VIEW_NAME}-communications-phones`,
        component: ContactCommunications,
      },
      {
        path: 'messaging/:commId?',
        name: `${CONTACT_VIEW_NAME}-communications-messaging`,
        component: ContactCommunications,
      },
      {
        path: 'emails/:commId?',
        name: `${CONTACT_VIEW_NAME}-communications-emails`,
        component: ContactCommunications,
      },
    ],
  },
  {
    path: 'variables/:variableId?',
    name: `${CONTACT_VIEW_NAME}-variables`,
    component: ContactVariables,
  },
  {
    path: 'details',
    name: `${CONTACT_VIEW_NAME}-details`,
    component: ContactDetails,
  },
  {
    path: 'permissions/:permissionId?',
    name: `${CONTACT_VIEW_NAME}-permissions`,
    component: ContactPermissions,
  },
];

const contactViewRoute: RouteRecordRaw[] = [
  {
    path: `${CONTACT_VIEW_NAME}/:id`,
    name: CONTACT_VIEW_NAME,
    component: OpenedContactView,
    redirect: { name: `${CONTACT_VIEW_NAME}-timeline` },
    children: contactsChildrenRoutes,
    meta: { hideHeader: true },
  },
];

export default contactViewRoute;
