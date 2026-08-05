<template>
  <the-timeline
    v-if="parentId"
    :parent-id="parentId"
    :mode="TimelineMode.Contact"
  />
</template>

<script setup lang="ts">
import { TimelineMode } from '@webitel/ui-sdk/enums';
import { type StoreGeneric, storeToRefs } from 'pinia';
import TheTimeline from '../../../../timeline/components/the-timeline.vue';
import { useContactCardStore } from '../../../stores/card/contactCardStore';

const contactCardStore = useContactCardStore();
const { itemId: parentId } = storeToRefs(
	contactCardStore as unknown as StoreGeneric,
);
</script>

<style scoped lang="scss">

</style>
