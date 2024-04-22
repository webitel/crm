 <template>
  <div class="timeline-task-filter">
    <wt-checkbox
      :selected="selected"
      @change="changeValue"></wt-checkbox>
    <wt-icon :icon="icon"></wt-icon>
    <p class="timeline-task-filter__count">({{count}})</p>
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
.timeline-task-filter{
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-xs);

  &__count {
    @extend %typo-subtitle-2;
  }
}
</style>
