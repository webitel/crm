<template>
  <div class="email-task-timeline-header">

    <email-task-timeline-header-section
      v-if="task.owner"
      :title="t('objects.user', 1)"
    >
      <template #name>
        <timeline-row-initiator
          :text="task.owner.name"
          :type="TimelineInitiatorType.CONTACT"
        />
      </template>
    </email-task-timeline-header-section>

    <email-task-timeline-header-section
      v-if="task.from"
      :title="t('reusable.from')"
      :name="task.from[0]"
    >
    </email-task-timeline-header-section>

    <email-task-timeline-header-section
      v-if="task.to"
      :title="t('timeline.emails.to')"
      :name="task.to[0]"
      :hidden-participants="hiddenRecipients"
    >
    </email-task-timeline-header-section>

    <email-task-timeline-header-section
      v-if="task.cc"
      :title="t('timeline.emails.cc')"
      :name="task.cc[0]"
      :hidden-participants="hiddenCopyRecipients"
    >
    </email-task-timeline-header-section>

  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import TimelineRowInitiator from '../../../../components/utils/timeline-row-initiator.vue';
import TimelineInitiatorType from '../../../../enums/TimelineInitiatorType.enum.js';
import EmailTaskTimelineHeaderSection from './email-task-timeline-header-section.vue';

const props = defineProps({
	task: {
		type: Object,
		required: true,
	},
});

const { t } = useI18n();

const hiddenRecipients = computed(
	() => props.task.to.length > 1 && props.task.to.slice(1),
);
const hiddenCopyRecipients = computed(
	() => props.task.cc.length > 1 && props.task.cc.slice(1),
);
</script>

<style scoped lang="scss">
.email-task-timeline-header {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}
</style>
