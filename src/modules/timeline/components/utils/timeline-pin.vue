<template>
  <div
    :class="{
      'timeline-pin--clickable': !nonClickable && state.handler,
      'timeline-pin--collapsed': collapsed,
      'timeline-pin--has-arrow': hasArrow,
    }"
    class="timeline-pin"
  >
    <component
      :is="state.component"
      :color="state.color"
      :icon="state.icon"
      class="timeline-pin-action"
      @click="!state.arrow && state.handler()"
    >
      {{ text }}
    </component>
    <wt-icon-btn
      v-if="hasArrow"
      class="timeline-pin-arrow"
      icon="arrow-down"
      @click="() => state.handler()"
    />
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
		type: [
			String,
			Number,
		],
		default: '',
	},
	collapsed: {
		type: Boolean,
		default: false,
	},
	nonClickable: {
		type: Boolean,
		default: false,
	},
	first: {
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

if (props.first) handleClick();

const stateMap = {
	[TimelinePinType.CLOSE]: {
		component: TimelineRoundedAction,
		icon: 'close',
		color: 'secondary',
		lineColor: 'default',
		arrow: true,
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
		arrow: true,
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
		arrow: true,
		handler: handleClick,
	},
	[TimelinePinType.CALL_OUTBOUND]: {
		component: TimelineRoundedAction,
		color: 'success',
		icon: 'call-outbound',
		arrow: true,
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
	[TimelinePinType.EMAIL_INBOUND]: {
		component: TimelineRoundedAction,
		color: 'email',
		icon: 'email-inbound',
	},
	[TimelinePinType.EMAIL_OUTBOUND]: {
		component: TimelineRoundedAction,
		color: 'email',
		icon: 'email-outbound',
	},
};

const state = computed(() => {
	if (props.type === TimelinePinType.DAY) return stateMap[TimelinePinType.DAY];
	return props.collapsed
		? stateMap[props.type]
		: stateMap[TimelinePinType.CLOSE];
});

const hasArrow = computed(() => !props.nonClickable && state.value.arrow);
</script>

<style lang="scss" scoped>
.timeline-pin {
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100%;

  .timeline-pin-arrow {
    transition: var(--transition);
  }

  .timeline-flow-line {
    flex: 1;
  }

  &:not(&--clickable) {
    pointer-events: none;
  }

  &:not(&--collapsed) {
    .timeline-pin-arrow {
      transform: rotate(180deg);
    }
  }

  /**
  Pins with arrow should have additional height because arrow takes line's space,
  but we still need to show the line.

  I think this (although bad) solution is better than changing timeline-row minimal height depending
  on expandable content existence.
   */
  &--has-arrow {
    padding-bottom: 20px;

    .timeline-flow-line {
      position: absolute;
      z-index: 1;
      bottom: 0;
      height: 20px;
    }

    .timeline-pin-action {
      pointer-events: none;
    }
  }
}
</style>
