<template>
  <opened-contact />
</template>

<script setup lang="ts">
import { provide } from 'vue';

import OpenedContact from './opened-contact.vue';

provide('isReadOnly', true);
</script>


<style scoped lang="scss">

</style>
