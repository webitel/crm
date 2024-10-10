import CrmSections
  from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum';
import { createRouter, createWebHistory } from 'vue-router';
import ContactCommunications
  from '../../modules/contacts/components/opened-contact-communications.vue';
import OpenedContact
  from '../../modules/contacts/components/opened-contact.vue';
import ContactPermissions
  from '../../modules/contacts/modules/permissions/components/the-permissions.vue';
import ContactTimeline
  from '../../modules/contacts/modules/timeline/components/the-timeline.vue';
import ContactVariables
  from '../../modules/contacts/modules/variables/components/the-variables.vue';
import TheCrmWorkspace from '../components/the-crm-workspace.vue';
import AccessDenied from '../components/utils/access-denied-component.vue';
import TheStartPage
  from '../../modules/start-page/components/the-start-page.vue';
import TheContacts from '../../modules/contacts/components/the-contacts.vue';


import store from '../store';
import TheConfiguration from '../../modules/configuration/components/the-configuration.vue';

const checkAppAccess = (to, from, next) => {
  const hasReadAccess = store.getters['userinfo/CHECK_APP_ACCESS'](store.getters['userinfo/THIS_APP']);
  if (hasReadAccess) {
    next();
  } else {
    next('/access-denied');
  }
};

const checkRouteAccess = ((to, from, next) => {
  // has Role Section Access AND (Select role permissions || ObAC permissions access)
  const hasReadAccess = store.getters['userinfo/CHECK_OBJECT_ACCESS']({ route: to })
    && store.getters['userinfo/HAS_READ_ACCESS']({ name: 'contacts' });
  if (hasReadAccess) {
    next();
  } else {
    next('/access-denied');
  }
});

const routes = [
  {
    path: '/',
    name: 'crm-workspace',
    redirect: { name: 'the-start-page' },
    component: TheCrmWorkspace,
    beforeEnter: checkAppAccess,
    children: [
      {
        path: 'start-page',
        name: 'the-start-page',
        component: TheStartPage,
      },
      {
        path: 'configuration',
        name: CrmSections.CONFIGURATION,
        component: TheConfiguration,
        // beforeEnter: checkRouteAccess,
        // redirect: { name: `the-start-page` },
      },
      {
        path: 'contacts',
        name: CrmSections.CONTACTS,
        component: TheContacts,
        beforeEnter: checkRouteAccess,
        // redirect: { name: `the-start-page` },
      },
      {
        path: 'contacts/:id',
        name: `${CrmSections.CONTACTS}-card`,
        component: OpenedContact,
        beforeEnter: checkRouteAccess,
        redirect: { name: `${CrmSections.CONTACTS}-timeline` },
        children: [
          {
            path: 'timeline',
            name: `${CrmSections.CONTACTS}-timeline`,
            component: ContactTimeline,
          },
          {
            path: 'communications',
            redirect: {
              name: `${CrmSections.CONTACTS}-communications-phones`,
            },
            name: `${CrmSections.CONTACTS}-communications`,
            component: ContactCommunications,
            children: [
              {
                path: 'phones/:commId?',
                name: `${CrmSections.CONTACTS}-communications-phones`,
                component: ContactCommunications,
              },
              {
                path: 'messaging/:commId?',
                name: `${CrmSections.CONTACTS}-communications-messaging`,
                component: ContactCommunications,
              },
              {
                path: 'emails/:commId?',
                name: `${CrmSections.CONTACTS}-communications-emails`,
                component: ContactCommunications,
              },
            ],
          },
          {
            path: 'variables/:variableId?',
            name: `${CrmSections.CONTACTS}-variables`,
            component: ContactVariables,
          },
          {
            path: 'permissions/:permissionId?',
            name: `${CrmSections.CONTACTS}-permissions`,
            component: ContactPermissions,
          },
        ],
      },
    ],
  },
  {
    path: '/access-denied',
    name: 'access-denied',
    component: AccessDenied,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { left: 0, top: 0 };
  },
  routes,
});

router.beforeEach((to, from, next) => {
  if (!localStorage.getItem('access-token') && !to.query.accessToken) {
    const desiredUrl =  encodeURIComponent(window.location.href);
    const authUrl = import.meta.env.VITE_AUTH_URL;
    window.location.href = `${authUrl}?redirectTo=${desiredUrl}`;
  } else if (to.query.accessToken) {
    // assume that access token was set from query before app initialization in main.js
    const newQuery = { ...to.query };
    delete newQuery.accessToken;
    next({ ...to, query: newQuery });
  } else {
    next();
  }
});

export default router;
