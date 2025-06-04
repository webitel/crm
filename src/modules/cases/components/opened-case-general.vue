<template>
  <article class="opened-case-general">
    <case-status />
    <case-number v-if="!isNew"/>
    <case-priority />
    <case-service />
    <case-deadlines />
    <case-persons />
    <case-sla />
  </article>
</template>

<script setup>
import CaseDeadlines from '../modules/deadlines/components/case-deadline-list.vue';
import CasePersons from '../modules/persons/components/case-persons.vue';
import CasePriority from '../modules/priority/components/case-priority.vue';
import CaseService from '../modules/service/components/case-service.vue';
import CaseSla from '../modules/sla/components/case-sla.vue';
import CaseStatus from '../modules/status/components/case-status.vue';
import CaseNumber from '../modules/case-number/components/case-number.vue';

const props = defineProps({
  isNew: {
    type: Boolean,
    default: false,
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
