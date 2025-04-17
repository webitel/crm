import { CrmSections, WtObject } from '@webitel/ui-sdk/enums';
import PermissionsTab from '@webitel/ui-sdk/src/modules/ObjectPermissions/components/permissions-tab.vue';
import { type RouteRecordRaw } from 'vue-router';

import OpenedCaseWrapper from '../components/opened-case-wrapper.vue';
import CaseAttachments from '../modules/attachments/components/case-attachments.vue';
import CaseInfo from '../modules/case-info/components/case-info.vue';
import CaseDetails from '../modules/details/component/case-details.vue';
import CaseResult from '../modules/result/components/case-result.vue';
import CaseTimeline from '../modules/timeline/components/case-timeline.vue';

const CASE_VIEW_NAME = 'case_view';

const casesChildrenRoutes: RouteRecordRaw[] = [
  {
    path: 'case-info',
    name: `${CASE_VIEW_NAME}-case-info`,
    component: CaseInfo,
  },
  {
    path: 'result',
    name: `${CASE_VIEW_NAME}-result`,
    component: CaseResult,
  },
  {
    path: 'attachments',
    name: `${CASE_VIEW_NAME}-attachments`,
    component: CaseAttachments,
  },
  {
    path: 'details',
    name: `${CASE_VIEW_NAME}-details`,
    component: CaseDetails,
  },
  {
    path: 'timeline',
    name: `${CASE_VIEW_NAME}-timeline`,
    component: CaseTimeline,
  },
  {
    path: 'permissions/:permissionId?',
    name: `${CASE_VIEW_NAME}-permissions`,
    component: PermissionsTab,
  },
];

const caseViewRoute: RouteRecordRaw = {
  path: 'case_view/:id',
  name: `${CASE_VIEW_NAME}-card-view`,
  component: OpenedCaseWrapper,
  redirect: { name: `${CASE_VIEW_NAME}-case-info` },
  meta: {
    WtObject: WtObject.Case,
    UiSection: CrmSections.Cases,
  },
  children: casesChildrenRoutes,
};

export default caseViewRoute;
