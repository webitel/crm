<template>
  <div class="contact-communication-tab phones">
    <communication-popup
      v-if="editedItem"
      :edited-instance="editedItem"
      :callback="updatePhone"
      @close="editedItem = null"
    ></communication-popup>

    <delete-confirmation-popup
      v-if="isConfirmationPopup"
      :callback="deleteCallback"
      :delete-count="deleteCount"
      @close="closeDelete"
    ></delete-confirmation-popup>

    <wt-loader v-show="isLoading"></wt-loader>

    <wt-dummy
      v-if="!isLoading && showDummy"
      :src="darkMode ? dummyDark : dummyLight"
      :text="t('contacts.communications.phones.dummy')"
    ></wt-dummy>

    <div v-show="!isLoading && !showDummy" class="table-wrapper">
      <wt-table
        :headers="headers"
        :data="dataList"
        :selectable="false"
        sortable
        @sort="sort"
      >
        <template v-slot:primary="{ item, index }">
          <wt-icon
            v-if="item.primary"
            icon="tick"
            color="success"
          ></wt-icon>
          <wt-icon-btn
            v-else
            :disabled="!access.hasRbacEditAccess"
            class="set-primary-btn"
            icon="tick"
            @click="setAsPrimary({ item, index })"
          ></wt-icon-btn>
        </template>
        <template v-slot:type="{ item }">
          {{ item.type.name }}
        </template>
        <template v-slot:actions="{ item, index }">
          <wt-icon-action
            :disabled="!access.hasRbacEditAccess"
            action="edit"
            @click="editedItem = item"
          ></wt-icon-action>
          <wt-icon-action
            :disabled="!access.hasRbacEditAccess"
            action="delete"
            @click="askDeleteConfirmation({
              deleted: item,
              callback: () => deleteData(item),
            })"
          ></wt-icon-action>
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
import dummyLight from '../assets/phone-dummy-light.svg';
import dummyDark from '../assets/phone-dummy-dark.svg';
import CommunicationPopup from '../../../components/opened-contact-communication-popup.vue';

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

const showDummy = computed(() => !dataList.value.length);
const darkMode = computed(() => store.getters['appearance/DARK_MODE']);

function setAsPrimary({ item, index }) {
  return store.dispatch(`${namespace}/SET_AS_PRIMARY`, { item, index });
}

function updatePhone({ channel, destination, ...rest }) {
  const itemInstance = { ...rest, [channel]: destination };
  return store.dispatch(`${namespace}/UPDATE_PHONE`, {
    itemInstance,
    etag: editedItem.value.etag,
  });
}
</script>

<style lang="scss" scoped>
@import '../../_shared/css/contact-communication-tab';
</style>
