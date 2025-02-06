<template>
  <wt-popup
    class="opened-status-condition-warning-popup"
    size="sm"
    overflow
    @close="close"
  >
    <template #title>
      {{ t('lookups.statuses.statusType') }}
    </template>

    <template #main>
      <div class="opened-status-condition-warning-popup__content">
        <wt-icon
          icon="attention"
          color="error"
        />

        {{ t('lookups.statuses.finalStatusValidationText') }}
      </div>
    </template>

    <template #actions>
      <wt-button @click="close">
        {{ t('reusable.ok') }}
      </wt-button>
    </template>
  </wt-popup>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const emit = defineEmits(['close']);

const { t } = useI18n();

function close() {
  emit('close');
}
</script>

<style lang="scss" scoped>
.opened-status-condition-warning-popup {
  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
    text-align: center;
    grid-gap: var(--spacing-sm);
  }

  .wt-button {
    min-width: fit-content;
  }
}
</style>
