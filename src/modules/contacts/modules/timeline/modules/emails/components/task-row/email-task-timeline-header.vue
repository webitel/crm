<template>
  <div class="email-task-timeline-header">
    <div
      v-if="task.owner"
      class="email-task-timeline-header__wrapper"
    >
      <p>{{ t('objects.user', 1) }}:</p>
      <timeline-row-initiator
        :text="task.owner.name"
        :type="TimelineInitiatorType.CONTACT"
      />
    </div>

    <div
      v-if="task.from"
      class="email-task-timeline-header__wrapper"
    >
      <p>{{ t('reusable.from') }}:</p>
      <span class="email-task-timeline-header__name">{{ task.from[0] }}</span>
    </div>

    <div
      v-if="task.to"
      class="email-task-timeline-header__wrapper"
    >
      <p>{{ t('contacts.timeline.emails.to') }}:</p>
      <span class="email-task-timeline-header__name">{{ task.to[0] }}</span>

      <wt-tooltip
        v-if="hiddenRecipients.length"
        :triggers="['click']"
      >
        <template #activator>
          <wt-chip>
            +{{ hiddenRecipients.length }}
          </wt-chip>
        </template>

        <div class="email-task-timeline-header__inner">
          <p
            v-for="(name, idx) of hiddenRecipients"
            :key="idx"
          >{{ name }}</p>
        </div>
      </wt-tooltip>

    </div>

    <div
      v-if="task.cc"
      class="email-task-timeline-header__wrapper"
    >
      <p>{{ t('contacts.timeline.emails.cc') }}:</p>
      <span class="email-task-timeline-header__name">{{ task.cc[0] }}</span>


      <wt-tooltip
        v-if="hiddenCopyRecipients.length"
        :triggers="['click']"
      >
        <template #activator>
          <wt-chip>
            +{{ hiddenCopyRecipients.length }}
          </wt-chip>
        </template>

        <div class="email-task-timeline-header__inner">
          <p
            v-for="(name, idx) of hiddenCopyRecipients"
            :key="idx"
          >{{ name }}</p>
        </div>
      </wt-tooltip>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import TimelineRowInitiator from '../../../../components/utils/timeline-row-initiator.vue';
import TimelineInitiatorType from '../../../../enums/TimelineInitiatorType.enum.js';

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});

const { t } = useI18n();

const hiddenRecipients = computed(() => props.task.to.slice(0, -1));
const hiddenCopyRecipients = computed(() => props.task.cc.slice(0, -1));
</script>

<style scoped lang="scss">
.email-task-timeline-header {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);

  &__wrapper {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  &__inner {
    padding: var(--spacing-xs);
  }

  &__name {
    @extend %typo-subtitle-1;
  }
}
</style>
