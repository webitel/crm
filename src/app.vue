<template>
  <router-view />
</template>

<script lang="ts" setup>
import { computed, onMounted, provide } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from 'vuex';

const { locale, fallbackLocale } = useI18n();

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
});
</script>

<style lang="scss">
#app {
  min-width: 100%;
  min-height: 100%;
}
</style>
