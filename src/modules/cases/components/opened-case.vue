<template>
  <wt-dual-panel
    :actions-panel="false"
    class="opened-case"
  >
    <template #header>
      <wt-page-header
        :hide-primary="!isNew && !editMode"
        :primary-action="saveCase"
        :primary-text="t('reusable.save')"
        :secondary-action="close"
      >
        <wt-headline-nav :path="path" />

        <template #actions>
          <wt-button
            v-if="!isNew && !editMode"
            color="secondary"
            @click="toggleEditMode(true)"
          >
            {{ t('reusable.edit') }}
          </wt-button>
        </template>
      </wt-page-header>
    </template>
    <template #side-panel>
      {{ editMode }}
      <opened-case-general />
    </template>
    <template #main>
      <opened-case-tabs :namespace="namespace" />
    </template>
  </wt-dual-panel>
</template>

<script setup>
import { useCardComponent } from '@webitel/ui-sdk/src/composables/useCard/useCardComponent.js';
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose.js';
import { useCardStore } from '@webitel/ui-sdk/src/modules/CardStoreModule/composables/useCardStore.js';
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import OpenedCaseGeneral from './opened-case-general.vue';
import OpenedCaseTabs from './opened-case-tabs.vue';
import { useStore } from 'vuex';

const namespace = 'cases';

const store = useStore();
const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const {
  namespace: cardNamespace,
  id,
  itemInstance,

  loadItem,
  addItem,
  updateItem,
  setId,
  resetState,
  deleteItem,

} = useCardStore(namespace);

const {
  isNew,
  save,
  initialize,
} = useCardComponent({
  id,
  itemInstance,
  loadItem,
  addItem,
  updateItem,
  setId,
  resetState,
});

const { close } = useClose('cases');

const path = computed(() => {
  const baseUrl = '/cases';

  return [
    { name: t('crm') },
    {
      name: t('cases.case', 2),
      route: baseUrl,
    },
    {
      // TODO: replace itemInstance.value?.id with item.name when it will be available from API
      name: id.value ? `${itemInstance.value?.id} ${itemInstance.value?.subject}` : t('reusable.new'),
      route: {
        name: router.currentRoute.name,
        query: router.currentRoute.query,
      },
    },
  ];
});

const editMode = computed(() => store.getters[`${cardNamespace}/EDIT_MODE`]);

const toggleEditMode = (value) => {
  store.dispatch(`${cardNamespace}/TOGGLE_EDIT_MODE`, value);

  router.replace({
    name: route.name,
    query: {
      ...route.query,
      edit: value ? true : null,
    },
  });
};

const saveCase = () => {
  toggleEditMode(false);
  save();
};

const initializeEditMode  = () => {
  if (isNew.value || route.query.edit) {
    toggleEditMode(true);
  } else {
    toggleEditMode(false);
  }
};

onMounted(() => {
  initializeEditMode();
});

initialize();
</script>

<style lang="scss" scoped>
</style>
