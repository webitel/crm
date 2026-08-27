<template>
  <wt-start-page :nav="nav" :app-logo="logo" :dark-mode="darkMode" />
</template>

<script setup>
import { WtStartPage } from '@webitel/ui-sdk/components';
import { storeToRefs } from 'pinia';
import { inject } from 'vue';

import LogoDark from '../assets/crm-logo-dark.svg';
import LogoLight from '../assets/crm-logo-light.svg';
import { useNavStore } from '../stores/navStore';

const navStore = useNavStore();

const darkMode = inject('darkMode');

const logo = {
	light: LogoLight,
	dark: LogoDark,
};

// Initialize nav, if not initialized yet
navStore.initializeNav();

const { nav } = storeToRefs(navStore);
</script>

<style scoped></style>
