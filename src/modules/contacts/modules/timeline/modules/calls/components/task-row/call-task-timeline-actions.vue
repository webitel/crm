<template>
  <div class="call-task-timeline-actions">
    <!--    Why link instead of context-menu with options? See: [WTEL-4546]-->

    <a
      :href="historyLink"
      target="_blank"
    >
      <wt-icon-btn
        icon="link"
      />
    </a>

    <!--    Why link instead of context-menu with options? See: [WTEL-4546]-->

    <!--    <wt-context-menu-->
    <!--      :options="options"-->
    <!--      @click="$event.option.handler()"-->
    <!--    >-->
    <!--      <template #activator>-->
    <!--        <wt-tooltip>-->
    <!--          <template #activator>-->
    <!--            <wt-icon-btn-->
    <!--              icon="options"-->
    <!--            />-->
    <!--          </template>-->
    <!--          {{ t('vocabulary.options', 2) }}-->
    <!--        </wt-tooltip>-->
    <!--      </template>-->

    <!--      <template #option="{ text }">-->
    <!--        <div class="call-task-timeline-actions__context-option-wrapper">-->
    <!--          <wt-icon-->
    <!--            icon="history"-->
    <!--          />-->
    <!--          <p>{{ text }}</p>-->
    <!--        </div>-->
    <!--      </template>-->
    <!--    </wt-context-menu>-->
  </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});

const { t } = useI18n();
const historyLink = `${import.meta.env.VITE_HISTORY_URL}/${props.task.id}`;

// SEE [WTEL-4546]

// const options = computed(() => {
//   const openHistory = {
//     text: t('contacts.timeline.actions.openInHistory'),
//     icon: 'history',
//     handler: () => window.open(historyLink),
//   };
//   return [
//     openHistory,
//   ];
// });
</script>

<style lang="scss" scoped>
.call-task-timeline-actions {
  display: flex;
  align-items: center;
}

// SEE [WTEL-4546]
//.call-task-timeline-actions__context-option-wrapper {
//  display: flex;
//  align-items: center;
//  gap: var(--spacing-xs);
//}
</style>
