<template>
  <div class="opened-timeline-day">
    <event-record>
      <template v-slot:date>
        <event-status-detail
          :time="createdAt"
          :status="status"
        >
        </event-status-detail>
      </template>

      <template v-slot:collapse>
        <wt-rounded-action
          :icon="eventDetails.icon"
          :color="eventDetails.color"
          filled
          rounded
          class="opened-timeline-day__collapse"
          @click="openCallDetails"
        ></wt-rounded-action>

        <div
          :class="`opened-timeline-day__divider--${eventDetails.color}`"
          class="opened-timeline-day__divider"></div>
      </template>

      <template v-slot:content>
        <div  class="opened-timeline-day__wrapper">
          <div class="opened-timeline-day__inner">

            <event-initiator-name
              :event-type="eventType"
              :name="eventDetails.name"
            ></event-initiator-name>

            <wt-chip
              v-if="notMainUsers.length"
              @click="isShowNotMainUsers = !isShowNotMainUsers"
            >{{ `+${notMainUsers.length}` }}
            </wt-chip>

            <wt-tooltip
              v-if="isShowNotMainUsers"
            >
              <event-initiator-name
                v-for="(user,idx) of notMainUsers"
                :key="idx"
                :name="user.name"
              ></event-initiator-name>
            </wt-tooltip>

            <div class="opened-timeline-day-duration">
              <p class="opened-timeline-day-duration__text">{{ t('vocabulary.duration') }}:</p>
              <span class="opened-timeline-day-duration__time">{{ ConvertDuration(duration) }}</span>
            </div>
          </div>

          <wt-context-menu
            v-if="eventType !== 'chat'"
            :options="actionOptions"
            @click="$event.option.handler()"
          >
            <template #activator>
              <wt-tooltip>
                <template #activator>
                  <wt-icon-btn
                    icon="options"
                  />
                </template>
                {{ t('vocabulary.options', 2) }}
              </wt-tooltip>
            </template>

            <template #option="option">
              <p>{{ option.text }}</p>
            </template>
          </wt-context-menu>


        </div>
      </template>
    </event-record>

  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ConvertDuration from '@webitel/ui-sdk/src/scripts/convertDuration';
import EventInitiatorName from './utils/event-initiator-name.vue';
import EventRecord from './utils/event-record.vue';
import EventStatusDetail from './utils/event-status-detail.vue';
import HistoryAPI from '../api/HistoryAPI';

const props = defineProps({
  item: {
    type: Object,
  },
});

const { t } = useI18n();
const isShowNotMainUsers = ref(false);
const { createdAt, participants, type, isInbound, isMissed, duration, flowScheme, queue, id } = props.item;

const status = computed(() => eventType.value.includes('call-missed') ? 'missed' : 'started')
const notMainUsers = computed(() => participants.length > 1 && participants.shift());
const historyLink = computed(() => `${import.meta.env.VITE_HISTORY_URL}/${id}`);

const actionOptions = computed(() => {
  const openHistory = {
    text: t('contacts.timeline.actions.openInHistory'),
    handler: () => window.open(historyLink.value),
  };
  return [
    openHistory,
  ];
});

const eventType = computed(() => {
  if (type === 'chat' || !type) {
    return 'chat';
  } else {
    if (isMissed) {
      if (props.item.hasOwnProperty('queue')) return 'call-missed-from-queue';
      return 'call-missed';
    } else {
      if (!props.item.hasOwnProperty('queue')) return 'call-inbound-from-ivr';
      return 'call-inbound';
    }
    return 'call-outbound';
  }
});

const eventDetails = computed(() => {
  switch (eventType.value) {
    case 'chat':
      return {
        icon: 'chat',
        color: '--chat-started-color',
        name: participants[0].name,
      };
    case 'call-outbound':
      return {
        icon: 'call-outbound',
        color: 'success',
        name: participants[0].name,
      };
    case 'call-inbound':
      return {
        icon: 'call-inbound',
        color: 'primary',
        name: participants[0].name,
      };
    case 'call-inbound-from-ivr':
      return {
        icon: 'call-inbound',
        color: 'primary',
        name: flowScheme.name,
      };
    case 'call-missed':
      return {
        icon: 'call-missed',
        color: 'error',
        name: participants[0].name,
      };
    case 'call-missed-from-queue':
      return {
        icon: 'call-missed',
        color: 'error',
        name: queue.name,
      };
  }
});

function openCallDetails() {
  HistoryAPI.getHistory({dependencyId: '8e3d9318-dc8a-4f18-81a7-08416f32a5d6'});
}
</script>

<style lang="scss" scoped>
.opened-timeline-day {
  &__collapse {
    margin: 0 auto;
  }

  &__divider {
    height: var(--spacing-sm);
    width: 1px;
    position: relative;
    display: block;
    background-color: var(--btn-secondary-color);
    bottom: 0;
    left: 50%;
    transform: translate(50%, 0);

    &--success {
      background-color: var(--success-color);
    }

    &--primary {
      background-color: var(--primary-color);
    }

    &--error {
      background-color: var(--error-color);
    }
  }

  &__wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--border-radius);
    box-shadow: var(--elevation-1);
  }

  &__inner {
    display: flex;
    gap: var(--spacing-sm);
    align-items: center;
  }

  &-duration {
    display: flex;

    &__text {
      @extend %typo-subtitle-1;
    }

    &__time {
      @extend %typo-body-1;
    }
  }
}
</style>
