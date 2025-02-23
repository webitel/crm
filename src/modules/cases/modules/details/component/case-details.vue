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
  <div v-else>Display content</div>
</template>

<script setup lang="ts">
import { useCardComponent } from '@webitel/ui-sdk/src/composables/useCard/useCardComponent.js';
import { useCardStore } from '@webitel/ui-sdk/src/store/new/modules/cardStoreModule/useCardStore.js';
import { inject, ref } from 'vue';

import CustomLookupDynamicField from '../../../../configuration/modules/lookups/modules/custom-lookup/components/custom-lookup-dynamic-field.vue';
import WtTypeExtensionApi from '../../../../customization/modules/wt-type-extension/api/wtTypeExtension.js';

const editMode = inject('editMode');

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const custom = ref({
  test: 'testValue',
});

const { itemInstance, setItemProp, id } = useCardStore(props.namespace);

const { isNew } = useCardComponent({
  id,
  itemInstance,
});

const fields = ref([]);
const getFields = async () => {
  // TODO replace contacts to cases after extension will be ready
  try {
    const extension = await WtTypeExtensionApi.get({
      itemId: 'contacts',
    });

    // TODO Mock data for test fill fields for custom
    setItemProp({
      prop: 'custom',
      value: {
        test: 'testValue',
      },
    });

    fields.value = extension.fields;
  } catch {
    fields.value = [];
  }
};

getFields();
</script>

<style scoped lang="scss"></style>
