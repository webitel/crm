<template>
  <div class="case-comment">
    <div class="case-comment__icon">
      <wt-icon
        icon="cases"
      />
    </div>
    <div class="case-comment__wrapper">
      <div class="case-comment__header">
        <div class="case-comment__author">
          {{ comment.createdBy.name }}
        </div>
        <div class="case-comment__date">
          {{ prettifyDate(comment.createdAt) }}
        </div>
        <div
          v-if="comment.edited"
          class="case-comment__edited"
        >
          {{ t('cases.comments.edited') }}
        </div>
      </div>
      <div class="case-comment__text">
        {{ comment.text }}
      </div>
    </div>
  </div>

</template>

<script setup>
import { useI18n } from 'vue-i18n';
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
.case-comment {
  display: flex;
  gap: var(--spacing-xs);

  &__header, &__wrapper {
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
