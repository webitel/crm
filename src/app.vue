<template>
  <wt-notifications-bar />
  <router-view />
</template>

<script lang="ts" setup>
import { WtNotificationsBar } from '@webitel/ui-sdk/components';
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUserinfoStore } from './modules/userinfo/store/userinfoStore';

const { locale, fallbackLocale } = useI18n();
const { showUserNotifications } = useUserinfoStore();

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
