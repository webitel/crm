import { CrmSections } from '@webitel/ui-sdk/enums';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import CustomLookupsApi from '../../customization/modules/custom-lookups/api/custom-lookups.js';
import { useUserinfoStore } from '../../userinfo/store/userinfoStore';

// Pinia
export const useConfigurationStore = defineStore('configuration', () => {
  const { t } = useI18n();
  const router = useRouter();

  const { routeAccessGuard } = useUserinfoStore();

  const isCustomLookupsLoaded = ref(false);
  const customLookups = ref([]);

  const navAccessReducer = (reducedNav, currentNav) => {
    if (currentNav.subNav) {
      currentNav.subNav = currentNav.subNav.reduce(navAccessReducer, []);
    }

    if (currentNav.subNav?.length === 0) {
      return reducedNav;
    }

    const route = router.resolve({ path: currentNav.route });
    return routeAccessGuard(route) === true
      ? [...reducedNav, currentNav]
      : reducedNav;
  };

  const nav = computed(() => {
    const customLookupsNav = customLookups.value.map((item) => ({
      value: item.repo,
      name: item.name,
      route: `configuration/lookups/${item.repo}`,
    }));

    return [
      {
        value: 'lookups',
        name: t('lookups.lookups'),
        subNav: [
          {
            value: CrmSections.ContactGroups,
            name: t('lookups.contactGroups.contactGroups', 2),
            route: 'lookups/contact-groups',
          },
          {
            value: CrmSections.Priorities,
            name: t('vocabulary.priority', 2),
            route: 'lookups/priorities',
          },
          {
            value: CrmSections.CloseReasonGroups,
            name: t('lookups.closeReasonGroups.closeReasonGroups', 2),
            route: 'lookups/close-reason-groups',
          },
          {
            value: CrmSections.Statuses,
            name: t(`lookups.statuses.statuses`, 2),
            route: 'lookups/statuses',
          },
          {
            value: CrmSections.Sources,
            name: t('lookups.sources.sources', 2),
            route: 'lookups/sources',
          },
          {
            value: CrmSections.Slas,
            name: t('lookups.slas.slas', 2),
            route: 'lookups/slas',
          },
          {
            value: CrmSections.ServiceCatalogs,
            name: t('lookups.serviceCatalogs.serviceCatalogs', 2),
            route: 'lookups/service-catalogs',
          },
          ...customLookupsNav,
        ],
      },
      {
        value: 'customization',
        name: t('objects.customization.customization'),
        subNav: [
          {
            value: CrmSections.CasesExtensions,
            name: t('customization.extensions.cases'),
            route: 'customization/types-extensions/cases',
          },
          {
            value: CrmSections.ContactsExtensions,
            name: t('customization.extensions.contacts'),
            route: 'customization/types-extensions/contacts',
          },
          {
            value: CrmSections.CustomLookups,
            name: t('objects.customLookup.customLookup', 2),
            route: 'customization/custom-lookups',
          },
        ],
      },
    ];
  });

  const accessibleNav = computed(() => {
    return nav.value.reduce(navAccessReducer, []);
  });

  const hasAnyConfigurationAccess = computed(() => {
    return isCustomLookupsLoaded.value && accessibleNav.value.length > 0;
  });

  const loadCustomLookups = async () => {
    if (isCustomLookupsLoaded.value) return; // already loaded

    try {
      const { items } = await CustomLookupsApi.getList({
        size: -1,
      });

      customLookups.value = items;
    } finally {
      isCustomLookupsLoaded.value = true;
    }
  };

  const initializeConfiguration = () => {
    return loadCustomLookups();
  };

  return {
    isCustomLookupsLoaded,
    customLookups,
    nav,
    accessibleNav,
    hasAnyConfigurationAccess,
    loadCustomLookups,
    initializeConfiguration,
  };
});
