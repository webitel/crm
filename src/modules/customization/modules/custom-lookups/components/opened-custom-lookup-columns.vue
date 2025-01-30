<template>
  <section class="table-section opened-custom-lookup-columns">
    <header class="opened-card-header">
      <h3 class="opened-card-header__title">
        {{ t('customization.customLookups.columns') }}
      </h3>
      <wt-action-bar
        :include="[IconAction.ADD, IconAction.REFRESH, IconAction.DELETE]"
        :disabled:delete="!selected.length"
        @click:refresh="loadItem"
        @click:delete="
          askDeleteConfirmation({
            deleted: selected,
            callback: () => deleteSelected(selected),
          })
        "
      >
        <template #search-bar>
          <wt-search-bar
            :value="search"
            @input="search = $event"
          />
        </template>
      </wt-action-bar>
    </header>

    <delete-confirmation-popup
      :shown="isDeleteConfirmationPopup"
      :callback="deleteCallback"
      :delete-count="deleteCount"
      @close="closeDelete"
    />

    <div class="table-section__table-wrapper">
      <wt-empty
        v-show="showEmpty"
        :image="imageEmpty"
        :text="textEmpty"
      />

      <wt-loader v-show="isLoading" />

      <div v-if="fields.length && !isLoading">
        <wt-table
          :data="fields"
          :headers="headers"
          :selected="selected"
          sortable
          @update:selected="setSelected"
        >
          <template #title="{ item }">
            {{ item[itemInstance.display] }}
          </template>
          <template #actions="{ item }">
            <wt-icon-btn
              v-if="!item.readonly"
              class="sortable-btn"
              icon="move"
            />
            <!--            TODO Impelemnt edit button when will start working on form for add and edit fields-->
            <!--            <wt-icon-action-->
            <!--              v-if="hasEditAccess"-->
            <!--              action="edit"-->
            <!--              @click="edit(item)"-->
            <!--            />-->
            <wt-icon-action
              v-if="!item.readonly && item.id !== 'name'"
              action="delete"
              @click="
                askDeleteConfirmation({
                  deleted: [item],
                  callback: () => deleteField(item),
                })
              "
            />
          </template>
        </wt-table>
      </div>
    </div>
  </section>
</template>

<script setup>
import IconAction from '@webitel/ui-sdk/src/enums/IconAction/IconAction.enum.js';
import DeleteConfirmationPopup from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import { useDeleteConfirmationPopup } from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup.js';
import { useTableEmpty } from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty.js';
import { useCardStore } from '@webitel/ui-sdk/store';
import Sortable, { Swap } from 'sortablejs';
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
  v: {
    type: Object,
    required: true,
  },
  isNew: {
    type: Boolean,
    required: true,
  },
});

const { t } = useI18n();

const { itemInstance, loadItem, setItemProp } = useCardStore(props.namespace);

const fields = computed(() => {
  if (search.value) {
    return fields.value.filter((field) => {
      return field[itemInstance.value.display]
        .toLowerCase()
        .includes(search.value?.toLowerCase());
    });
  }

  return itemInstance.value.fields;
});

const isLoading = computed(() => !itemInstance.value?.repo);

const search = ref('');

const selected = ref([]);
const setSelected = (selectedElements) => {
  selected.value = selectedElements;
};

const headers = computed(() => {
  return [
    {
      text: t('reusable.title'),
      value: 'title',
    },
    {
      text: t('vocabulary.type'),
      value: 'type',
    },
    {
      text: t('reusable.position'),
      value: 'position',
    },
  ];
});

const sortableConfig = {
  swap: true, // Enable swap mode
  swapClass: 'sortable-swap-highlight', // Class name for swap item (if swap mode is enabled)
  animation: 150, // ms, animation speed moving items when sorting, `0` — without animation
  easing: 'cubic-bezier(1, 0, 0, 1)', // Easing for animation. Defaults to null. See https://easings.net/ for examples.
  filter: (_, rowElement) => {
    const allowDraggable =
      rowElement.getElementsByClassName('sortable-btn')?.length;

    return !allowDraggable; // Prevent draggable if the element has not draggable button
  },
  onMove: function (evt) {
    const preventSwap =
      evt.related.getElementsByClassName('sortable-btn')?.length;

    return !!preventSwap; // Prevent swap if the element has not draggable button
  },
};

let sortableInstance = null;

const initSortable = (wrapper) => {
  if (sortableInstance) {
    sortableInstance.destroy();
    sortableInstance = null;
  }

  sortableInstance = new Sortable(wrapper, {
    ...sortableConfig,

    async onEnd({ oldIndex, newIndex }) {
      // TODO Need continue work with change position for searched items, with some reason we didn't got filtered array by search string
      // Swap items in the array
      if (oldIndex === newIndex) return; // No need to swap if indexes are the same

      const changePositionArray = !search.value
        ? fields.value
        : fields.value.filter((field) => {
            return field[itemInstance.value.display]
              .toLowerCase()
              .includes(search.value?.toLowerCase());
          });

      const movedItem = changePositionArray[newIndex];
      const movedItemPosition = movedItem.position;
      const replaceItem = changePositionArray[oldIndex];
      movedItem.position = replaceItem.position;
      replaceItem.position = movedItemPosition;

      setItemProp({ path: 'fields', value: changePositionArray });
    },
  });
};

function callSortable() {
  setTimeout(() => {
    const wrapper = document.querySelector('.wt-table__body');
    if (wrapper) {
      initSortable(wrapper);
    }
  }, 500);
}

const {
  isVisible: isDeleteConfirmationPopup,
  deleteCount,
  deleteCallback,
  askDeleteConfirmation,
  closeDelete,
} = useDeleteConfirmationPopup();

const deleteField = (field) => {
  const itemIndex = fields.value.findIndex((item) => item.id === field.id);
  fields.value.splice(itemIndex, 1);
  setItemProp({ path: 'fields', value: fields.value });
};

const deleteSelected = (selectedFields) => {
  selectedFields.filter((field) => !field.readonly).forEach(deleteField);

  selected.value = [];
};

// Implemented for correct for table empty composable
const error = computed(() => null);

const {
  showEmpty,
  image: imageEmpty,
  text: textEmpty,
} = useTableEmpty({ dataList: fields, error, isLoading });

watch(fields, () => callSortable());

onMounted(async () => {
  if (!Sortable.__pluginsMounted) {
    Sortable.mount(new Swap());
    Sortable.__pluginsMounted = true;
  }

  callSortable();
});
</script>

<style lang="scss" scoped>
.opened-custom-lookup-columns {
  :deep(.wt-table .sortable-swap-highlight) {
    background: var(--primary-color);
  }
}
</style>
