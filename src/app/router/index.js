import CrmSections
  from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum';
import { createRouter, createWebHistory } from 'vue-router';
import OpenedServiceCatalogs
  from '../../modules/configuration/modules/lookups/modules/service-catalogs/components/opened-service-catalogs.vue';
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
import TheSlas
  from '../../modules/configuration/modules/lookups/modules/slas/components/the-slas.vue';
import OpenedSla from '../../modules/configuration/modules/lookups/modules/slas/components/opened-sla.vue';
import OpenedSlaGeneral from '../../modules/configuration/modules/lookups/modules/slas/components/opened-sla-general.vue';
import TheSources
  from '../../modules/configuration/modules/lookups/modules/sources/components/the-sources.vue';
import OpenedSource
  from '../../modules/configuration/modules/lookups/modules/sources/components/opened-source.vue';
import OpenedSourceGeneral
  from '../../modules/configuration/modules/lookups/modules/sources/components/opened-source-general.vue';
import OpenedSlaConditions
  from '../../modules/configuration/modules/lookups/modules/slas/modules/conditions/components/opened-sla-conditions.vue';
import TheServiceCatalogs
  from '../../modules/configuration/modules/lookups/modules/service-catalogs/components/the-service-catalogs.vue';

import store from '../store';
import TheConfiguration from '../../modules/configuration/components/the-configuration.vue';
import OpenedServiceCatalogsGeneral
  from '../../modules/configuration/modules/lookups/modules/service-catalogs/components/opened-service-catalogs-general.vue';
import TheCatalogServices
  from '../../modules/configuration/modules/lookups/modules/service-catalogs/modules/services/components/the-catalog-services.vue';
import OpenedServices
  from '../../modules/configuration/modules/lookups/modules/service-catalogs/modules/services/components/opened-services.vue';
import OpenedServicesGeneral
  from '../../modules/configuration/modules/lookups/modules/service-catalogs/modules/services/components/opened-services-general.vue';

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
      {
        path: 'configuration',
        name: 'configuration',
        component: TheConfiguration,
        // beforeEnter: checkRouteAccess,
      },
      {
        path: 'lookups',
        name: 'lookups',
        redirect: { name: 'configuration' },
        children: [
          {
            path: 'slas',
            name: CrmSections.SLAS,
            component: TheSlas,
            // beforeEnter: checkRouteAccess,
          },
          {
            path: 'slas/:id',
            name: `${CrmSections.SLAS}-card`,
            component: OpenedSla,
            redirect: { name: `${CrmSections.SLAS}-general` },
            children: [
              {
                path: 'general',
                name: `${CrmSections.SLAS}-general`,
                component: OpenedSlaGeneral,
              },
              {
                path: 'conditions/:conditionId?',
                name: `${CrmSections.SLAS}-conditions`,
                component: OpenedSlaConditions,
              },
            ],
          },
          {
            path: 'sources',
            name: CrmSections.SOURCES,
            component: TheSources,
            // beforeEnter: checkRouteAccess,
          },
          {
            path: 'sources/:id',
            name: `${CrmSections.SOURCES}-card`,
            component: OpenedSource,
            redirect: { name: `${CrmSections.SOURCES}-general` },
            children: [
              {
                path: 'general',
                name: `${CrmSections.SOURCES}-general`,
                component: OpenedSourceGeneral,
              },
            ],
          },
          {
            path: 'service-catalogs',
            name: CrmSections.SERVICE_CATALOGS,
            component: TheServiceCatalogs,
            // beforeEnter: checkRouteAccess,
          },
          {
            path: 'service-catalogs/:id',
            name: `${CrmSections.SERVICE_CATALOGS}-card`,
            component: OpenedServiceCatalogs,
            redirect: { name: `${CrmSections.SERVICE_CATALOGS}-general` },
            children: [
              {
                path: 'general',
                name: `${CrmSections.SERVICE_CATALOGS}-general`,
                component: OpenedServiceCatalogsGeneral,
              },
            ],
          },
          {
            path: 'service-catalogs/:id/services',
            name: `${CrmSections.SERVICE_CATALOGS}-services`,
            component: TheCatalogServices,
          },
          {
            path: 'service-catalogs/:catalogId/services/:id',
            name: `${CrmSections.SERVICE_CATALOGS}-services-card`,
            component: OpenedServices,
            redirect: { name: `${CrmSections.SERVICE_CATALOGS}-services-card-general` },
            children: [
              {
                path: 'general',
                name: `${CrmSections.SERVICE_CATALOGS}-services-card-general`,
                component: OpenedServicesGeneral,
              },
            ],
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
