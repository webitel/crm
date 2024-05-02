<template>
  <div class="chat-point-timeline-row-file">
    <wt-icon
      icon="attach"
    />
    <span class="chat-point-timeline-row-file__name">
      {{ filename }}
    </span>
  </div>
</template>

<script setup>

const props = defineProps({
  file: {
    type: Object,
    required: true,
  },
});

const filename = computed(() => {
  return `${props.file.name}.${props.file.type}`;
});
</script>

<style scoped lang="scss">
.chat-point-timeline-row-file {
  display: flex;
  align-items: center;
  gap: var(--spacing-3xs);

  &__name {
  }
}
</style>
