<template>
  <wt-popup
    :shown="shown"
    @close="close"
  >
    <template #header>
      {{ t('cases.caseResult') }}
    </template>
    <template #main>
      <wt-select
        :label="t('cases.reason')"
        required
      />

      <wt-textarea
        :label="t('cases.result')"
        required
      />
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
        {{ t('reusable.close') }}
      </wt-button>
    </template>
  </wt-popup>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import EditableField from '../../case-info/components/editable-field.vue';
import CloseReasonsAPI from '../../result/api/CloseReasonsAPI.js';

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
  close();
}

function close() {
  emit('close');
}
</script>

<style lang="scss" scoped>

</style>
