import { createRouter, createWebHistory } from 'vue-router';
import CrmSections
  from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum';
import Auth from '@webitel/ui-sdk/src/modules/Userinfo/components/the-auth.vue';
import store from '../store';
import TheCrmWorkspace from '../components/the-crm-workspace.vue';
import TheContacts from '../../modules/contacts/components/the-contacts.vue';
import OpenedContact
  from '../../modules/contacts/components/opened-contact.vue';
import AccessDenied from '../components/utils/access-denied-component.vue';
import ContactCommunications
  from '../../modules/contacts/components/opened-contact-communications.vue';
import ContactPermissions
  from '../../modules/contacts/modules/permissions/components/the-permissions.vue';

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
    path: '/auth',
    name: 'auth',
    component: Auth,
  },
  {
    path: '/',
    name: 'crm-workspace',
    redirect: { name: CrmSections.CONTACTS },
    component: TheCrmWorkspace,
    beforeEnter: checkAppAccess,
    children: [
      {
      path: 'contacts',
      name: CrmSections.CONTACTS,
      component: TheContacts,
      beforeEnter: checkRouteAccess,
    },
      {
        path: 'contacts/:id',
        name: `${CrmSections.CONTACTS}-edit`,
        component: OpenedContact,
        beforeEnter: checkRouteAccess,
        children: [
          {
            path: 'communications',
            name: `${CrmSections.CONTACTS}-communications`,
            component: ContactCommunications,
          },
          {
            path: 'permissions',
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
  history: createWebHistory(process.env.BASE_URL),
  scrollBehavior() {
    return { left: 0, top: 0 };
  },
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('access-token');
  if (!(to.fullPath === '/auth')) {
    if (!token) {
      next('/auth');
      return;
    }
  }
  next();
});

export default router;
