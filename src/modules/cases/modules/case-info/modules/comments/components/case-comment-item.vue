<template>
  <div class="case-comment-item">
    <div class="case-comment-item__icon">
      <color-component-wrapper
        :color="comment.color"
        component="wt-icon"
        icon="cases"
        size="md"
      />
    </div>
    <div class="case-comment-item__wrapper">
      <div class="case-comment-item__header">
        <div class="case-comment-item__author">
          {{ comment.createdBy.name }}
        </div>
        <div class="case-comment-item__date">
          {{ prettifyDate(comment.createdAt) }}
        </div>
        <div
          v-if="comment.edited"
          class="case-comment-item__edited"
        >
          {{ t('cases.comments.edited') }}
        </div>
      </div>
      <div class="case-comment-item__text">
        {{ comment.text }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

import ColorComponentWrapper from '../../../../../../../app/components/utils/color-component-wrapper.vue';
import prettifyDate from '../../../../../utils/prettifyDate.js';

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
});

const { t } = useI18n();
</script>

<style lang="scss" scoped>
.case-comment-item {
  display: flex;
  gap: var(--spacing-xs);

  &__header,
  &__wrapper {
    display: flex;
    gap: var(--spacing-xs);
  }

  &__wrapper {
    flex-direction: column;
  }

  &__author {
    //TODO: use typo-body bold when it's ready
    @extend %typo-body-1;
    font-weight: bold;
  }
}
</style>
