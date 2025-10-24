<template>
  <wt-error-page
    type="404"
    @back="router.replace('/start-page')"
  />
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

