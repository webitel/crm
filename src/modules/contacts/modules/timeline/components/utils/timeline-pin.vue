<template>
  <component
    :is="state.component"
    v-bind="state"
    @click="handleClick"
  >
    {{ text }}
  </component>
  <timeline-separator
    :color="state.color"
  />
</template>

<script setup>
import { computed } from 'vue';
import TimelinePinType from '../../enums/TimelinePinType.enum.js';
import TimelineSeparator from './timeline-separator.vue';

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  text: {
    type: String, Number,
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

const stateMap = {
  [TimelinePinType.DAY]: {
    component: 'wt-button',
    color: 'secondary',
  },
  [TimelinePinType.CLOSE]: {
    component: 'wt-rounded-action',
    icon: 'close'
  },
  [TimelinePinType.CHAT]: {
    component: 'wt-rounded-action',
    color: 'chat',
    icon: 'chat',
    filled: true,
    rounded: true,
  },
  [TimelinePinType.CALL_INBOUND]: {
    component: 'wt-rounded-action',
    color: 'primary',
    icon: 'call-inbound',
    filled: true,
    rounded: true,
  },
  [TimelinePinType.CALL_OUTBOUND]: {
    component: 'wt-rounded-action',
    color: 'success',
    icon: 'call-outbound',
    filled: true,
    rounded: true,
  },
  [TimelinePinType.CALL_MISSED]: {
    component: 'wt-rounded-action',
    color: 'error',
    icon: 'call-missed',
    filled: true,
    rounded: true,
  },
  [TimelinePinType.CALL_INBOUND_ON_IVR]: {
    component: 'wt-rounded-action',
    color: 'primary',
    icon: 'call-inbound',
    filled: true,
    rounded: true,
  },
  [TimelinePinType.CALL_MISSED_ON_QUEUE]: {
    component: 'wt-rounded-action',
    color: 'error',
    icon: 'call-missed',
    filled: true,
    rounded: true,
  },

};

const state = computed(() => {
  return props.collapsed ? stateMap[props.type] : stateMap[TimelinePinType.CLOSE];
});

const handleClick = () => {
  emit('click');
};
</script>

<style scoped lang="scss">
</style>
