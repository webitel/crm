<template>
  <div class="email-point-timeline-subject">

    <wt-divider />

    <div>
      <p
        v-if="subject"
        class="email-point-timeline-subject__title"
      >{{ t('timeline.emails.subject') }}:
        <span>{{ props.subject }}</span>
      </p>
      <p
        v-if="content && opened"
        v-html="content"></p>
    </div>
  </div>
</template>

<script setup>
import dompurify from 'dompurify';
import MarkdownIt from 'markdown-it';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const md = new MarkdownIt({ linkify: true, html: true });

const props = defineProps({
  subject: {
    type: Object,
    required: true,
  },
  body: {
    type: String,
  },
  opened: {
    type: Boolean,
    default: false,
  },
});

const { t } = useI18n();

const content = computed(() => {
  return dompurify.sanitize(md.render(props.body));
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
