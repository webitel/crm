<template>
  <section class="chat-point-row-content">
    <header class="chat-point-row-content-header">
      <wt-icon-btn
        :icon="collapsed ? 'arrow-right' : 'arrow-down'"
        @click="toggle"
      />
      <timeline-row-initiator
        :text="initiator"
        :type="isInitiatorBot ? TimelineInitiatorType.BOT : TimelineInitiatorType.CONTACT"
      />
    </header>

    <article
      v-if="point.text"
      class="chat-point-row-content-text"
      :class="{ 'chat-point-row-content-text--collapsed': collapsed }"
      >
      {{ point.text }}
    </article>

    <footer
      v-if="showFooter"
      class="chat-point-row-content-footer"
    >
      <chat-point-timeline-row-file
        v-for="(file) of point.files"
        :key="file.id"
        :file="file"
      />
    </footer>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import ChatPointTimelineRowFile from './chat-point-timeline-row-file.vue';
import TimelineRowInitiator from '../../../../components/utils/timeline-row-initiator.vue';
import TimelineInitiatorType from '../../../../enums/TimelineInitiatorType.enum.js';

const props = defineProps({
  point: {
    type: Object,
    required: true,
  },
});

const collapsed = ref(true);

const toggle = () => {
  collapsed.value = !collapsed.value;
};

const initiator = computed(() => {
  return props.point.peer?.name || '';
});

const isInitiatorBot = computed(() => {
  return props.point.peer?.type === 'bot';
});

const showFooter = computed(() => {
  return !!props.point.files;
});
</script>

<style scoped lang="scss">
.chat-point-row-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.chat-point-row-content-header,
.chat-point-row-content-footer {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.chat-point-row-content-text {
  overflow: hidden;
  text-overflow: ellipsis;

  &--collapsed {
    height: 24px;
  }
}
</style>
