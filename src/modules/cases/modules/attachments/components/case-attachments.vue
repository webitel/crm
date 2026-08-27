<template>
  <div class="case-attachments">
    <case-files :item-id="itemId" />
    <case-links :item-id="itemId" />
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useCasesCardStore } from '../../../stores/card/casesCardStore';
import CaseFiles from '../modules/files/components/case-files.vue';
import CaseLinks from '../modules/links/components/case-links.vue';

const casesCardStore = useCasesCardStore();
const { itemId } = storeToRefs(casesCardStore);
</script>
<style lang="scss" scoped>
</style>
