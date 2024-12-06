<template>
  <article class="opened-case-general">
    <case-service
      :namespace="namespace"
    />
  </article>
</template>

<script setup>
import CaseService from '../modules/service/components/case-service.vue';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

</script>
