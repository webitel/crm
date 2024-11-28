<template>
  <case-service-popup @save="addServiceToStore" />
  <div class="case-service">
    <div class="case-service__text-wrapper">
      <span class="case-service__title">{{ t('cases.service') }}</span>
      <span class="case-service__path">{{ caseService }}</span>
    </div>
    <wt-button color="success">
      {{ t('cases.selectAService') }}
    </wt-button>
  </div>

</template>
<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import CaseServicePopup from './case-service-popup.vue';

const { t } = useI18n();

const store = useStore();

const caseService = computed(() => store.state.cases.caseService.caseService);

function addServiceToStore(service) {
  console.log(service);
}

</script>

<style lang="scss" scoped>
.case-service {
  display: flex;
  flex-direction: column;
  width: fit-content;
  gap: var(--spacing-sm);

  &__text-wrapper {
    display: flex;
    flex-direction: column;
  }

  &__title, &__path {
    padding: var(--spacing-2xs);
  }

  &__path {
    @extend %typo-body-1;
  }

  &__title {
    @extend %typo-heading-4;
  }
}
</style>
