<template>
  <wt-navigation-menu
    :nav="nav"
    :icons="icons"
  />
</template>

<script setup>
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum.js';
import { computed, reactive } from 'vue';
import { useI18n } from 'vue-i18n';

import customizationIcon from '../../../app/assets/icons/sprite/crm-customization.svg';
import lookupsIcon from '../../../app/assets/icons/sprite/crm-lookups.svg';

const { t } = useI18n();

const icons = [lookupsIcon, customizationIcon];

const nav = reactive([
  {
    value: 'lookups',
    name: computed(() => t('lookups.lookups')),
    subNav: [
      {
        value: CrmSections.SOURCES,
        name: computed(() => t('lookups.sources.sources', 2)),
        route: 'lookups/sources',
      },
      {
        value: CrmSections.SLAS,
        name: computed(() => t('lookups.slas.slas', 2)),
        route: 'lookups/slas',
      },
      {
        value: CrmSections.CONTACT_GROUPS,
        name: computed(() => t('lookups.contactGroups.contactGroups', 2)),
        route: 'lookups/contact-groups',
      },
      {
        value: CrmSections.PRIORITIES,
        name: computed(() => t('vocabulary.priority', 2)),
        route: 'lookups/priorities',
      },
      {
        value: CrmSections.CLOSE_REASON_GROUPS,
        name: computed(() =>
          t('lookups.closeReasonGroups.closeReasonGroups', 2),
        ),
        route: 'lookups/close-reason-groups',
      },
      {
        value: CrmSections.SERVICE_CATALOGS,
        name: computed(() => t('lookups.serviceCatalogs.serviceCatalogs', 2)),
        route: 'lookups/service-catalogs',
      },
      {
        value: CrmSections.STATUSES,
        name: computed(() => t(`lookups.statuses.statuses`, 2)),
        route: 'lookups/statuses',
      },
    ],
  },
  {
    value: 'customization',
    name: computed(() => t('customization.customization')),
    subNav: [
      {
        value: CrmSections.CUSTOM_LOOKUPS,
        name: computed(() => t('customization.customLookups.customLookups')),
        route: 'customization/custom-lookups',
      },
    ],
  },
]);
</script>

<style lang="scss" scoped></style>
