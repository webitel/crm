<template>
  <wt-table>

  </wt-table>
</template>

<script setup>
import {watch} from 'vue';
import CommentsAPI from '../api/CommentsAPI.js';
import {useCardStore} from '@webitel/ui-sdk/src/modules/CardStoreModule/composables/useCardStore.js';

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
} = useCardStore(props.namespace);

watch(() => itemInstance.value.etag, async (newVal, oldVal) => {
  console.log(itemInstance.value.etag);
  let a = await CommentsAPI.getList({etag: itemInstance.value.etag});
  console.log(a);
});

</script>


<style lang="scss" scoped>

</style>
