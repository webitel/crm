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

<script>
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum';
import { mapState } from 'vuex';
import StartPageCard from './start-page-card.vue';
import StartPageLogo from './start-page-logo.vue';

import ContactsSecLight from '../assets/contacts-section-light.svg';
import ContactsSecDark from '../assets/contacts-section-dark.svg';

import ConfigurationSecLight from '../assets/configuration-section-light.svg';
import ConfigurationSecDark from '../assets/configuration-section-dark.svg';

import navMixin from '../../../app/mixins/crm-start-page/navMixin';

export default {
  name: 'the-start-page',
  mixins: [navMixin],
  components: { StartPageCard, StartPageLogo },
  computed: {
    ...mapState('appearance', {
      theme: (state) => state.theme,
    }),
    logo() {
      return  this.theme === 'dark' ? {src: '/crm/src/modules/start-page/assets/start-page-logo-dark.svg', alt: 'image alt'}
      : {src: '/crm/src/modules/start-page/assets/start-page-logo-light.svg', alt: 'image alt'}
    },
    navCards() {
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
      return this.nav.map((navItem) => ({
          ...navItem,
          // disabled: !this.checkNavAccess({ name: navItem.value, scopeClass: navItem.class }),
          disabled: false,
          name: this.$t(`startPage.${navItem.value}.name`),
          text: this.$t(`startPage.${navItem.value}.text`),
          image: this.theme === 'dark' ? cardSectionPic[navItem.value].dark : cardSectionPic[navItem.value].light,
        }));
    },
  },
};
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
