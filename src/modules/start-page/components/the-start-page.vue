<template>
  <wt-start-page :nav="nav" :app-logo="logo" :dark-mode="darkMode" />
</template>

<script setup>
import { WtStartPage } from '@webitel/ui-sdk/components';
import { storeToRefs } from 'pinia';

import { useAppearanceStore } from '../../appearance/store/appearanceStore';
import LogoDark from '../assets/crm-logo-dark.svg';
import LogoLight from '../assets/crm-logo-light.svg';
import { useNavStore } from '../stores/navStore';

const appearanceStore = useAppearanceStore();
const { darkMode } = storeToRefs(appearanceStore);

const navStore = useNavStore();
const { initializeNav } = navStore;
const { nav } = storeToRefs(navStore);

const logo = {
	light: LogoLight,
	dark: LogoDark,
};

// Initialize nav, if not initialized yet
initializeNav();
</script>

<style scoped></style>
