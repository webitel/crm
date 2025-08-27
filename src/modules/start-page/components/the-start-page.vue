<template>
  <wt-start-page :nav="nav" :app-logo="logo" :dark-mode="darkMode" />
</template>

<script setup>
import { WtStartPage } from '@webitel/ui-sdk/components';
import { computed } from 'vue';
import { useStore } from 'vuex';
import { storeToRefs } from 'pinia';

import LogoDark from '../assets/crm-logo-dark.svg';
import LogoLight from '../assets/crm-logo-light.svg';
import { useNavStore } from '../stores/navStore';

const store = useStore();
const navStore = useNavStore();

const darkMode = computed(() => store.getters['appearance/DARK_MODE']);

const logo = {
  light: LogoLight,
  dark: LogoDark,
};

// Initialize nav, if not initialized yet
navStore.initializeNav();

const { nav } = storeToRefs(navStore);
</script>

<style scoped></style>
