<template>
  <wt-navigation-menu
    :nav="nav"
    :icons="icons"
  />
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { computed, reactive } from 'vue';
import lookupsIcon from '../../../app/assets/icons/sprite/crm-lookups.svg';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum.js';

const { t } = useI18n();

const icons = [lookupsIcon];

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
        value: CrmSections.CLOSE_REASON_GROUPS,
        name: computed(() => t('lookups.closeReasonGroups.closeReasonGroups', 2)),
        route: 'lookups/close-reason-groups',
      },
    ],
  },
]);
</script>

<style lang="scss" scoped>
</style>
