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
          :id="contactId"
          :shown="isContactPopup"
          @saved="onContactSaved"
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
            :model-value="originalItemInstance"
            @edit="isContactPopup = true"
            @delete="
              askDeleteConfirmation({
                deleted: [originalItemInstance],
                callback: deleteContact,
              })
            "
          />
          <opened-contact-tabs />
        </div>
      </div>
    </template>
  </wt-page-wrapper>
</template>

<script setup lang="ts">
import { ContactsAPI } from '@webitel/api-services/api';
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose';
import DeleteConfirmationPopup from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import { useDeleteConfirmationPopup } from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
import { type StoreGeneric, storeToRefs } from 'pinia';
import { computed, onMounted, onUnmounted, provide, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import { useErrorRedirectHandler } from '../../error-pages/composable/useErrorRedirectHandler';
import { useContactEditAccessControl } from '../composables/useContactEditAccessControl';
import { useContactCardStore } from '../stores/card/contactCardStore';
import ContactPopup from './contact-popup.vue';
import OpenedContactGeneral from './opened-contact-general.vue';
import OpenedContactTabs from './opened-contact-tabs.vue';

const { isReadOnly } = useContactEditAccessControl();

const route = useRoute();
const { t } = useI18n();
const { handleError } = useErrorRedirectHandler();

const contactCardStore = useContactCardStore();
const { itemId, originalItemInstance } = storeToRefs(
	contactCardStore as unknown as StoreGeneric,
);
const { initialize: initializeContactCard, $reset: resetContactCard } =
	contactCardStore;
const contactId = computed(() => itemId.value as string | null);

const isLoading = ref(true);

provide(
	'access',
	computed(() => ({
		hasRbacEditAccess: originalItemInstance.value?.access?.edit,
		hasRbacDeleteAccess: originalItemInstance.value?.access?.delete,
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

const path = computed(() => {
	const baseUrl = '/contacts';

	return [
		{
			name: t('crm'),
			route: '/start-page',
		},
		{
			name: t('contacts.contact', 2),
			route: baseUrl,
		},
		{
			name: originalItemInstance.value?.name || 'Contact',
			route: `/contacts/${itemId.value}`,
		},
	];
});

async function initializeCard() {
	try {
		isLoading.value = true;

		await initializeContactCard({
			itemId: route.params.id as string,
		});

		if (isReadOnly && originalItemInstance.value?.id) {
			itemId.value = originalItemInstance.value.id;
		}
	} catch (err) {
		handleError(err);
	} finally {
		setTimeout(() => {
			isLoading.value = false;
		}, 500);
	}
}

const { close } = useClose('contacts');

async function deleteContact() {
	await ContactsAPI.delete({
		id: itemId.value,
	});
	close();
}

function onContactSaved() {
	isContactPopup.value = false;
}

onMounted(() => initializeCard());
onUnmounted(() => {
	resetContactCard();
});
</script>

<style lang="scss" scoped>
.opened-contact {
  height: 100%;

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
