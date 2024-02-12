<template>
  <div class="contact-communication-tab emails">

    <communication-popup
      v-if="isCommunicationPopup"
      :item="editedItem"
      :filter-field="EngineCommunicationChannels.Email"
      :label="t('contacts.communications.emails.title')"
      :namespace="namespace"
      channel="email"
      @close="closePopup"
    />

    <delete-confirmation-popup
      v-if="isConfirmationPopup"
      :callback="deleteCallback"
      :delete-count="deleteCount"
      @close="closeDelete"
    />

    <header class="contact-communication-tab-header">
      <wt-icon-action
        :disabled="!access.hasRbacEditAccess"
        action="add"
        @click="isCommunicationPopup = true"
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
            :disabled="!access.hasRbacEditAccess"
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
            :disabled="!access.hasRbacEditAccess"
            action="edit"
            @click="edit(item)"
          />
          <wt-icon-action
            :disabled="!access.hasRbacEditAccess"
            action="delete"
            @click="askDeleteConfirmation({
              deleted: item,
              callback: () => deleteData(item),
            })"
          />
        </template>
      </wt-table>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters';
import { useTableStore } from '@webitel/ui-sdk/src/modules/TableStoreModule/composables/useTableStore';
import DeleteConfirmationPopup
  from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import {
  useDeleteConfirmationPopup,
} from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
import { useStore } from 'vuex';
import dummyLight from '../assets/email-dummy-light.svg';
import dummyDark from '../assets/email-dummy-dark.svg';
import CommunicationPopup from '../../../components/opened-contact-communication-popup.vue';
import { EngineCommunicationChannels } from 'webitel-sdk';

const access = inject('access');

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

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
} = useTableStore(props.namespace);

const { filtersNamespace } = useTableFilters(namespace);

const {
  isVisible: isConfirmationPopup,
  deleteCount,
  deleteCallback,

  askDeleteConfirmation,
  closeDelete,
} = useDeleteConfirmationPopup();

const editedItem = ref(null);
const isCommunicationPopup = ref(false);

const showDummy = computed(() => !dataList.value.length);
const darkMode = computed(() => store.getters['appearance/DARK_MODE']);

function setAsPrimary({ item, index }) {
  return store.dispatch(`${namespace}/SET_AS_PRIMARY`, { item, index });
}

function edit(item) {
  editedItem.value = item;
  isCommunicationPopup.value = true;
}

function closePopup() {
  isCommunicationPopup.value = false;
  editedItem.value = null
}

</script>

<style lang="scss" scoped>
@import '../../_shared/css/contact-communication-tab';
</style>
