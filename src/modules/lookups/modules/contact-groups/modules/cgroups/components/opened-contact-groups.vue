<template>
  <wt-page-wrapper :actions-panel="false">
    <template #header>
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
        class="main-container"
        @submit.prevent="save"
      >
        <article class="opened-contact-tabs">
          <wt-tabs
            :current="currentTab"
            :tabs="tabs"
            @change="changeTab"
          />
          <router-view
            class="opened-contact-tab"
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
  import { useVuelidate } from '@vuelidate/core';
  import { required } from '@vuelidate/validators';
  import DeleteConfirmationPopup
    from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
  import {
    useDeleteConfirmationPopup,
  } from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
  import { computed, onMounted, onUnmounted, provide, reactive, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute, useRouter } from 'vue-router';
  import { useAccess } from '../../../../../../../app/composables/useAccess';
  import ContactGroupsRouteNames from "../router/_internals/ContactGroupsRouteNames.enum.js";
  import openedContactGroupsGeneral from './opened-contact-groups-general.vue';
  import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum';
  import { useCardStore } from '@webitel/ui-sdk/src/modules/CardStoreModule/composables/useCardStore';
  import RouteNames from "../../../../../../../app/router/_internals/RouteNames.enum.js";

  const baseNamespace = 'cgroups';

  const router = useRouter();
  const route = useRoute();
  const { t } = useI18n();

  const {
    isVisible: isDeleteConfirmationPopup,
    deleteCount,
    deleteCallback,

    askDeleteConfirmation,
    closeDelete,
  } = useDeleteConfirmationPopup();


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


  const {
    hasObacCreateAccess,
    hasObacEditAccess,
    hasObacDeleteAccess,
  } = useAccess();


  const tabs = computed(() => [
    {
      text: t('objects.general'),
      value: 'general',
      pathName: ContactGroupsRouteNames.GENERAL,
    },
    {
      text: t('vocabulary.permissions', 2),
      value: 'permissions',
      pathName: ContactGroupsRouteNames.PERMISSIONS,
    },
  ]);

  provide('access', computed(() => ({
    hasRbacEditAccess: itemInstance.value?.access?.edit,
    hasRbacDeleteAccess: itemInstance.value?.access?.delete,
  })));

  const isContactPopup = ref(false);

  const isLoading = ref(true);

  const lastBreadcrumbName = ref('');



  async function initializeCard() {
    try {
      isLoading.value = true;

      const { id: itemId } = route.params;
      await setId(itemId);
      await loadItem();

      lastBreadcrumbName.value = itemInstance.value.name;
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
      name: t('lookups.contactGroups.configurations'),
      route: '/configuration',
    },
    {
      name: t('lookups.lookups'),
    },
    {
      name: id.value ? lastBreadcrumbName : t('objects.new'),
    }
  ]);

  function close() {
    // Need to close the tab if you moved from another application
    // https://webitel.atlassian.net/browse/WTEL-4552

    if(window.history.length === 1) return window.close();
    return router.push({ name: RouteNames.CONTACT_GROUPS });
  }

  async function deleteContact(item) {
    await deleteItem(item);
    close();
  }

  const currentTab = computed(() => {
    return tabs.value.find(({ pathName }) => route?.matched?.find(({name}) => name === pathName));
  });

  const getDefaultDraft = () => ({
    name: '',
    description: ''
  });
  const draft = reactive(getDefaultDraft());

  const v$ = useVuelidate(computed(() => ({
    itemInstance: {
      name: { required },
    },
  })), { itemInstance }, { $autoDirty: true });

  v$.value.$touch();

  const disabledSave = computed(() => {
    // return this.checkValidations() || (!this.itemInstance._dirty && !!this.id);
    return (!itemInstance._dirty && !!id);
  });

  function changeTab(tab) {
    return router.push({ name: tab.pathName });
  }


  const shown = ref(false);
  const isSaving = ref(false);

  async function save() {
    isSaving.value = true;
    if (id.value) {
      await updateItem();
    } else {
      console.log('draft new',draft);
      await addItem();
    }

    isSaving.value = false;

    setTimeout(() => {
      close();
    }, 1500);
  }

  function saveText() {
    return !id || itemInstance._dirty
      ? t('objects.save')
      : t('objects.saved')
  }

  onMounted(() => initializeCard());
  onUnmounted(() => resetState());
</script>

<style lang="scss" scoped>
</style>
