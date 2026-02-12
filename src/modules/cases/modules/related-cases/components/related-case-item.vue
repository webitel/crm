<template>
  <div class="related-case-item">
    <color-component-wrapper
      :color="props.color"
      component="wt-icon"
      icon="cases"
      size="md"
    />

    <span class="related-case-item__name">{{ props.name }}</span>

    <span class="related-case-item__subject">
      {{ props.subject }}
    </span>

    <span
      v-if="props.relationType"
      class="related-case-item__type"
    >
      {{ props.relationType }}
    </span>
  </div>
</template>

<script setup lang="ts">
import ColorComponentWrapper from '../../../../../app/components/utils/color-component-wrapper.vue';

const props = defineProps({
	color: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	subject: {
		type: String,
		required: true,
	},
	relationType: {
		type: String,
		default: '',
	},
});
</script>

<style scoped lang="scss">
.related-case-item {
  display: grid;
  align-items: start;
  width: 100%;
  grid-gap: var(--spacing-xs);
  grid-template-columns: auto 120px 1fr;

  &__name {
  }

  &__subject {
    display: inline;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
  }
}
</style>
