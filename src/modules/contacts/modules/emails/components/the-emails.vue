<template>
  <div class="emails">
    <communication-popup
      v-if="editedItem"
      :edited-instance="editedItem"
      :callback="updateEmail"
      @close="editedItem = null"
    ></communication-popup>

    <wt-loader v-show="isLoading"></wt-loader>

    <wt-dummy
      v-if="!isLoading && showDummy"
    ></wt-dummy>

    <div v-show="!isLoading && !showDummy" class="table-wrapper">
      <wt-table
        :headers="headers"
        :data="dataList"
        :grid-actions="hasEditAccess || hasDeleteAccess"
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
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters';
import { useTableStore } from '@webitel/ui-sdk/src/modules/TableStoreModule/composables/useTableStore';
import { useStore } from 'vuex';
import { useAccess } from '../../../../../app/composables/useAccess';
import CommunicationPopup from '../../../components/opened-contact-communication-popup.vue';

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

  deleteData,
  sort,
} = useTableStore(props.namespace);

const {
  hasCreateAccess,
  hasEditAccess,
  hasDeleteAccess,
} = useAccess();

const { filtersNamespace } = useTableFilters(namespace);

const editedItem = ref(null);

const showDummy = computed(() => !dataList.value.length);

const actionOptions = computed(() => {
  return [
    { text: t('reusable.edit'), handler: ({ item }) => editedItem.value = item },
  ];
});

function updateEmail(draft) {
  return store.dispatch(`${namespace}/UPDATE_EMAIL`, {
    itemInstance: draft,
    etag: editedItem.value.etag,
  });
}
</script>

<style lang="scss" scoped>

</style>
