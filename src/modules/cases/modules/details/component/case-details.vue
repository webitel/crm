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
        :value="itemInstance.custom[field.id]"
      />
    </div>
  </template>
</template>

<script setup lang="ts">
import { useCardStore } from '@webitel/ui-sdk/src/store/new/modules/cardStoreModule/useCardStore.js';
import { inject } from 'vue';

import CustomLookupDynamicField from '../../../../configuration/modules/lookups/modules/custom-lookup/components/custom-lookup-dynamic-field.vue';
import WtDisplayContent from '../../../../customization/modules/wt-type-extension/components/wt-display-content.vue';
import { useExtensionFields } from '../../../../customization/modules/wt-type-extension/composable/useExtensionFields.js';

const editMode = inject('editMode');

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const { itemInstance } = useCardStore(props.namespace);

const { fields, getFields } = useExtensionFields({
  type: 'contacts',
});

getFields();
</script>

<style scoped lang="scss"></style>
