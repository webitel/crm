import { CrmSections, WtObject } from '@webitel/ui-sdk/enums';
import PermissionsTab from '@webitel/ui-sdk/src/modules/ObjectPermissions/components/permissions-tab.vue';
import { type RouteRecordRaw } from 'vue-router';

import OpenedCase from '../components/opened-case.vue';
import OpenedCaseWrapper from '../components/opened-case-wrapper.vue';
import TheCases from '../components/the-cases.vue';
import CaseAttachments from '../modules/attachments/components/case-attachments.vue';
import CaseInfo from '../modules/case-info/components/case-info.vue';
import CaseDetails from '../modules/details/component/case-details.vue';
import CaseResult from '../modules/result/components/case-result.vue';
import CaseTimeline from '../modules/timeline/components/case-timeline.vue';

const casesChildrenRoutes: RouteRecordRaw[] = [
  {
    path: 'case-info',
    name: `${CrmSections.Cases}-case-info`,
    component: CaseInfo,
  },
  {
    path: 'result',
    name: `${CrmSections.Cases}-result`,
    component: CaseResult,
  },
  {
    path: 'attachments',
    name: `${CrmSections.Cases}-attachments`,
    component: CaseAttachments,
  },
  {
    path: 'details',
    name: `${CrmSections.Cases}-details`,
    component: CaseDetails,
  },
  {
    path: 'timeline',
    name: `${CrmSections.Cases}-timeline`,
    component: CaseTimeline,
  },
  {
    path: 'permissions/:permissionId?',
    name: `${CrmSections.Cases}-permissions`,
    component: PermissionsTab,
  },
];

const casesRoutes: RouteRecordRaw[] = [
  {
    path: 'cases',
    name: CrmSections.Cases,
    component: TheCases,
    meta: {
      WtObject: WtObject.Case,
      UiSection: CrmSections.Cases,
    },
  },
  {
    path: 'cases/:id',
    name: `${CrmSections.Cases}-card`,
    component: OpenedCase,
    redirect: { name: `${CrmSections.Cases}-case-info` },
    meta: {
      WtObject: WtObject.Case,
      UiSection: CrmSections.Cases,
    },
    children: casesChildrenRoutes,
  },
  {
    path: 'case_view/:id',
    name: `${CrmSections.Cases}-card-view`,
    component: OpenedCaseWrapper,
    redirect: { name: `${CrmSections.Cases}-case-info` },
    meta: {
      WtObject: WtObject.Case,
      UiSection: CrmSections.Cases,
    },
    children: casesChildrenRoutes,
  },
];

export default casesRoutes;
