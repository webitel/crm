<template>
  <teleport
    v-if="hasEditAccess"
    to="#page-header-actions"
  >
    <wt-button :disabled="disabledSave" @click="saveDetails">{{ t('reusable.save') }}</wt-button>
  </teleport>
  <div class="opened-card">
    <div class="opened-card-form">
      <div
        v-if="hasEditAccess"
        class="opened-card-input-grid opened-card-input-grid--2-col opened-card-input-grid--w100"
      >
        <custom-lookup-dynamic-field
          v-for="field in fields"
          :key="field.id"
          :field="field"
          :namespace="namespace"
          path-to-field="custom"
        />
      </div>
      <div
        v-else
        class="opened-card-input-grid opened-card-input-grid--2-col opened-card-input-grid--w50"
      >
        <wt-display-content
          v-for="field in fields"
          :key="field.id"
          :field="field"
          :value="get(itemInstance, `custom.${field.id}`)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum';
import { useCardStore } from '@webitel/ui-sdk/src/store/new/modules/cardStoreModule/useCardStore';
import get from 'lodash/get';
import { computed, inject, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import CustomLookupDynamicField
  from '../../../../configuration/modules/lookups/modules/custom-lookup/components/custom-lookup-dynamic-field.vue';
import WtDisplayContent
  from '../../../../customization/modules/wt-type-extension/components/wt-display-content.vue';

const access = inject('access');

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
  fields: {
    type: Object,
    required: true,
  },
});

const hasEditAccess = computed(() => access.value?.hasRbacEditAccess);

const router = useRouter();
const { t } = useI18n();

const { itemInstance, updateItem } = useCardStore(props.namespace);

const v$ = useVuelidate({}, { itemInstance }, { $autoDirty: true });

v$.value.$touch();

const disabledSave = computed(
  () => v$.value?.$invalid || !itemInstance.value._dirty,
);

const saveDetails = () => {
  updateItem({
    custom: itemInstance.custom,
  });
};

watch(() => props.fields, () => {
  if (!props.fields.length) {
    router.push({
      name: `${CrmSections.CONTACTS}-timeline`,
    });
  }
});
</script>

<style scoped lang="scss"></style>
