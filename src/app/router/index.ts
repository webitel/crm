import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized,
  type RouteRecordRaw,
} from 'vue-router';
import { WtApplication } from '@webitel/ui-sdk/enums';

import casesRoutes from '../../modules/cases/router';
import caseViewRoute from '../../modules/cases/router/case-view';
import configurationRoutes from '../../modules/configuration/router';
import contactsRoutes from '../../modules/contacts/router';
import contactViewRoute from '../../modules/contacts/router/contact-view';
import startPageRoutes from '../../modules/start-page/router';
import TheCrmWorkspace from '../components/the-crm-workspace.vue';
import AccessDenied from '../components/utils/access-denied-component.vue';
import NotFound from '../../modules/error-pages/components/the-not-found-component.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'crm-workspace',
    redirect: { name: 'the-start-page' },
    component: TheCrmWorkspace,
    meta: { WtApplication: WtApplication.Crm },
    children: [
      ...startPageRoutes,
      ...casesRoutes,
      ...contactsRoutes,
      ...configurationRoutes,
    ],
  },
  {
    path: '/view',
    name: 'crm-view',
    redirect: { name: 'the-start-page' },
    component: TheCrmWorkspace,
    children: [...contactViewRoute, ...caseViewRoute],
  },
  {
    path: '/access-denied',
    name: 'access-denied',
    component: AccessDenied,
  },
  {
    // Added to render 404 pages with the common workspace layout (header)
   // https://webitel.atlassian.net/browse/WTEL-8137
    path: '/404',
    name: 'not-found',
    component: TheCrmWorkspace,
    children: [
      {
        path: '',
        name: 'not-found-inner',
        component: NotFound,
      },
    ],
  }
];

export let router = null;

export const initRouter = async ({
  beforeEach = [],
} = {}) => {
  router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    scrollBehavior() {
      return { left: 0, top: 0 };
    },
    routes,
  });

  router.beforeEach(
    (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardNext,
    ) => {
      if (!localStorage.getItem('access-token') && !to.query.accessToken) {
        const desiredUrl = encodeURIComponent(window.location.href);
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
    },
  );

  beforeEach.forEach((guard) => {
    router.beforeEach(guard);
  });

  return router;
};
