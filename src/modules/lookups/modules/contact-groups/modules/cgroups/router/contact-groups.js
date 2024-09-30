import RouteNames from "../../../../../../../app/router/_internals/RouteNames.enum.js";
import ContactGroupsRouteNames from "./_internals/ContactGroupsRouteNames.enum.js";

const ContactGroups = () => import( '../components/the-contact-groups.vue');
const Agent = () => import('../components/opened-contact-groups.vue');
const General = () => import("../components/opened-contact-groups-general.vue");
const Permissions = () => import("../../../../../../_shared/permissions-tab/components/permissions-tab.vue");

import {checkRouteAccess} from "../../../../../../../app/router/_internals/guards.js";
import ContactPermissions
  from '../../../../../../contacts/modules/permissions/components/the-permissions.vue';

const ContactGroupsRoutes = [
  {
    path: '/lookups/contact-groups',
    name: RouteNames.CONTACT_GROUPS,
    component: ContactGroups,
    beforeEnter: checkRouteAccess,
  },
  {
    path: '/lookups/contact-groups/:id',
    name: `${RouteNames.CONTACT_GROUPS}-card`,
    redirect: { name: ContactGroupsRouteNames.GENERAL },
    component: Agent,
    beforeEnter: checkRouteAccess,
    children: [
      {
        path: 'general',
        name: ContactGroupsRouteNames.GENERAL,
        component: General,
      },{
        path: 'permissions/:permissionId?',
        name: ContactGroupsRouteNames.PERMISSIONS,
        component: ContactPermissions,
      }
    ],
  },
]

export default ContactGroupsRoutes;
