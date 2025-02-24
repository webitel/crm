<template>
  <div v-if="!isNew" class="case-attachments">
    <case-files :item-id="id" :namespace="filesNamespace" />
    <case-links :item-id="id" :namespace="linksNamespace" />
  </div>
</template>
<script setup>
import { useCardComponent } from '@webitel/ui-sdk/src/composables/useCard/useCardComponent.js';
import { useCardStore } from '@webitel/ui-sdk/src/store/new/modules/cardStoreModule/useCardStore.js';

import CaseFiles from '../modules/files/components/case-files.vue';
import CaseLinks from '../modules/links/components/case-links.vue';


const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});
const {
  itemInstance,
  id,
} = useCardStore(props.namespace);

const {
  isNew,
} = useCardComponent({
  id,
  itemInstance,
});

const linksNamespace = `${props.namespace}/links`;
const filesNamespace = `${props.namespace}/files`;


</script>
<style lang="scss" scoped>
</style>
