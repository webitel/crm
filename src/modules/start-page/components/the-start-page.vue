<template>
  <div>
    <start-page :nav="nav" :appLogo="logo"/>
  </div>
</template>

<script setup>
  import { useI18n } from 'vue-i18n';
  import StartPage from '@webitel/ui-sdk/src/modules/StartPage/components/the-start-page.vue';
  import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum';
  import StartLogoLight from '../assets/start-page-logo-light.svg';
  import StartLogoDark from '../assets/start-page-logo-dark.svg';
  import CasesLight from '../assets/cases-section-light.svg';
  import CasesDark from '../assets/cases-section-dark.svg';
  import ConfigurationLight from '../assets/configuration-section-light.svg';
  import ConfigurationDark from '../assets/configuration-section-dark.svg';
  import ContactsLight from '../assets/contacts-section-light.svg';
  import ContactsDark from '../assets/contacts-section-dark.svg';

  const { t } = useI18n();

  const logo = {
    light: StartLogoLight,
    dark: StartLogoDark
  }

  const nav = [
    {
      value: CrmSections.CONTACTS,
      route: '/contacts',
      name: t(`startPage.${CrmSections.CONTACTS}.name`),
      text: t(`startPage.${CrmSections.CONTACTS}.text`),
      images: {
        light: ContactsLight,
        dark: ContactsDark,
      },
      disabled: false
    },
    {
      value: CrmSections.CONFIGURATION,
      route: '/configuration',
      name: t(`startPage.${CrmSections.CONFIGURATION}.name`),
      text: t(`startPage.${CrmSections.CONFIGURATION}.text`),
      images: {
        light: ConfigurationLight,
        dark: ConfigurationDark,
      },
      disabled: false
    },
    // TODO: Use CrmSections.CASES instead of 'cases'
    {
      value: 'cases',
      route: '/cases',
      name: t(`startPage.cases.name`),
      text: t(`startPage.cases.text`),
      images: {
        light: CasesLight,
        dark: CasesDark,
      },
      disabled: false
    },
  ]
</script>

<style scoped>
</style>
