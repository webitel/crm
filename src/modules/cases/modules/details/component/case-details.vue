<template>
  <template>
    <div
      v-if="editMode"
      class="opened-card-input-grid opened-card-input-grid--2-col opened-card-input-grid--w50"
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
  </template>
</template>

<script setup lang="ts">
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum';
import {
  useCardStore,
} from '@webitel/ui-sdk/src/store/new/modules/cardStoreModule/useCardStore.js';
import get from 'lodash/get';
import { inject, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

import CustomLookupDynamicField
  from '../../../../configuration/modules/lookups/modules/custom-lookup/components/custom-lookup-dynamic-field.vue';
import WtDisplayContent
  from '../../../../customization/modules/wt-type-extension/components/wt-display-content.vue';

const router = useRouter();

const editMode = inject('editMode');

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
const { itemInstance } = useCardStore(props.namespace);

watch(() => props.fields, () => {
  if (!props.fields.length) {
    router.push({
      name: `${CrmSections.CASES}-case-info`,
    });
  }
});
</script>

<style scoped lang="scss"></style>
