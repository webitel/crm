<template>
  <wt-page-wrapper
    :actions-panel="false"
    :hide-header="isReadOnly"
    class="opened-contact"
  >
    <template #header>
      <wt-page-header
        :secondary-action="close"
        hide-primary
      >
        <wt-breadcrumb :path="path" />
        <template #actions>
          <div id="page-header-actions" />
        </template>
      </wt-page-header>
    </template>
    <template #main>
      <wt-loader v-if="isLoading" />
      <div
        v-else
        style="display: contents"
      >
        <contact-popup
          :id="id"
          :shown="isContactPopup"
          :namespace="baseNamespace"
          @saved="loadItem"
          @close="isContactPopup = false"
        />
        <delete-confirmation-popup
          v-show="isDeleteConfirmationPopup"
          :delete-count="deleteCount"
          :callback="deleteCallback"
          @close="closeDelete"
        />
        <div class="opened-contact-content">
          <opened-contact-general
            :name="itemInstance.name"
            :timezones="itemInstance.timezones ? itemInstance.timezones : []"
            :managers="itemInstance.managers ? itemInstance.managers : []"
            :groups="itemInstance.groups"
            :user="itemInstance.user"
            :about="itemInstance.about"
            :labels="itemInstance.labels ? itemInstance.labels : []"
            @edit="isContactPopup = true"
            @delete="
              askDeleteConfirmation({
                deleted: [itemInstance],
                callback: () => deleteContact(itemInstance),
              })
            "
          />
          <opened-contact-tabs :namespace="namespace" />
        </div>
      </div>
    </template>
  </wt-page-wrapper>
</template>

<script setup>
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose.js';
import { useCardStore } from '@webitel/ui-sdk/src/modules/CardStoreModule/composables/useCardStore';
import DeleteConfirmationPopup from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import { useDeleteConfirmationPopup } from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
import { computed, inject, onMounted, onUnmounted, provide, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { ErrorRedirectMap } from '../../error-pages/enems/ErrorRedirectMap.enum.js';

import ContactPopup from './contact-popup.vue';
import OpenedContactGeneral from './opened-contact-general.vue';
import OpenedContactTabs from './opened-contact-tabs.vue';

const baseNamespace = 'contacts';
const isReadOnly = inject('isReadOnly');

const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const {
  namespace,
  id,
  itemInstance,

  loadItem,
  setId,
  resetState,
  deleteItem,
} = useCardStore(baseNamespace, { errorRedirectMap: ErrorRedirectMap });

provide(
  'access',
  computed(() => ({
    hasRbacEditAccess: itemInstance.value?.access?.edit,
    hasRbacDeleteAccess: itemInstance.value?.access?.delete,
  })),
);

const {
  isVisible: isDeleteConfirmationPopup,
  deleteCount,
  deleteCallback,

  askDeleteConfirmation,
  closeDelete,
} = useDeleteConfirmationPopup();

const isContactPopup = ref(false);

const isLoading = ref(true);

const path = computed(() => {
  const baseUrl = '/contacts';

  return [
    { name: t('crm'), route: '/start-page' },
    { name: t('contacts.contact', 2), route: baseUrl },
    {
      name: itemInstance.value?.name || 'Contact',
      route: `/contacts/${id.value}`,
    },
  ];
});

async function initializeCard() {
  try {
    isLoading.value = true;

    const { id: itemId } = route.params;
    await setId(itemId);
    await loadItem();

    /**
     * @author Oleksandr Palonnyi
     *
     * [WTEL-6929](https://webitel.atlassian.net/browse/WTEL-6929)
     *
     * we need to set parentId as itemInstance.id because in readOnly mode we have etag instead of id in route params
     * and the rest of request do not work with etag
     *
     * */
    if (isReadOnly) {
      await setId(itemInstance.value?.id);
    }
  } finally {
    setTimeout(() => {
      isLoading.value = false;
    }, 500);
  }
}

const { close } = useClose('contacts');

async function deleteContact(item) {
  await deleteItem(item);
  close();
}

onMounted(() => initializeCard());
onUnmounted(() => resetState());
</script>

<style lang="scss" scoped>
.opened-contact {
  &-content {
    flex-grow: 1;
    display: flex;
    gap: var(--spacing-sm);
    min-height: 0;
    max-width: 100%;
  }

  &-general {
    flex: 0 0 250px;
  }

  &-tabs {
    flex: 1 1 auto;
  }
}
</style>
