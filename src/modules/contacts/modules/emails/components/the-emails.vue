<template>
  <div class="contact-communication-tab emails">
    <communication-popup
      :namespace="namespace"
      channel="email"
      @close="closeCommunicationPopup"
    />

    <delete-confirmation-popup
      :shown="isConfirmationPopup"
      :callback="deleteCallback"
      :delete-count="deleteCount"
      @close="closeDelete"
    />

    <header class="contact-communication-tab-header">
      <wt-icon-action
        :disabled="isActionDisabled"
        action="add"
        @click="addCommunication"
      />
    </header>

    <wt-loader v-show="isLoading" />

    <wt-dummy
      v-if="!isLoading && showDummy"
      :src="darkMode ? dummyDark : dummyLight"
      :text="t('contacts.communications.emails.dummy')"
    />

    <div
      v-show="!isLoading && !showDummy"
      class="table-wrapper"
    >
      <wt-table
        :headers="headers"
        :data="dataList"
        :selectable="false"
        sortable
        @sort="sort"
      >
        <template #primary="{ item, index }">
          <wt-icon
            v-if="item.primary"
            icon="tick"
            color="success"
          />
          <wt-icon-btn
            v-else
            :disabled="isActionDisabled"
            class="set-primary-btn"
            icon="tick"
            @click="setAsPrimary({ item, index })"
          />
        </template>
        <template #type="{ item }">
          {{ item.type.name }}
        </template>
        <template #actions="{ item, index }">
          <wt-icon-action
            :disabled="isActionDisabled"
            action="edit"
            @click="editCommunication(item)"
          />
          <wt-icon-action
            :disabled="isActionDisabled"
            action="delete"
            @click="
              askDeleteConfirmation({
                deleted: item,
                callback: () => deleteData(item),
              })
            "
          />
        </template>
      </wt-table>
    </div>
  </div>
</template>

<script setup>
import DeleteConfirmationPopup from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import { useDeleteConfirmationPopup } from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters';
import { useTableStore } from '@webitel/ui-sdk/src/modules/TableStoreModule/composables/useTableStore';
import { computed, inject, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

import CommunicationPopup from '../../../components/opened-contact-communication-popup.vue';
import dummyDark from '../assets/email-dummy-dark.svg';
import dummyLight from '../assets/email-dummy-light.svg';

const access = inject('access');
const isReadOnly = inject('isReadOnly');

const isActionDisabled = computed(
	() => !access.value.hasRbacEditAccess || isReadOnly,
);

const props = defineProps({
	namespace: {
		type: String,
		required: true,
	},
});

const router = useRouter();
const route = useRoute();
const store = useStore();
const { t } = useI18n();

const {
	namespace,

	dataList,
	isLoading,
	headers,
	error,

	patchProperty,
	deleteData,
	sort,
	onFilterEvent,
} = useTableStore(props.namespace);

const { subscribe, flushSubscribers, restoreFilters } =
	useTableFilters(namespace);

subscribe({
	event: '*',
	callback: onFilterEvent,
});

restoreFilters();

onUnmounted(() => {
	flushSubscribers();
});

const {
	isVisible: isConfirmationPopup,
	deleteCount,
	deleteCallback,

	askDeleteConfirmation,
	closeDelete,
} = useDeleteConfirmationPopup();

const showDummy = computed(() => !dataList.value.length);
const darkMode = computed(() => store.getters['appearance/DARK_MODE']);

function setAsPrimary({ item, index }) {
	return store.dispatch(`${namespace}/SET_AS_PRIMARY`, {
		item,
		index,
	});
}

function addCommunication() {
	return router.push({
		...route,
		params: {
			commId: 'new',
		},
	});
}

function editCommunication({ id }) {
	return router.push({
		...route,
		params: {
			commId: id,
		},
	});
}

function closeCommunicationPopup() {
	const params = {
		...route.params,
	};
	delete params.commId;

	return router.push({
		...route,
		params,
	});
}
</script>

<style lang="scss" scoped>
@use '../../_shared/css/contact-communication-tab';
</style>
