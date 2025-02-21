<template>
  <div
    v-if="editMode"
    class="opened-card-input-grid opened-card-input-grid--1-col opened-card-input-grid--w50"
  >
    <wt-type-extension-dynamic-field
      v-for="field in fields"
      :key="field.id"
      :field="field"
      :namespace="namespace"
    />
  </div>
  <div v-else>Display content</div>
</template>

<script setup lang="ts">
import { useCardComponent } from '@webitel/ui-sdk/src/composables/useCard/useCardComponent.js';
import { useCardStore } from '@webitel/ui-sdk/src/store/new/modules/cardStoreModule/useCardStore.js';
import { inject, ref } from 'vue';

import WtTypeExtensionApi from '../../../../customization/modules/wt-type-extension/api/wtTypeExtension.js';
import WtTypeExtensionDynamicField from '../../../../customization/modules/wt-type-extension/components/wt-type-extension-dynamic-field.vue';

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
