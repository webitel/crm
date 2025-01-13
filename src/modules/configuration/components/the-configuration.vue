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
        value: CrmSections.PRIORITIES,
        name: computed(() => t('lookups.priorities.priorities', 2)),
        route: 'lookups/priorities',
      },
    ],
  },
]);
</script>

<style lang="scss" scoped>
</style>
