<template>
  <wt-navigation-menu
    :nav="accessibleNav"
    :icons="icons"
  />
</template>

<script setup>
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum.js';
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { WtNavigationMenu } from '@webitel/ui-sdk/components';

import customizationIcon from '../../../app/assets/icons/sprite/crm-customization.svg';
import lookupsIcon from '../../../app/assets/icons/sprite/crm-lookups.svg';
import CustomLookupsApi from '../../customization/modules/custom-lookups/api/custom-lookups.js';
import { useUserinfoStore } from '../../userinfo/store/userinfoStore';

const { t } = useI18n();
const router = useRouter();

const { routeAccessGuard } = useUserinfoStore();

const icons = [lookupsIcon, customizationIcon];
const customLookups = ref([]);

const navAccessReducer = (reducedNav, currentNav) => {
  if (currentNav.subNav) {
    currentNav.subNav = currentNav.subNav.reduce(navAccessReducer, []);
  }
  const route = router.resolve({ path: currentNav.route });
  return routeAccessGuard(route) === true ? [...reducedNav, currentNav] : reducedNav;
};

const nav = computed(() => {
  const customLookupsNav = customLookups.value.map((item) => ({
      value: item.repo,
      name: item.name,
      route: `lookups/${item.repo}`,
    }));

  return [
  {
    value: 'lookups',
    name: t('lookups.lookups'),
    subNav: [
      {
        value: CrmSections.CONTACT_GROUPS,
        name: t('lookups.contactGroups.contactGroups', 2),
        route: 'lookups/contact-groups',
      },
      {
        value: CrmSections.PRIORITIES,
        name: t('vocabulary.priority', 2),
        route: 'lookups/priorities',
      },
      {
        value: CrmSections.CLOSE_REASON_GROUPS,
        name: t('lookups.closeReasonGroups.closeReasonGroups', 2),
        route: 'lookups/close-reason-groups',
      },
      {
        value: CrmSections.STATUSES,
        name: t(`lookups.statuses.statuses`, 2),
        route: 'lookups/statuses',
      },
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
      ...customLookupsNav,
    ],
  },
  {
    value: 'customization',
    name: t('customization.customization'),
    subNav: [
      {
        value: 'type-extension-cases',
        name: t('customization.extensions.cases'),
        route: 'customization/types-extensions/cases',
      },
      {
        value: 'type-extension-contact',
        name: t('customization.extensions.contacts'),
        route: 'customization/types-extensions/contacts',
      },
      {
        value: CrmSections.CUSTOM_LOOKUPS,
        name: t('customization.customLookups.customLookups'),
        route: 'customization/custom-lookups',
      },
    ],
    },
  ];
});

const accessibleNav = computed(() => {
  return nav.value.reduce(navAccessReducer, []);
});

const loadCustomLookups = async () => {
    const { items } = await CustomLookupsApi.getList({
      size: -1,
    });

    customLookups.value = items;
};

loadCustomLookups();
</script>

<style lang="scss" scoped></style>
