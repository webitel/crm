<template>
  <wt-notifications-bar />
  <router-view />
</template>

<script lang="ts" setup>
import { computed, onMounted, provide } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { useUserinfoStore } from './modules/userinfo/store/userinfoStore';
import { WtNotificationsBar } from '@webitel/ui-sdk/components';

const { locale, fallbackLocale } = useI18n();
const { showUserNotifications } = useUserinfoStore();

const store = useStore();

const darkMode = computed(() => store.getters['appearance/DARK_MODE']);

provide('darkMode', darkMode);

function setLanguage() {
	const lang = localStorage.getItem('lang');
	if (lang) locale.value = lang;
	const fallbackLang = localStorage.getItem('fallbackLang');
	if (fallbackLang && fallbackLocale) fallbackLocale.value = fallbackLang;
}

onMounted(() => {
	setLanguage();
	showUserNotifications();
});
</script>

<style lang="scss">
#app {
  min-width: 100%;
  min-height: 100%;
}
</style>
