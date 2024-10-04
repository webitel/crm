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

<script setup>
  import CrmConfigurationSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmConfigurationSections.enum';
  import { ref, computed, onMounted } from 'vue';
  import CategoryLvl1 from './_internals/config-category-lvl-1.vue';
  import CategoryLvl2 from './_internals/config-category-lvl-2.vue';
  import { useI18n } from 'vue-i18n';
  import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum';

  const { t } = useI18n();
  const selected = ref({});
  const navItems = ref([{
    value: CrmConfigurationSections.LOOKUPS,
    route: '/lookups',
    name: 'Lookups',
    subNav: [
      {
        value: CrmConfigurationSections.CONTACT_GROUPS,
        name: "Contact groups",
        route: "contact-groups",
      },
      {
        value: CrmConfigurationSections.SOURCES,
        name: "Sources",
        route: "sources",
      },
    ],

  }]
  )
  const categories = computed(() => {
    return navItems.value.map((navItem) => ({
      ...navItem,
      name: t(`${CrmSections.CONFIGURATION}.${navItem.value}`),
    }));
  });

  const subcategories = computed(() => {
    if (!selected.value.subNav) return [];
    return selected.value.subNav.map((subNav) => {
      const route = `${selected.value.route}/${subNav.route}`;
      console.log(t(`${CrmSections.CONFIGURATION}.${subNav.value}`));
      const name = t(`${CrmSections.CONFIGURATION}.${subNav.value}`);
      return {
        ...subNav,
        name,
        route,
      };
    });
  });

  onMounted(() => {
    initSelected();
  });

  function initSelected() {
    select(categories.value[0]);
  }

  function select(category) {
    selected.value = category;
  }
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
