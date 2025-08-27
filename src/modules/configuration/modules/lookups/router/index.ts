import { CrmSections, WtObject } from '@webitel/ui-sdk/enums';
import PermissionsTab from '@webitel/ui-sdk/src/modules/ObjectPermissions/components/permissions-tab.vue';
import { RouteLocationNormalized, type RouteRecordRaw } from 'vue-router';

import OpenedCloseReasonGroups from '../modules/close-reason-groups/components/opened-close-reason-groups.vue';
import OpenedCloseReasonGroupsGeneral from '../modules/close-reason-groups/components/opened-close-reason-groups-general.vue';
import TheCloseReasonGroups from '../modules/close-reason-groups/components/the-close-reason-groups.vue';
import OpenedCloseReasons from '../modules/close-reason-groups/modules/close-reasons/components/opened-close-reasons.vue';
import OpenedContactGroup from '../modules/contact-groups/components/opened-contact-group.vue';
import OpenedContactGroupGeneral from '../modules/contact-groups/components/opened-contact-group-general.vue';
import TheContactGroups from '../modules/contact-groups/components/the-contact-groups.vue';
import OpenedContactGroupsConditions from '../modules/contact-groups/modules/conditions/components/opened-contact-group-conditions.vue';
import OpenedContactGroupsContacts from '../modules/contact-groups/modules/contacts/components/opened-contact-group-contacts.vue';
import OpenedCustomLookupRecord from '../modules/custom-lookup/components/opened-custom-lookup-record.vue';
import OpenedCustomLookupRecordsColumns from '../modules/custom-lookup/components/opened-custom-lookup-records-columns.vue';
import TheCustomLookup from '../modules/custom-lookup/components/the-custom-lookup.vue';
import OpenedPriority from '../modules/priorities/components/opened-priority.vue';
import OpenedPriorityGeneral from '../modules/priorities/components/opened-priority-general.vue';
import ThePriorities from '../modules/priorities/components/the-priorities.vue';
import OpenedServiceCatalogs from '../modules/service-catalogs/components/opened-service-catalogs.vue';
import OpenedServiceCatalogsGeneral from '../modules/service-catalogs/components/opened-service-catalogs-general.vue';
import TheServiceCatalogs from '../modules/service-catalogs/components/the-service-catalogs.vue';
import OpenedServices from '../modules/service-catalogs/modules/services/components/opened-services.vue';
import OpenedServicesGeneral from '../modules/service-catalogs/modules/services/components/opened-services-general.vue';
import TheCatalogServices from '../modules/service-catalogs/modules/services/components/the-catalog-services.vue';
import OpenedSla from '../modules/slas/components/opened-sla.vue';
import OpenedSlaGeneral from '../modules/slas/components/opened-sla-general.vue';
import TheSlas from '../modules/slas/components/the-slas.vue';
import OpenedSlaConditions from '../modules/slas/modules/conditions/components/opened-sla-conditions.vue';
import OpenedSource from '../modules/sources/components/opened-source.vue';
import OpenedSourceGeneral from '../modules/sources/components/opened-source-general.vue';
import TheSources from '../modules/sources/components/the-sources.vue';
import OpenedStatus from '../modules/statuses/components/opened-status.vue';
import OpenedStatusGeneral from '../modules/statuses/components/opened-status-general.vue';
import TheStatuses from '../modules/statuses/components/the-statuses.vue';
import OpenedStatusConditions from '../modules/statuses/modules/status-conditions/components/opened-status-conditions.vue';

const lookupsRoutes: RouteRecordRaw[] = [
  {
    path: 'lookups',
    name: 'lookups',
    redirect: { name: 'configuration' },
    children: [
      {
        path: 'slas',
        name: CrmSections.Slas,
        component: TheSlas,
        meta: {
          WtObject: WtObject.Slas,
          UiSection: CrmSections.Slas,
        },
      },
      {
        path: 'slas/:id',
        name: `${CrmSections.Slas}-card`,
        component: OpenedSla,
        redirect: { name: `${CrmSections.Slas}-general` },
        meta: {
          WtObject: WtObject.Slas,
          UiSection: CrmSections.Slas,
        },
        children: [
          {
            path: 'general',
            name: `${CrmSections.Slas}-general`,
            component: OpenedSlaGeneral,
          },
          {
            path: 'conditions/:conditionId?',
            name: `${CrmSections.Slas}-conditions`,
            component: OpenedSlaConditions,
          },
        ],
      },
      {
        path: 'sources',
        name: CrmSections.Sources,
        component: TheSources,
        meta: {
          WtObject: WtObject.Source,
          UiSection: CrmSections.Sources,
        },
      },
      {
        path: 'sources/:id',
        name: `${CrmSections.Sources}-card`,
        component: OpenedSource,
        redirect: { name: `${CrmSections.Sources}-general` },
        meta: {
          WtObject: WtObject.Source,
          UiSection: CrmSections.Sources,
        },
        children: [
          {
            path: 'general',
            name: `${CrmSections.Sources}-general`,
            component: OpenedSourceGeneral,
          },
        ],
      },
      {
        path: 'close-reason-groups',
        name: CrmSections.CloseReasonGroups,
        component: TheCloseReasonGroups,
        meta: {
          WtObject: WtObject.CloseReasonGroup,
          UiSection: CrmSections.CloseReasonGroups,
        },
      },
      {
        path: 'close-reason-groups/:id',
        name: `${CrmSections.CloseReasonGroups}-card`,
        component: OpenedCloseReasonGroups,
        redirect: { name: `${CrmSections.CloseReasonGroups}-general` },
        meta: {
          WtObject: WtObject.CloseReasonGroup,
          UiSection: CrmSections.CloseReasonGroups,
        },
        children: [
          {
            path: 'general',
            name: `${CrmSections.CloseReasonGroups}-general`,
            component: OpenedCloseReasonGroupsGeneral,
          },
          {
            path: 'close-reasons/:closeReasonsId?',
            name: `close-reasons`,
            component: OpenedCloseReasons,
          },
        ],
      },
      {
        path: 'service-catalogs',
        name: CrmSections.ServiceCatalogs,
        component: TheServiceCatalogs,
        meta: {
          WtObject: WtObject.ServiceCatalog,
          UiSection: CrmSections.ServiceCatalogs,
        },
      },
      {
        path: 'service-catalogs/:id',
        name: `${CrmSections.ServiceCatalogs}-card`,
        component: OpenedServiceCatalogs,
        redirect: { name: `${CrmSections.ServiceCatalogs}-general` },
        meta: {
          WtObject: WtObject.ServiceCatalog,
          UiSection: CrmSections.ServiceCatalogs,
        },
        children: [
          {
            path: 'general',
            name: `${CrmSections.ServiceCatalogs}-general`,
            component: OpenedServiceCatalogsGeneral,
          },
        ],
      },
      {
        path: 'service-catalogs/:catalogId/:rootId/services',
        name: `${CrmSections.ServiceCatalogs}-services`,
        component: TheCatalogServices,
        meta: {
          WtObject: WtObject.ServiceCatalog,
          UiSection: CrmSections.ServiceCatalogs,
        },
      },
      {
        path: 'service-catalogs/:catalogId/:rootId/services/:id',
        name: `${CrmSections.ServiceCatalogs}-services-card`,
        component: OpenedServices,
        redirect: {
          name: `${CrmSections.ServiceCatalogs}-services-card-general`,
        },
        meta: {
          WtObject: WtObject.ServiceCatalog,
          UiSection: CrmSections.ServiceCatalogs,
        },
        children: [
          {
            path: 'general',
            name: `${CrmSections.ServiceCatalogs}-services-card-general`,
            component: OpenedServicesGeneral,
          },
        ],
      },
      {
        path: 'contact-groups',
        name: CrmSections.ContactGroups,
        component: TheContactGroups,
        meta: {
          WtObject: WtObject.ContactGroup,
          UiSection: CrmSections.ContactGroups,
        },
        // beforeEnter: checkRouteAccess,
      },
      {
        path: 'contact-groups/:id',
        name: `${CrmSections.ContactGroups}-card`,
        component: OpenedContactGroup,
        redirect: { name: `${CrmSections.ContactGroups}-general` },
        meta: {
          WtObject: WtObject.ContactGroup,
          UiSection: CrmSections.ContactGroups,
        },
        children: [
          {
            path: 'general',
            name: `${CrmSections.ContactGroups}-general`,
            component: OpenedContactGroupGeneral,
          },
          {
            path: 'conditions/:conditionId?',
            name: `${CrmSections.ContactGroups}-conditions`,
            component: OpenedContactGroupsConditions,
          },
          {
            path: 'contacts/:contactId?',
            name: `${CrmSections.ContactGroups}-contacts`,
            component: OpenedContactGroupsContacts,
          },
          {
            path: 'permissions/:permissionId?',
            name: `${CrmSections.ContactGroups}-permissions`,
            component: PermissionsTab,
          },
        ],
      },
      {
        path: 'priorities',
        name: CrmSections.Priorities,
        component: ThePriorities,
        meta: {
          WtObject: WtObject.Priorities,
          UiSection: CrmSections.Priorities,
        },
      },
      {
        path: 'priorities/:id',
        name: `${CrmSections.Priorities}-card`,
        component: OpenedPriority,
        redirect: { name: `${CrmSections.Priorities}-general` },
        meta: {
          WtObject: WtObject.Priorities,
          UiSection: CrmSections.Priorities,
        },
        children: [
          {
            path: 'general',
            name: `${CrmSections.Priorities}-general`,
            component: OpenedPriorityGeneral,
          },
        ],
      },
      {
        path: 'statuses',
        name: CrmSections.Statuses,
        component: TheStatuses,
        meta: {
          WtObject: WtObject.Status,
          UiSection: CrmSections.Statuses,
        },
      },
      {
        path: 'statuses/:id',
        name: `${CrmSections.Statuses}-card`,
        component: OpenedStatus,
        redirect: { name: `${CrmSections.Statuses}-general` },
        meta: {
          WtObject: WtObject.Status,
          UiSection: CrmSections.Statuses,
        },
        children: [
          {
            path: 'general',
            name: `${CrmSections.Statuses}-general`,
            component: OpenedStatusGeneral,
          },
          {
            path: 'status-conditions/:statusConditionId?',
            name: `status-conditions`,
            component: OpenedStatusConditions,
          },
        ],
      },
      {
        path: ':repo',
        name: 'custom-lookup',
        component: TheCustomLookup,
        meta: {
          WtObject: WtObject.CustomLookup,
          UiSection: (thisRoute: RouteLocationNormalized) => {
            return thisRoute.params.repo;
          },
        },
      },
      {
        path: ':repo/:id',
        name: 'custom-lookup-record',
        component: OpenedCustomLookupRecord,
        redirect: { name: 'custom-lookup-record-columns' },
        children: [
          {
            path: 'columns',
            name: 'custom-lookup-record-columns',
            component: OpenedCustomLookupRecordsColumns,
          },
        ],
      },
    ],
  },
];

export default lookupsRoutes;
