<template>
  <section>
    <header class="opened-card-header">
      <h3 class="opened-card-header__title">
        {{ t('customization.customLookups.columns') }}
      </h3>
    </header>
    <div
      class="opened-card-input-grid opened-card-input-grid--1-col opened-card-input-grid--w50"
    >
      <custom-lookup-dynamic-field
        v-for="field in fields"
        :key="field.id"
        :field="field"
        :namespace="namespace"
      />
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

import {
  FieldType,
} from '../../../../../../customization/modules/custom-lookups/enums/FieldType.enum.js';
import CustomLookupDynamicField from './custom-lookup-dynamic-field.vue';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const store = useStore();

const { t } = useI18n();

const fields = computed(() =>
  store.getters[`${props.namespace}/LOOKUP_FIELDS`]?.filter(
    (field) => !field.hidden && (!field.default || field.kind === FieldType.Boolean) && !field.always,
  ),
);
</script>
