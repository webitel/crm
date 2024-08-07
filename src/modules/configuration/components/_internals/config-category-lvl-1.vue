<template>
  <ul class="config-nav__category config-nav__category--lvl-1">
    <li
      v-for="(category, key) of categories"
      :key="key"
      class="config-nav__category-option__wrapper"
    >
      <button
        :class="{ 'config-nav__category-option--selected': selected.value === category.value }"
        class="config-nav__category-option config-nav__category-option--lvl-1"
        @click="select(category)"
      >
        <wt-icon
          :color="selected.value === category.value ? 'on-primary' : 'default'"
          :icon="category.value"
          icon-prefix="conf"
        />
        {{ category.name }}
      </button>
      <div>
        <slot />
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'StartCategoryLvl1',
  props: {
    categories: {
      type: Array,
      default: () => [],
    },
    selected: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    select(category) {
      this.$emit('select', category);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../css/configuration';

.config-nav__category-option--lvl-1 {
  background: var(--lvl-1-bg);

  &:hover {
    background: var(--lvl-1-bg--hover);
  }

  &.config-nav__category-option--selected {
    color: var(--lvl-1-text--selected);
    background: var(--lvl-1-bg--selected);
  }
}
</style>
