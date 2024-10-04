import RouteNames from "../../../../../../../app/router/_internals/RouteNames.enum.js";
import ContactGroupsRouteNames from "./_internals/SourcesRouteNames.enum.js";

const Sources = () => import( '../components/the-sources.vue');
const Agent = () => import('../components/opened-sources.vue');
const General = () => import("../components/opened-sources-general.vue");

import {checkRouteAccess} from "../../../../../../../app/router/_internals/guards.js";

const ContactGroupsRoutes = [
  {
    path: '/lookups/sources',
    name: RouteNames.CONTACT_GROUPS,
    component: Sources,
    beforeEnter: checkRouteAccess,
  },
  {
    path: '/lookups/sources/:id',
    name: `${RouteNames.CONTACT_GROUPS}-card`,
    redirect: { name: ContactGroupsRouteNames.GENERAL },
    component: Agent,
    beforeEnter: checkRouteAccess,
    children: [
      {
        path: 'general',
        name: ContactGroupsRouteNames.GENERAL,
        component: General,
      }
    ],
  },
]

export default ContactGroupsRoutes;
