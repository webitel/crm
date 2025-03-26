<template>
  <wt-page-wrapper
    class="opened-contact"
    :actions-panel="false"
  >
    <template #header>
      <wt-page-header
        :secondary-action="close"
        hide-primary
      >
        <wt-headline-nav :path="path" />
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
import { computed, onMounted, onUnmounted, provide, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import ContactPopup from './contact-popup.vue';
import OpenedContactGeneral from './opened-contact-general.vue';
import OpenedContactTabs from './opened-contact-tabs.vue';

const baseNamespace = 'contacts';

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
} = useCardStore(baseNamespace);

const {
  isVisible: isDeleteConfirmationPopup,
  deleteCount,
  deleteCallback,

  askDeleteConfirmation,
  closeDelete,
} = useDeleteConfirmationPopup();

provide(
  'access',
  computed(() => ({
    hasRbacEditAccess: itemInstance.value?.access?.edit,
    hasRbacDeleteAccess: itemInstance.value?.access?.delete,
  })),
);

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
.opened-contact-content {
  flex-grow: 1;
  display: flex;
  gap: var(--spacing-sm);
  min-height: 0;

  .opened-contact-general {
    flex: 0 0 250px;
  }

  .opened-contact-tabs {
    flex: 1 1 auto;
  }
}
</style>
