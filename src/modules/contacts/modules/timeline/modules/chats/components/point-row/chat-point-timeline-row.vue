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

    <template #pin="{ toggle, collapsed }">
      <timeline-pin
        :collapsed="collapsed"
        :type="pinType"
        @click="toggle"
      />
    </template>

    <template #content>
      <wt-icon
        icon="expand"
      />
      <timeline-row-initiator
        :text="initiator"
      />
    </template>

    <template #content-dropdown>
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
import ChatPointRowDropdown from './chat-point-timeline-row-dropdown.vue';

const props = defineProps({
  point: {
    type: Object,
    required: true,
  },
});

const {
  createdAt,
} = toRefs(props);

// TODO ME!
const pinType = computed(() => {
  if (true) return TimelinePinType.USER;
  if (false) return TimelinePinType.AGENT;
  if (false) return TimelinePinType.BOT;
  throw new Error(`Unknown pin type for chat point!, ${JSON.stringify(props.point)}`);
});

// TODO
const initiator = computed(() => 'initiatorrr');
</script>

<style lang="scss" scoped>

</style>
