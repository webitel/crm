<template>
  <the-timeline
    v-if="itemId"
    :parent-id="itemId"
    :mode="TimelineMode.Case"
  />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import TheTimeline from '../../../../timeline/components/the-timeline.vue';
import { TimelineMode } from '../../../../timeline/enums/TimelineMode';
import { useCasesCardStore } from '../../../stores/card/casesCardStore';

const casesCardStore = useCasesCardStore();
const { itemId } = storeToRefs(casesCardStore);
</script>

<style scoped lang="scss">

</style>
