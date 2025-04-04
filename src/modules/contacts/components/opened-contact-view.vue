<template>
  <opened-contact />
</template>

<script setup lang="ts">
import {computed, provide} from "vue";

import OpenedContact from "./opened-contact.vue";

const isReadOnly = computed(() => true);
provide('isReadOnly', isReadOnly);
</script>


<style scoped lang="scss">

</style>
