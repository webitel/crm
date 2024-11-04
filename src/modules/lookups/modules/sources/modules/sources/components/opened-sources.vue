<template>
  <wt-page-wrapper
    class="opened-card"
    :actions-panel="false"
  >
    <template #header>
      <!--переклади будуть в наступних комітах-->
      <wt-page-header
        :primary-action="save"
        :primary-disabled="!(itemInstance && itemInstance._dirty) || v$.$invalid"
        :primary-text="!id || itemInstance._dirty ? t('objects.save'): t('objects.saved')"
        :secondary-action="close"
        :secondary-text="t('cancel')"
        :loading="isSaving"
      >
        <wt-headline-nav :path="path" />
      </wt-page-header>
    </template>
    <template #main>
      <form
        class="opened-card-form"
        @submit.prevent="save"
      >
        <article class="opened-card-tabs">
          <router-view
            class="opened-card-tabs__tab"
            :namespace="namespace"
          />
        </article>
        <input
          hidden
          type="submit"
        >
      </form>
    </template>
  </wt-page-wrapper>
</template>

<script setup>
  import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum';
  import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose.js';
  import { useCardStore } from '@webitel/ui-sdk/src/modules/CardStoreModule/composables/useCardStore';
  import { computed, onMounted, onUnmounted, provide, reactive, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute, useRouter } from 'vue-router';
  import { useVuelidate } from '@vuelidate/core';
  import { required } from '@vuelidate/validators';
  import { useAccess } from '../../../../../../../app/composables/useAccess';
  import RouteNames from '../../../../../../../app/router/_internals/RouteNames.enum.js';
  import openedContactGroupsGeneral from './opened-sources-general.vue';

  const baseNamespace = 'sources';

  const router = useRouter();
  const route = useRoute();
  const { t } = useI18n();

  const {
    namespace,
    id,
    itemInstance,
    addItem,
    updateItem,
    loadItem,
    setId,
    resetState,
    deleteItem,
  } = useCardStore(baseNamespace);

  const isLoading = ref(true);

  async function initializeCard() {
    try {
      isLoading.value = true;

      const { id: itemId } = route.params;
      await setId(itemId);
      await loadItem();
    } finally {
      setTimeout(() => {
        isLoading.value = false;
      }, 500);
    }
  }

  const path = computed(() => [
    {
      name: t('crm'),
      route: '/start-page',
    },
    {
      name: t('lookups.contactGroups.configurations'), //переклади будуть в наступних комітах
      route: '/configuration',
    },
    {
      name: t('lookups.lookups'), //переклади будуть в наступних комітах
    },
    {
      name: id.value ? itemInstance.value.name : t('objects.new'), //переклади будуть в наступних комітах
    },
  ]);

  const { close } = useClose(RouteNames.SOURCES);

  async function deleteContact(item) {
    await deleteItem(item);
    close();
  }

  const currentTab = computed(() => {
    return tabs.value.find(({ pathName }) => route?.matched?.find(({ name }) => name === pathName));
  });

  const getDefaultDraft = () => ({
    name: '',
    description: '',
    type: '',
  });

  const draft = reactive(getDefaultDraft());

  const v$ = useVuelidate(computed(() => ({
    itemInstance: {
      name: { required },
    },
  })), { itemInstance }, { $autoDirty: true });

  v$.value.$touch();

  const isSaving = ref(false);

  async function save() {
    isSaving.value = true;
    if (id.value) {
      await updateItem();
    } else {
      await addItem();
    }
    isSaving.value = false;

    setTimeout(() => {
      close();
    }, 1500);
  }

  onMounted(() => initializeCard());
  onUnmounted(() => resetState());
</script>
