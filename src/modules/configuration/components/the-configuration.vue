<template>
  <wt-navigation-menu
    :nav="nav"
    :icons="icons"/>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import lookupsIcon from '../../../app/assets/icons/sprite/crm-lookups.svg';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum.js';

const { t } = useI18n();

const icons = [lookupsIcon];

const nav = [
  {
    value: 'lookups',
    name: t('lookups.lookups'),
    subNav: [
      {
        value: CrmSections.SOURCES,
        name: t('lookups.sources.sources', 2),
        route: 'lookups/sources',
      },
      {
        value: CrmSections.SLAS,
        name: t('lookups.slas.slas', 2),
        route: 'lookups/slas',
      },
      {
        value: CrmSections.SERVICE_CATALOGS,
        name: t('lookups.serviceCatalogs.serviceCatalogs', 2),
        route: 'lookups/service-catalogs',
      },
    ],
  },
];
</script>

<style lang="scss" scoped>
</style>
