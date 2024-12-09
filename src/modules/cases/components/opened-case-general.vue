<template>
  <article class="opened-case-general">
    <case-priority
      :namespace="namespace"
    />
    <case-service
      :namespace="namespace"
    />
  </article>
</template>

<script setup>
import CasePriority from '../modules/priority/components/case-priority.vue';
import CaseService from '../modules/service/components/case-service.vue';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

</script>
<style lang="scss" scoped>
.opened-case-general {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}
</style>
