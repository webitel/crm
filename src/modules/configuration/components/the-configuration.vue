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
        name: t('lookups.sources'),
        route: 'lookups/sources',
      },
      {
        value: CrmSections.SLAS,
        name: t('lookups.slas.slas', 2),
        route: 'lookups/slas',
      },
    ],
  },
];
</script>

<style lang="scss" scoped>
</style>
