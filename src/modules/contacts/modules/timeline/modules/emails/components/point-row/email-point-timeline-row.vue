<template>
  <section class="email-point-timeline-row">
    <div class="email-point-timeline-row__wrapper">
      <wt-icon-btn
        icon="arrow-right"
        class="email-point-timeline-row__icon"
        :class="{'email-point-timeline-row__icon--down': opened }"
        @click="toggle"
      >
      </wt-icon-btn>
      <email-task-timeline-header
        :task="task"
      />
    </div>

    <timeline-row-dropdown-transition>
      <div>
        <email-point-timeline-row-content
          v-if="task?.subject || task?.body"
          :subject="task.subject"
          :body="task.body"
          :opened="opened"
        />

        <email-point-timeline-row-files-container
          v-if="task.attachments?.length && opened"
          :files="task.attachments"
        />
      </div>
    </timeline-row-dropdown-transition>
  </section>
</template>
<script setup>
import { ref } from 'vue';
import EmailTaskTimelineHeader from '../task-row/email-task-timeline-header.vue';
import EmailPointTimelineRowContent from './email-point-timeline-row-content.vue';
import EmailPointTimelineRowFilesContainer from './email-point-timeline-row-files-container.vue';
import TimelineRowDropdownTransition from '../../../../components/utils/timeline-row-dropdown-transition.vue';

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});

const opened = ref(false);

function toggle() {
  opened.value = !opened.value;
}

</script>

<style scoped lang="scss">
.email-point-timeline-row {
  display: flex;
  gap: var(--spacing-xs);
  flex-direction: column;
  width: 100%;

  &__wrapper {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }

  &__icon {
    transition: var(--transition);

    &--down {
      transform: rotate(90deg);
    }
  }
}
</style>
