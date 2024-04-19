<template>
  <component
    :is="state.component"
    @click="emit('click')"
  >
    {{ text }}
  </component>
  <wt-divider
    :color="state.color"
  />
</template>

<script setup>
import { computed } from 'vue';
import TimelinePinType from '../../enums/TimelinePinType.enum.js';

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    default: '',
  },
  collapsed: {
    type: Boolean,
    default: false,
  },
});

// maybe, collapse/expand
const emit = defineEmits(['click']);

const stateMap = {
  [TimelinePinType.DAY]: {
    component: 'wt-button',
    color: 'secondary',
    // ...
  },
  [TimelinePinType.CALL_INBOUND]: {
    component: 'wt-rounded-action',
    color: '',
    icon: '',
    // ...
  },
  [TimelinePinType.CLOSE]: {
    // ...
  },
};

const text = computed(() => {
  return props.text && '123'; // day number
});

const state = computed(() => {
  if (props.collapsed) {
    return stateMap[TimelinePinType.CLOSE];
  }
  return stateMap[props.type];
});
</script>

<style scoped lang="scss">
.wt-divider {
  //transform: ;
}
</style>
