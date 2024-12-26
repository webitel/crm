<template>
  <article class="opened-case-general">
    <case-status
      :namespace="namespace"
    />
    <case-priority
      :namespace="namespace"
    />
    <case-deadlines
      :namespace="namespace"
    />
    <case-service
      :namespace="namespace"
    />
    <case-persons
      :namespace="namespace"
    />
    <case-sla
      :namespace="namespace"
    />
  </article>
</template>

<script setup>
import CaseDeadlines from '../modules/deadlines/components/case-deadline-list.vue';
import CasePersons from '../modules/persons/components/case-persons.vue';
import CasePriority from '../modules/priority/components/case-priority.vue';
import CaseService from '../modules/service/components/case-service.vue';
import CaseSla from '../modules/sla/components/case-sla.vue';
import CaseStatus from '../modules/status/components/case-status.vue';

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
