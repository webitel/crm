<template>
  <component
    :is="state.component"
    :color="state.color"
    :icon="state.icon"
    rounded
    @click="state.handler && state.handler()"
  >
    {{ text }}
  </component>
  <timeline-flow-line
    :color="state.color"
  />
</template>

<script setup>
import { computed } from 'vue';
import TimelinePinType from '../../enums/TimelinePinType.enum.js';
import TimelineFlowLine from './timeline-flow-line.vue';

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
});

const emit = defineEmits([
  'click',
]);

const handleClick = () => {
  emit('click');
};

const stateMap = {
  [TimelinePinType.CLOSE]: {
    component: 'wt-rounded-action',
    icon: 'close',
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
    icon: 'account',
  },
  [TimelinePinType.AGENT]: {
    component: 'wt-icon',
    color: 'default',
    icon: 'edit',
  },
  [TimelinePinType.BOT]: {
    component: 'wt-icon',
    color: 'default',
    icon: 'bot',
  },

  [TimelinePinType.CHAT_INBOUND]: {
    component: 'wt-rounded-action',
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
    component: 'wt-rounded-action',
    color: 'warning',
    icon: 'call-inbound',
    handler: handleClick,
  },
  [TimelinePinType.CALL_OUTBOUND]: {
    component: 'wt-rounded-action',
    color: 'success',
    icon: 'call-outbound',
    handler: handleClick,
  },
  [TimelinePinType.CALL_OUTBOUND]: {
    component: 'wt-rounded-action',
    color: 'success',
    icon: 'call-outbound',
    handler: handleClick,
  },
  [TimelinePinType.CALL_MISSED]: {
    component: 'wt-rounded-action',
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
  if(props.type === TimelinePinType.DAY) return stateMap[TimelinePinType.DAY];
  return props.collapsed ? stateMap[props.type] : stateMap[TimelinePinType.CLOSE];
});
</script>

<style scoped lang="scss">
</style>
