<template>
  <wt-icon
    v-if="color"
    v-bind="$attrs"
    :class="[
      `wt-icon-wrapper--color-${color}`,
    ]"
    class="wt-icon-wrapper"
  />
</template>

<script setup>
const props = defineProps({
  /**
   * @values 'red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green', 'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange',
   */
  color: {
    type: String,
    required: true,
  },
});

</script>

<style lang="scss">
@use 'variables';
</style>

<style scoped lang="scss">
@mixin set-icon-color($color-var) {
  &.wt-icon {
    :deep(.wt-icon__icon) {
      fill: var($color-var);
    }
  }
}

.wt-icon-wrapper {
  &--color {
    &-green  {
      @include set-icon-color(--icon-color-green);
    }

    &-red {
      @include set-icon-color(--icon-color-red);
    }

    &-pink {
      @include set-icon-color(--icon-color-pink);
    }

    &-purple {
      @include set-icon-color(--icon-color-purple);
    }

    &-deep-purple {
      @include set-icon-color(--icon-color-deep-purple);
    }

    &-indigo {
      @include set-icon-color(--icon-color-indigo);
    }

    &-blue {
      @include set-icon-color(--icon-color-blue);
    }

    &-light-blue {
      @include set-icon-color(--icon-color-light-blue);
    }

    &-cyan {
      @include set-icon-color(--icon-color-cyan);
    }

    &-teal {
      @include set-icon-color(--icon-color-teal);
    }

    &-green {
      @include set-icon-color(--icon-color-green);
    }

    &-light-green {
      @include set-icon-color(--icon-color-light-green);
    }

    &-lime {
      @include set-icon-color(--icon-color-lime);
    }

    &-yellow {
      @include set-icon-color(--icon-color-yellow);
    }

    &-amber {
      @include set-icon-color(--icon-color-amber);
    }

    &-orange {
      @include set-icon-color(--icon-color-orange);
    }

    &-deep-orange {
      @include set-icon-color(--icon-color-deep-orange);
    }
  }
}
</style>
