<template>
  <div class="chat-task-timeline-row">
    <timeline-row>
      <template #before-content>
        <timeline-row-info
          :timestamp="createdAt"
        >
          <template #title="{ time }">
            {{ time }}
          </template>

          <template #subtitle>
            <timeline-task-status />
          </template>
        </timeline-row-info>
      </template>

      <template v-slot:action>
        <timeline-pin
          :type="pinType"
        ></timeline-pin>
      </template>

      <template v-slot:content>
        <timeline-row-initiator></timeline-row-initiator>

        <wt-chip>
          COUNT ME
        </wt-chip>

        <timeline-row-duration
          :duration="duration"
        ></timeline-row-duration>

        <!--        <div  class="task-timeline-row__wrapper">-->
        <!--          <div class="task-timeline-row__inner">-->

        <!--            <event-initiator-name-->
        <!--              :event-type="eventType"-->
        <!--              :name="eventDetails.name"-->
        <!--            ></event-initiator-name>-->

        <!--            <wt-chip-->
        <!--              v-if="notMainUsers.length"-->
        <!--              @click="isShowNotMainUsers = !isShowNotMainUsers"-->
        <!--            >{{ `+${notMainUsers.length}` }}-->
        <!--            </wt-chip>-->

        <!--            <wt-tooltip-->
        <!--              v-if="isShowNotMainUsers"-->
        <!--            >-->
        <!--              <event-initiator-name-->
        <!--                v-for="(user,idx) of notMainUsers"-->
        <!--                :key="idx"-->
        <!--                :name="user.name"-->
        <!--              ></event-initiator-name>-->
        <!--            </wt-tooltip>-->

        <!--            <div class="task-timeline-row-duration">-->
        <!--              <p class="task-timeline-row-duration__text">{{ t('vocabulary.duration') }}:</p>-->
        <!--              <span class="task-timeline-row-duration__time">{{ ConvertDuration(duration) }}</span>-->
        <!--            </div>-->
        <!--          </div>-->

        <!--          <wt-context-menu-->
        <!--            v-if="eventType !== 'chat'"-->
        <!--            :options="actionOptions"-->
        <!--            @click="$event.option.handler()"-->
        <!--          >-->
        <!--            <template #activator>-->
        <!--              <wt-tooltip>-->
        <!--                <template #activator>-->
        <!--                  <wt-icon-btn-->
        <!--                    icon="options"-->
        <!--                  />-->
        <!--                </template>-->
        <!--                {{ t('vocabulary.options', 2) }}-->
        <!--              </wt-tooltip>-->
        <!--            </template>-->

        <!--            <template #option="option">-->
        <!--              <p>{{ option.text }}</p>-->
        <!--            </template>-->
        <!--          </wt-context-menu>-->


        <!--        </div>-->
      </template>
    </timeline-row>
  </div>
</template>

<script setup>
import { computed, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import TimelinePinType from '../../enums/TimelinePinType.enum.js';
import TimelinePin from '../utils/timeline-pin.vue';
import TimelineRowDuration from '../utils/timeline-row-duration.vue';
import TimelineRowInfo from '../utils/timeline-row-info.vue';
import TimelineRowInitiator from '../utils/timeline-row-initiator.vue';
import TimelineRow from '../utils/timeline-row.vue';
import TimelineTaskStatus from '../utils/timeline-task-status.vue';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const { t } = useI18n();
const {
  createdAt,
  participants,
  type,
  isInbound,
  isMissed,
  duration,
  flowScheme,
  queue,
  id,
} = toRefs(props.item);

const hiddenUsers = computed(() => participants.filter((participant) => participant));
const historyLink = `${import.meta.env.VITE_HISTORY_URL}/${id}`;

// const actionOptions = computed(() => {
//   const openHistory = {
//     text: t('contacts.timeline.actions.openInHistory'),
//     handler: () => window.open(historyLink.value),
//   };
//   return [
//     openHistory,
//   ];
// });

const eventType = computed(() => {
  if (type === 'chat' || !type) {
    return 'chat';
  } else {
    if (isMissed) {
      if (props.item.queue) return 'call-missed-from-queue';
      return 'call-missed';
    } else {
      if (!props.item.queue) return 'call-inbound-from-ivr';
      return 'call-inbound';
    }
    return 'call-outbound';
  }
});

// const eventDetails = computed(() => {
//   switch (eventType.value) {
//     case 'chat':
//       return {
//         icon: 'chat',
//         color: '--chat-started-color',
//         name: participants[0].name,
//       };
//     case 'call-outbound':
//       return {
//         icon: 'call-outbound',
//         color: 'success',
//         name: participants[0].name,
//       };
//     case 'call-inbound':
//       return {
//         icon: 'call-inbound',
//         color: 'primary',
//         name: participants[0].name,
//       };
//     case 'call-inbound-from-ivr':
//       return {
//         icon: 'call-inbound',
//         color: 'primary',
//         name: flowScheme.name,
//       };
//     case 'call-missed':
//       return {
//         icon: 'call-missed',
//         color: 'error',
//         name: participants[0].name,
//       };
//     case 'call-missed-from-queue':
//       return {
//         icon: 'call-missed',
//         color: 'error',
//         name: queue.name,
//       };
//   }
// });

const pinType = computed(() => {
  if (true) {
    return TimelinePinType.CHAT_INVITE;
  }
});
</script>

<style lang="scss" scoped>
.task-timeline-row {
  &__collapse {
    margin: 0 auto;
  }

  &__divider {
    position: relative;
    bottom: 0;
    left: 50%;
    display: block;
    width: 1px;
    height: var(--spacing-sm);
    transform: translate(50%, 0);
    background-color: var(--btn-secondary-color);

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
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--border-radius);
    box-shadow: var(--elevation-1);
  }

  &__inner {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
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

