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
import CustomLookupsApi from '../../customization/modules/custom-lookups/api/custom-lookups.js';

const { t } = useI18n();

const icons = [lookupsIcon, customizationIcon];

const nav = reactive([
  {
    value: 'lookups',
    name: computed(() => t('lookups.lookups')),
    subNav: [
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
        value: CrmSections.STATUSES,
        name: computed(() => t(`lookups.statuses.statuses`, 2)),
        route: 'lookups/statuses',
      },
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
        value: CrmSections.SERVICE_CATALOGS,
        name: computed(() => t('lookups.serviceCatalogs.serviceCatalogs', 2)),
        route: 'lookups/service-catalogs',
      },
    ],
  },
  {
    value: 'customization',
    name: computed(() => t('customization.customization')),
    subNav: [
      {
        value: 'type-extension-cases',
        name: computed(() => t('customization.extensions.cases')),
        route: 'customization/types-extensions/cases',
      },
      {
        value: 'type-extension-contact',
        name: computed(() => t('customization.extensions.contacts')),
        route: 'customization/types-extensions/contacts',
      },
      {
        value: CrmSections.CUSTOM_LOOKUPS,
        name: computed(() => t('customization.customLookups.customLookups')),
        route: 'customization/custom-lookups',
      },
    ],
  },
]);

const loadCustomLookups = async () => {
  try {
    const { items } = await CustomLookupsApi.getList({
      size: -1,
    });

    const formatedNav = items.map((item) => ({
      value: item.id,
      name: item.name,
      route: `lookups/${item.repo}`,
    }));

    nav[0].subNav.push(...formatedNav);
  } catch (error) {
    console.error(error);
  }
};

loadCustomLookups();
</script>

<style lang="scss" scoped></style>
