<template>
  <the-timeline
    v-if="parentId"
    :parent-id="parentId"
    :mode="TimelineMode.Case"
  />
</template>

<script setup lang="ts">
import getNamespacedState from "@webitel/ui-sdk/src/store/helpers/getNamespacedState";
import {computed} from "vue";
import {useStore} from "vuex";

import TheTimeline from "../../../../timeline/components/the-timeline.vue";
import { TimelineMode} from "../../../../timeline/enums/TimelineMode";

interface Props {
  namespace: string;
}

const props = defineProps<Props>();

const store = useStore();

const parentId = computed(() => {
  return getNamespacedState(store.state, props.namespace).itemId;
});
</script>

<style scoped lang="scss">

</style>
