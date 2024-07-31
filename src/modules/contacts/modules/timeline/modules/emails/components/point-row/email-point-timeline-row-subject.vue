<template>
  <div class="email-point-timeline-subject">

    <wt-divider />

    <div>
      <p class="email-point-timeline-subject__title">{{ t('contacts.timeline.emails.subject') }}:</p>
      <p v-html="content"></p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import MarkdownIt from 'markdown-it';
import dompurify from 'dompurify';

const md = new MarkdownIt({ linkify: true, html: true });

const props = defineProps({
  subject: {
    type: Object,
    required: true,
  },
});

const { t } = useI18n();

const content = computed(() => {
  return dompurify.sanitize(md.render(props.subject));
});
</script>

<style scoped lang="scss">
.email-point-timeline-subject {
  display: flex;
  gap: var(--spacing-xs);
  flex-direction: column;

  &__title {
    @extend %typo-subtitle-1;
  }
}
</style>
