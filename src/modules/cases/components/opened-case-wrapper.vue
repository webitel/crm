<template>
  <opened-case />
</template>

<script lang="ts" setup>
import { provide } from 'vue';

import OpenedCase from './opened-case.vue';

provide('isReadOnly', true);
</script>

<style lang="scss" scoped>
</style>
