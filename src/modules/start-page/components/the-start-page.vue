<template>
  <start-page-logo :image="logo"/>
  <div class="start-page-wrapper">
    <start-page-card
      v-for="(card) of navCards"
      :key="card.value"
      :card="card"
    />
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useStore } from 'vuex';
  import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum';
  import StartPageCard from './start-page-card.vue';
  import StartPageLogo from './start-page-logo.vue';
  import ContactsSecLight from '../assets/contacts-section-light.svg';
  import ContactsSecDark from '../assets/contacts-section-dark.svg';
  import ConfigurationSecLight from '../assets/configuration-section-light.svg';
  import ConfigurationSecDark from '../assets/configuration-section-dark.svg';

  // Vuex store access
  const store = useStore();

  const { t } = useI18n();

  // Отримання теми з Vuex
  const theme = computed(() => store.state.appearance.theme);

  // Логіка для логотипу
  const logo = computed(() => {
    return theme.value === 'dark'
      ? { src: '/crm/src/modules/start-page/assets/start-page-logo-dark.svg', alt: 'image alt' }
      : { src: '/crm/src/modules/start-page/assets/start-page-logo-light.svg', alt: 'image alt' };
  });

  // дані з navMixin
  const nav = ref([
    {
      value: CrmSections.CONTACTS,
      route: '/contacts',
      class: 'cc_contacts',
    },
    {
      value: CrmSections.CONFIGURATION,
      route: '/configuration',
      class: 'cc_configuration',
      name: 'configuration',
    },
  ]);

  // Створення карток для відображення
  const cardSectionPic = {
    [CrmSections.CONTACTS]: {
      dark: ContactsSecDark,
      light: ContactsSecLight,
    },
    [CrmSections.CONFIGURATION]: {
      dark: ConfigurationSecDark,
      light: ConfigurationSecLight,
    },
  };

  const navCards = computed(() => {
    return nav.value.map((navItem) => ({
      ...navItem,
      disabled: false, // Статус доступу до навігаційних карток
      name: t(`startPage.${navItem.value}.name`),
      text: t(`startPage.${navItem.value}.text`),
      image: theme.value === 'dark' ? cardSectionPic[navItem.value].dark : cardSectionPic[navItem.value].light,
    }));
  });
</script>

<style scoped>
.start-page-wrapper {
  box-sizing: border-box;
  min-width: 264px;
  display: grid;
  grid-template-columns: repeat(auto-fit, 264px);
  justify-content: center;
  grid-gap: var(--spacing-sm);
  padding: var(--spacing-sm);
}
</style>
