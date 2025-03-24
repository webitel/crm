<template>
  <div>
    <wt-button @click="saveDetails">{{ t('reusable.save') }}</wt-button>
  </div>
  <div class="opened-card">
    <div class="opened-card-form">
      <div
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
    </div>
  </div>
</template>

<script setup lang="ts">
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum';
import { useCardStore } from '@webitel/ui-sdk/src/store/new/modules/cardStoreModule/useCardStore';
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import CustomLookupDynamicField from '../../../../configuration/modules/lookups/modules/custom-lookup/components/custom-lookup-dynamic-field.vue';

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

const router = useRouter();
const { t } = useI18n();

const { itemInstance, updateItem } = useCardStore(props.namespace);

const saveDetails = () => {
  updateItem({
    custom: itemInstance.custom,
  });
};

onMounted(() => {
  if (!props.fields.length) {
    router.push({
      name: `${CrmSections.CONTACTS}-timeline`,
    });
  }
});
</script>

<style scoped lang="scss"></style>
