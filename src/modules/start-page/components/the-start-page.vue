<template>
  <wt-start-page
    :nav="nav"
    :app-logo="logo"
    :dark-mode="darkMode"
  />
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum';
import WtStartPage from '@webitel/ui-sdk/src/components/on-demand/wt-start-page/components/wt-start-page.vue';
import LogoLight from '../assets/crm-logo-light.svg';
import LogoDark from '../assets/crm-logo-dark.svg';
import ConfigurationImgLight from '../assets/configuration-section-img-light.svg';
import ConfigurationImgDark from '../assets/configuration-section-img-dark.svg';
import ContactsImgLight from '../assets/contacts-section-img-light.svg';
import ContactsImgDark from '../assets/contacts-section-img-dark.svg';
import CasesLight from '../assets/cases-section-light.svg';
import CasesDark from '../assets/cases-section-dark.svg';

const { t } = useI18n();
const store = useStore();

const darkMode = computed(() => store.getters['appearance/DARK_MODE']);

const logo = {
  light: LogoLight,
  dark: LogoDark,
};

const nav = [
  {
    value: CrmSections.CONTACTS,
    route: '/contacts',
    name: t(`startPage.${CrmSections.CONTACTS}.name`),
    text: t(`startPage.${CrmSections.CONTACTS}.text`),
    images: {
      light: ContactsImgLight,
      dark: ContactsImgDark,
    },
  },
  {
    value: CrmSections.CASES,
    route: '/cases',
    name: t(`startPage.${CrmSections.CASES}.name`),
    text: t(`startPage.${CrmSections.CASES}.text`),
    images: {
      light: CasesLight,
      dark: CasesDark,
    },
  },
  {
    value: 'configuration',
    route: '/configuration',
    name: t(`startPage.configuration.name`),
    text: t(`startPage.configuration.text`),
    images: {
      light: ConfigurationImgLight,
      dark: ConfigurationImgDark,
    },
  },
];
</script>

<style scoped>
</style>
