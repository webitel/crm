import RouteNames from "../../../../../../../app/router/_internals/RouteNames.enum.js";
import ContactGroupsRouteNames from "./_internals/SourcesRouteNames.enum.js";

const Sources = () => import( '../components/the-sources.vue');

import {checkRouteAccess} from "../../../../../../../app/router/_internals/guards.js";

const ContactGroupsRoutes = [
  {
    path: '/lookups/sources',
    name: RouteNames.CONTACT_GROUPS,
    component: Sources,
    beforeEnter: checkRouteAccess,
  },
]

export default ContactGroupsRoutes;
