<template>
  <router-view />
</template>

<script lang="ts" setup>
import {onMounted, provide, computed} from "vue";
import {useI18n} from "vue-i18n";
import { useStore } from 'vuex';

const { locale } = useI18n();

window.usei = useI18n();

const store = useStore();

const darkMode = computed(() => store.getters['appearance/DARK_MODE']);

provide('darkMode', darkMode);

function setLanguage() {
  const lang = localStorage.getItem('lang');
  if (lang) locale.value = lang;
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
