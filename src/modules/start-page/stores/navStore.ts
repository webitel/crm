import { CrmSections, WtObject } from '@webitel/ui-sdk/enums';
import { defineStore } from 'pinia';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { useUserAccessControl } from '../../../app/composables/useUserAccessControl';
import { useConfigurationStore } from '../../configuration/store/configurationStore';
import { useUserinfoStore } from '../../userinfo/store/userinfoStore';
import CasesDark from '../assets/cases-section-dark.svg';
import CasesLight from '../assets/cases-section-light.svg';
import ConfigurationImgDark from '../assets/configuration-section-img-dark.svg';
import ConfigurationImgLight from '../assets/configuration-section-img-light.svg';
import ContactsImgDark from '../assets/contacts-section-img-dark.svg';
import ContactsImgLight from '../assets/contacts-section-img-light.svg';
import { StartPageNavigation } from '../types/start-page.types';

export const useNavStore = defineStore('nav', () => {
    const { t } = useI18n();
    const router = useRouter();

    const { routeAccessGuard } = useUserinfoStore();
    const configurationStore = useConfigurationStore();
    const { hasAnyConfigurationAccess } = storeToRefs(configurationStore);
    const { initializeConfiguration } = configurationStore;

    const { hasReadAccess: hasCaseReadAccess } = useUserAccessControl({
      resource: WtObject.Case,
    });

    const isInitialized = ref(false);

    const nav = computed(() => {
        const contactsRoutePath = '/contacts';
        const contactsRoute = router.resolve({ path: contactsRoutePath });
        const hasContactsAccess = routeAccessGuard(contactsRoute) === true;

        const casesRoutePath = '/cases';
        const casesRoute = router.resolve({ path: casesRoutePath });
        const hasCasesAccess = routeAccessGuard(casesRoute) === true;

      const navigation: StartPageNavigation[] = [
        {
          value: CrmSections.Contacts,
          route: contactsRoutePath,
          name: t(`startPage.${CrmSections.Contacts}.name`),
          text: t(`startPage.${CrmSections.Contacts}.text`),
          disabled: !hasContactsAccess,
          images: {
            light: ContactsImgLight,
            dark: ContactsImgDark,
          },
        },
        {
          value: 'configuration',
          route: '/configuration',
          name: t(`startPage.configuration.name`),
          text: t(`startPage.configuration.text`),
          disabled: !hasAnyConfigurationAccess.value || !hasCaseReadAccess.value,
          images: {
            light: ConfigurationImgLight,
            dark: ConfigurationImgDark,
          },
        },
        {
          value: CrmSections.Cases,
          route: casesRoutePath,
          name: t(`startPage.${CrmSections.Cases}.name`),
          text: t(`startPage.${CrmSections.Cases}.text`),
          disabled: !hasCasesAccess || !hasCaseReadAccess.value,
          images: {
            light: CasesLight,
            dark: CasesDark,
          }
        }
      ]

      return navigation;
    });

    const initializeNav = async () => {
        if (isInitialized.value) {
            return;
        }

        try {
            await initializeConfiguration();
        } finally {
            isInitialized.value = true;
        }
    };

    return { nav, initializeNav };
});
