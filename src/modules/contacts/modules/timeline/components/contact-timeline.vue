<template>
  <the-timeline
    v-if="itemId"
    :parent-id="(itemId as unknown as string)"
    :mode="TimelineMode.Contact"
  />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import TheTimeline from '../../../../timeline/components/the-timeline.vue';
import { TimelineMode } from '../../../../timeline/enums/TimelineMode';
import { useContactCardStore } from '../../../stores/card/contactCardStore';

const contactCardStore = useContactCardStore();
const { itemId } = storeToRefs(contactCardStore);
</script>

<style scoped lang="scss">

</style>
