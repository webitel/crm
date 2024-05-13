<template>
  <div class="timeline-pin">
    <component
      :is="state.component"
      :color="state.color"
      :icon="state.icon"
      @click="state.handler && state.handler()"
    >
      {{ text }}
    </component>
    <timeline-flow-line
      v-if="!last"
      :color="state.lineColor || state.color"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import TimelinePinType from '../../enums/TimelinePinType.enum.js';
import TimelineFlowLine from './timeline-flow-line.vue';
import TimelineRoundedAction from './timeline-rounded-action.vue';

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (type) => Object.values(TimelinePinType).includes(type),
  },
  text: {
    type: [String, Number],
    default: '',
  },
  collapsed: {
    type: Boolean,
    default: false,
  },
  last: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  'click',
]);

const handleClick = () => {
  emit('click');
};

const stateMap = {
  [TimelinePinType.CLOSE]: {
    component: TimelineRoundedAction,
    icon: 'close',
    color: 'secondary',
    lineColor: 'default',
    handler: handleClick,
  },

  [TimelinePinType.DAY]: {
    component: 'wt-button',
    color: 'secondary',
    handler: handleClick,
  },

  [TimelinePinType.USER]: {
    component: 'wt-icon',
    color: 'default',
    icon: 'contacts',
  },
  [TimelinePinType.AGENT]: {
    component: 'wt-icon',
    color: 'default',
    icon: 'agent',
  },
  [TimelinePinType.BOT]: {
    component: 'wt-icon',
    color: 'default',
    icon: 'bot',
  },
  [TimelinePinType.CHAT_INBOUND]: {
    component: TimelineRoundedAction,
    color: 'chat',
    icon: 'chat',
    handler: handleClick,
  },
  [TimelinePinType.CHAT_TRANSFER]: {
    component: 'wt-icon',
    color: 'transfer',
    icon: 'chat-transfer',
  },
  [TimelinePinType.CHAT_END]: {
    component: 'wt-icon',
    color: 'error',
    icon: 'chat-end',
  },
  [TimelinePinType.CALL_INBOUND]: {
    component: TimelineRoundedAction,
    color: 'primary',
    icon: 'call-inbound',
    handler: handleClick,
  },
  [TimelinePinType.CALL_OUTBOUND]: {
    component: TimelineRoundedAction,
    color: 'success',
    icon: 'call-outbound',
    handler: handleClick,
  },
  [TimelinePinType.CALL_MISSED]: {
    component: TimelineRoundedAction,
    color: 'error',
    icon: 'call-missed',
  },
  [TimelinePinType.CALL_TRANSFER]: {
    component: 'wt-icon',
    color: 'transfer',
    icon: 'call-transfer',
  },
};

const state = computed(() => {
  if (props.type === TimelinePinType.DAY) return stateMap[TimelinePinType.DAY];
  return props.collapsed ? stateMap[props.type] : stateMap[TimelinePinType.CLOSE];
});
</script>

<style lang="scss" scoped>
.timeline-pin {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;

  .timeline-flow-line {
    flex: 1;
  }
}
</style>
