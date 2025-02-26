<template>
  <wt-popup
    class="sla-recalculation-popup"
    size="sm"
    :shown="shown"
    @close="close"
  >
    <template #header>
      {{ t('cases.slaRecalculationPopup.title') }}
    </template>
    <template #main>
      <div class="sla-recalculation-popup__content">
        <span class="sla-recalculation-popup__message">
          {{ t('cases.slaRecalculationPopup.message') }}
        </span>
      </div>
    </template>
    <template #actions>
      <wt-button
        @click="save"
      >
        {{ t('reusable.ok') }}
      </wt-button>
      <wt-button
        color="secondary"
        @click="close"
      >
        {{ t('reusable.cancel') }}
      </wt-button>
    </template>
  </wt-popup>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  shown: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['save', 'close']);

function save() {
  emit('save');
  close()
}

function close() {
  emit('close');
}

</script>

<style lang="scss" scoped>
.sla-recalculation-popup {
  &__content {
    display: flex;
    justify-content: center;
  }

  &__message {
    text-align: center;
  }
}
</style>
