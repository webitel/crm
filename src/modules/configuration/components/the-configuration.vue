<template>
  <section class="config-nav">
    <article class="config-nav__wrapper">
      <category-lvl-1
        :categories="categories"
        :selected="selected"
        @select="select"
      >
        <category-lvl-2
          :categories="subcategories"
          class="d-none d-block-xs"
        />
      </category-lvl-1>
      <category-lvl-2
        :categories="subcategories"
        class="d-none-xs"
      />
    </article>
  </section>
</template>

<script>
import navMixin from '../../../app/mixins/crm-start-page/navMixin';
import CategoryLvl1 from './_internals/config-category-lvl-1.vue';
import CategoryLvl2 from './_internals/config-category-lvl-2.vue';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum';

export default {
  name: 'TheConfiguration',
  components: { CategoryLvl1, CategoryLvl2 },
  mixins: [navMixin],
  data: () => ({
    selected: {},
  }),

  computed: {
    categories() {
      return this.navConfiguration.map((navItem) => ({
        ...navItem,
        name: this.$t(`${CrmSections.CONFIGURATION}.${navItem.value}`),
      }));
    },
    subcategories() {
      if (!this.selected.subNav) return [];
      return this.selected.subNav.map((subNav) => {
        const route = `${this.selected.route}/${subNav.route}`;
        const name = this.$t(`${CrmSections.CONFIGURATION}.${subNav.value}`)
        return {
          ...subNav,
          name,
          route,
        };
      });
    },
  },

  mounted() {
    this.initSelected();
  },

  methods: {
    initSelected() {
      this.select(this.categories[0]);
    },
    select(category) {
      this.selected = category;
    },
  },
};
</script>

<style lang="scss" scoped>
  .config-nav {
    --button-min-height: 60px;
    --wrapper-width: 60%;
    --wrapper-height: calc(
      var(--spacing-sm) * 2
      + var(--button-min-height) * 7
      + var(--spacing-2xs) * 6
    );

    --lvl-1-bg: var(--dp-18-surface-color);
    --lvl-1-bg--hover: var(--dp-20-surface-color);
    --lvl-1-bg--selected: var(--primary-color);
    --lvl-1-text--selected: var(--primary-on-color);

  }

  .config-nav {
    display: flex;
    align-items: center;
    flex-grow: 1;
    justify-content: center;
    height: 100%;
  }

  .config-nav__wrapper {
    @extend %wt-scrollbar;

    display: grid;
    box-sizing: border-box;
    width: var(--wrapper-width);
    height: var(--wrapper-height);
    margin: auto;
    padding: var(--spacing-sm);
    border-radius: var(--border-radius);
    background: var(--dp-20-surface-color);
    grid-template-columns: repeat(2, 1fr);
    grid-gap: var(--spacing-sm);
  }
</style>
