<template>
 <timeline-row>
   <template #content>
     {{ point }}
   </template>
 </timeline-row>
</template>

<script setup>
import TimelineRow from '../../../../components/utils/timeline-row.vue';

const props = defineProps({
  point: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped lang="scss">

</style>
