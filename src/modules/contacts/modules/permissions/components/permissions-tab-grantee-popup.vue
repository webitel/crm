<template>
  <wt-popup
    min-width="480"
    overflow
    @close="close"
  >
    <template #title>
      {{ t('permissions.granteePopup.title') }}
    </template>
    <template #main>
      <grantee-select
        :value="grantee"
        @input="grantee = $event"
      />
    </template>
    <template #actions>
      <wt-button
        :disabled="v$.$invalid"
        :loading="isLoading"
        @click="save"
      >
        {{ $t('reusable.add') }}
      </wt-button>
      <wt-button
        color="secondary"
        @click="close"
      >
        {{ $t('reusable.close') }}
      </wt-button>
    </template>
  </wt-popup>
</template>

<script setup>
import { ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { useI18n } from 'vue-i18n';
import GranteeSelect from './grantee-select.vue';

const props = defineProps({
  callback: {
    type: Function,
  },
});

const emit = defineEmits([
  'close',
]);

const { t } = useI18n();

const grantee = ref({});
const isLoading = ref(false);

const v$ = useVuelidate({
  grantee: { required },
}, { grantee }, { $autoDirty: true });
v$.value.$touch();

function close() {
  emit('close');
}

async function save() {
  try {
    isLoading.value = true;
    await props.callback(grantee.value);
    close();
  } finally {
    isLoading.value = false;
  }
}

</script>

<style lang="scss" scoped>
</style>
