<template>
  <the-emails
    :namespace="namespace"
  ></the-emails>
</template>

<script setup>
import TheEmails from '../modules/emails/components/the-emails.vue';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});
</script>

<style lang="scss" scoped>

</style>
