<template>
  <div class="phones">
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
    ></wt-dummy>

    <div v-show="!isLoading && !showDummy" class="table-wrapper">
      <wt-table
        :headers="headers"
        :data="dataList"
        :grid-actions="access.hasRbacEditAccess"
        :selectable="false"
        sortable
        @sort="sort"
      >
        <template v-slot:primary="{ item }">
          <wt-icon
            v-if="item.primary"
            icon="tick"
            color="success"
          ></wt-icon>
          <div v-else></div>
        </template>
        <template v-slot:type="{ item }">
          {{ item.type.name }}
        </template>
        <template v-slot:actions="{ item, index }">
          <wt-context-menu
            class="opened-contact-general-options"
            :options="actionOptions"
            @click="$event.option.handler({ item, index })"
          >
            <template v-slot:activator>
              <wt-tooltip>
                <template v-slot:activator>
                  <wt-icon-btn
                    icon="options"
                  ></wt-icon-btn>
                </template>
                {{ t('vocabulary.options', 2) }}
              </wt-tooltip>
            </template>
          </wt-context-menu>
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

const actionOptions = computed(() => {
  return [
    {
      text: t('contacts.communications.setAsPrimary'),
      handler: ({ item, index }) => setAsPrimary({ item, index }),
    },
    {
      text: t('reusable.edit'),
      handler: ({ item }) => editedItem.value = item,
    },
    {
      text: t('reusable.delete'),
      handler: ({ item }) => askDeleteConfirmation({
        deleted: item,
        callback: () => deleteData(item),
      }),
    },
  ];
});

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

</style>
