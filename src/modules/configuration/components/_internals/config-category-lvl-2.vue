<template>
  <ul class="config-nav__category config-nav__category--lvl-2">
    <li
      v-for="(category, key) of categories"
      :key="key"
      class="
            config-nav__category-option__wrapper
            config-nav__category-option
            config-nav__category-option--lvl-2
          "
    >
      <span class="config-nav__category-indicator" />
      <router-link
        :to="category.route"
        class="config-nav__link"
      >
        {{ category.name }}
      </router-link>
    </li>
  </ul>
</template>

<script setup>
  import { defineProps } from 'vue';

  const props = defineProps({
    categories: {
      type: Array,
      default: () => [],
    },
  });
</script>

<style lang="scss" scoped>
@import '../../css/configuration';

.config-nav__category--lvl-2 {
  //@extend %wt-scrollbar;
  overflow-y: scroll;
}

.config-nav__category-option--lvl-2 {
  .config-nav__category-indicator {
    position: relative;
    display: block;
    width: 24px;
    height: 24px;

    &:after {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 4px;
      height: 4px;
      content: '';
      transform: translate(-50%, -50%);
      border-radius: 50%;
      background: var(--text-main-color);
    }
  }
}

.config-nav__link {
  color: var(--text-main-color);
}

.config-nav__link:hover, .config-nav__link:active {
  text-decoration: underline;
}
</style>
