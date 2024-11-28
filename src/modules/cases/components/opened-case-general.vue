<template>
  <article class="opened-case-general">
    <div class="service">
      <div class="service__text-wrapper">
        <span class="service__title">{{ t('cases.service') }}</span>
        <span class="service__path">123</span>
      </div>
      <wt-button color="success">
        {{ t('cases.selectAService') }}
      </wt-button>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const editMode = computed(() => route.query.edit === 'true');

</script>


<style lang="scss" scoped>
.service {
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
