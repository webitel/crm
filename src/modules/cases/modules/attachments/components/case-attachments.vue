<template>
  <div class="case-attachments">
    <case-links :item-id="id" :namespace="linksNamespace" />
    <case-files :item-id="id" :namespace="filesNamespace" />
  </div>
</template>
<script setup>
import { useCardStore } from '@webitel/ui-sdk/src/modules/CardStoreModule/composables/useCardStore.js';
import CaseFiles from '../modules/files/components/case-files.vue';
import CaseLinks from '../modules/links/components/case-links.vue';


const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});
const {
  namespace: cardNamespace,
  itemInstance,
  setItemProp,
  id,
} = useCardStore(props.namespace);

const linksNamespace = `${props.namespace}/links`;
const filesNamespace = `${props.namespace}/files`;


</script>
<style lang="scss" scoped>
</style>
