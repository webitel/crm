<template>
  <section class="chat-point-row-content">
    <header class="chat-point-row-content-header">
      <wt-icon-btn
        :icon="collapsed ? 'arrow-right' : 'arrow-down'"
        :disabled="!textRequiresExpansion"
        @click="toggle"
      />
      <timeline-row-initiator
        :text="initiator"
        :type="isInitiatorBot ? TimelineInitiatorType.BOT : TimelineInitiatorType.CONTACT"
      />
    </header>


    <!--    duplicate text elements to add expand/collapse transition -->
    <article
      v-if="point.text && collapsed"
      class="chat-point-row-content-text chat-point-row-content-text--collapsed"
      v-html="collapsedText"
    />

    <timeline-row-dropdown-transition
      v-if="textRequiresExpansion"
    >
      <article
        v-if="point.text && !collapsed"
        class="chat-point-row-content-text"
        v-html="text"
      />
    </timeline-row-dropdown-transition>

    <footer
      v-if="showFooter"
      class="chat-point-row-content-footer"
    >
      <chat-point-timeline-row-file
        :file="point.file"
      />
    </footer>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import purify from 'dompurify';
import linkifyHtml from 'linkify-html';
import TimelineRowDropdownTransition from '../../../../components/utils/timeline-row-dropdown-transition.vue';
import TimelineRowInitiator from '../../../../components/utils/timeline-row-initiator.vue';
import TimelineInitiatorType from '../../../../enums/TimelineInitiatorType.enum.js';
import ChatPointTimelineRowFile from './chat-point-timeline-row-file.vue';

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
  return !!props.point.file;
});

const text = computed(() => {
  return props.point.text ? purify.sanitize(linkifyHtml(props.point.text, {
    className: 'chat-point-row-content-text__link',
  })) : '';
});

const textRequiresExpansion = computed(() => {
  return props.point?.text?.length > 100;
});

const collapsedText = computed(() => {
  return textRequiresExpansion.value ? `${text.value.slice(0, 100)}...` : text.value;
});
</script>

<style lang="scss" scoped>
.chat-point-row-content {
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: var(--spacing-xs);
}

.chat-point-row-content-header,
.chat-point-row-content-footer {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.chat-point-row-content-text {
  word-break: break-all;

  &--collapsed {
    overflow-x: hidden;
    height: 24px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  :deep(.chat-point-row-content-text__link) {
    color: var(--link-color);
    transition: var(--transition);

    &:hover {
      color: var(--link--hover-color);
      text-decoration: underline;
    }
  }
}
</style>
