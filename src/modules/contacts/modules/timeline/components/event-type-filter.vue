<template>
  <div class="event-type-filter">
    <wt-checkbox
      :selected="selected"
      @change="changeValue"></wt-checkbox>
    <wt-icon :icon="icon"></wt-icon>
    <p class="event-type-filter__count">({{count}})</p>
  </div>
</template>
<script setup>

const props = defineProps({
  icon: {
    type: String,
  },
  count: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
  },
  selected: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['change']);

function changeValue(value) {
  emit('change', { value, type: props.type });
}

</script>

<style lang="scss" scoped>
.event-type-filter{
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-xs);

  &__count {
    @extend %typo-subtitle-2;
  }
}
</style>
