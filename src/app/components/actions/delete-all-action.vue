<template>
  <div class="delete-all-action">
    <wt-tooltip>
      <template #activator>
        <wt-icon-btn
          class="icon-action"
          icon="bucket"
          v-bind="$attrs"
          @click="emitClick"
        />
      </template>
      {{ actionPanelDeleteTooltip }}
    </wt-tooltip>
  </div>
</template>

<script setup>
  import { computed, defineProps, defineEmits } from 'vue';
  import { useI18n } from 'vue-i18n';

  const props = defineProps({
    selectedCount: {
      type: Number,
    },
  });

  const emit = defineEmits(['click']);
  const { t } = useI18n();

  const emitClick = () => {
    emit('click');
  };

  const actionPanelDeleteTooltip = computed(() => {
    return props.selectedCount
      ? t('iconHints.deleteSelected', { count: props.selectedCount })
      : t('iconHints.deleteAll');
  });
</script>

<style lang="scss" scoped>
.delete-all-action {
  line-height: 0;
}
</style>
