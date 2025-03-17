<template>
  <article class="case-comment-row">
    <wt-icon icon="comment" />
    <section class="case-comment-info">
      <header class="case-comment-header">
        <p class="case-comment-author">
          {{ comment.createdBy?.name }}
        </p>
        <p>
          {{ prettifyDate(comment.createdAt) }}
        </p>
        <p v-if="comment.edited">
          {{ t('cases.comments.edited') }}
        </p>
      </header>
      <p>
        {{ comment.text }}
      </p>
    </section>
  </article>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

import ColorComponentWrapper from '../../../../../app/components/utils/color-component-wrapper.vue';
import prettifyDate from '../../../utils/prettifyDate.js';

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
});

const { t } = useI18n();
</script>

<style lang="scss" scoped>
@use '@webitel/ui-sdk/src/css/main' as *;

.case-comment-row {
  display: flex;
  gap: var(--spacing-xs);
}

.case-comment-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.case-comment-header {
  display: flex;
  gap: var(--spacing-xs);
}

.case-comment-author {
  @extend %typo-body-1;
  font-weight: bold; // rm and refactor extended typo to typo-body bold when it's ready
}
</style>
