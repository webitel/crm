<template>
  <timeline-row>
    <template #before-content>
      <timeline-row-info
        :timestamp="createdAt"
      >
        <template
          #title="{ time }"
        ></template>
      </timeline-row-info>
    </template>

    <template #pin>
      <timeline-pin
        :type="pinType"
      />
    </template>

    <template #content>
      <wt-icon
        icon="expand"
      />
      <timeline-row-initiator
        text="point initiator"
      />
    </template>

    <template #dropdown>
      <chat-point-row-dropdown />
    </template>
  </timeline-row>
</template>

<script setup>
import { computed, toRefs } from 'vue';
import TimelineRowInfo from '../../../../components/utils/timeline-row-info.vue';
import TimelineRow from '../../../../components/utils/timeline-row.vue';
import TimelinePin from '../../../../components/utils/timeline-pin.vue';
import TimelineRowInitiator from '../../../../components/utils/timeline-row-initiator.vue';
import TimelinePinType from '../../../../enums/TimelinePinType.enum.js';
import ChatPointRowDropdown from './chat-point-row-dropdown.vue';

const props = defineProps({
  point: {
    type: Object,
    required: true,
  },
});

const {
  createdAt,
} = toRefs(props);

const pinType = computed(() => {
  return TimelinePinType.CHAT_INVITE;
});

</script>

<style lang="scss" scoped>

</style>
