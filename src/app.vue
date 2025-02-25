<template>
  <router-view />
</template>

<script lang="ts" setup>
import {onMounted} from "vue";
import {useI18n} from "vue-i18n";

const { locale } = useI18n();

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
