<template>
  <section class="table-section opened-custom-lookup-columns">
    <header class="opened-card-header">
      <h3 class="opened-card-header__title">
        {{ title || t('customization.customLookups.columns') }}
      </h3>
      <wt-action-bar
        :include="[IconAction.ADD, IconAction.DELETE]"
        :disabled:delete="!selected.length"
        @click:add="showAddFieldPopup = true"
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
    >
      <template #deleteMessage>
        {{ t('customization.customLookups.confirmDeleteColumn') }}
      </template>
    </delete-confirmation-popup>

    <div class="table-section__table-wrapper">
      <wt-empty
        v-if="showEmpty"
        :image="imageEmpty"
        :headline="emptyHeadline"
        :title="emptyTitle"
        :text="textEmpty"
        :primary-action-text="emptyPrimaryActionText"
        @click:primary="showAddFieldPopup = true"
      />

      <wt-loader v-show="isLoading" />

      <div v-if="!showEmpty && !isLoading">
        <wt-table
          :data="fields"
          :headers="headers"
          :selected="selected"
          sortable
          @update:selected="setSelected"
        >
          <template #title="{ item }">
            {{ t(item?.name ?? 'reusable.title') }}
          </template>
          <template #type="{ item }">
            {{ t(`customization.customLookups.fieldType.${item.kind}`) }}
          </template>
          <template #actions="{ item }">
            <template v-if="!isSystemField(item)">
              <wt-icon-btn
                class="sortable-btn"
                icon="move"
              />
              <wt-icon-action
                action="edit"
                @click="edit(item)"
              />
              <wt-icon-action
                action="delete"
                @click="
                  askDeleteConfirmation({
                    deleted: [item],
                    callback: () => deleteField(item),
                  })
                "
              />
            </template>
          </template>
        </wt-table>
      </div>
    </div>

    <!--    TODO With some reason validation from this popup using on validate all ItemInstance, need investigate why this happening, for now use v-if to work correct for add and update field -->
    <field-popup
      v-if="showAddFieldPopup"
      :shown="showAddFieldPopup"
      @close="showAddFieldPopup = false"
      @save="addNewField"
    />
    <field-popup
      v-if="showEditFieldPopup"
      :shown="showEditFieldPopup"
      :field="editItem"
      @close="showEditFieldPopup = false"
      @save="editField"
    />
  </section>
</template>

<script setup>
import { WtEmpty } from '@webitel/ui-sdk/components';
import IconAction from '@webitel/ui-sdk/src/enums/IconAction/IconAction.enum.js';
import DeleteConfirmationPopup
  from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import {
  useDeleteConfirmationPopup,
} from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup.js';
import {
  useTableEmpty,
} from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty.js';
import WtTable from '@webitel/ui-sdk/src/components/wt-table/wt-table.vue';
import { useCardStore } from '@webitel/ui-sdk/store';
import deepCopy from 'deep-copy';
import Sortable, { Swap } from 'sortablejs';
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import FieldPopup from './field-popup.vue';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
  v: {
    type: Object,
    required: true,
  },
  // eslint-disable-next-line vue/require-default-prop
  title: {
    type: String,
  },
  isNew: {
    type: Boolean,
    required: true,
  },
});

const { t } = useI18n();

const { itemInstance, loadItem, setItemProp } = useCardStore(props.namespace);

const sortFields = (fields) => {
  const unSortableFields = fields.filter((field) => !field.position);

  fields
  .filter((field) => field.position)
  .sort((a, b) => {
    return a.position - b.position;
  })
  .splice(1, 0, ...unSortableFields);

  return fields;
};

const fields = computed(() => {
  if (search.value) {
    return sortFields(
      itemInstance.value?.fields.filter((field) => {
        return field.name?.toLowerCase().includes(search.value?.toLowerCase());
      }),
    );
  }

  return sortFields(itemInstance.value?.fields);
});

const isLoading = ref(!itemInstance.value?.repo);

const refreshItem = async () => {
  try {
    isLoading.value = true;
    await loadItem();
  } finally {
    isLoading.value = false;
  }
};

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

const isSystemField = (field) => field.id === 'name' || field.readonly;

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
  onMove: function(evt) {
    const preventSwap =
      evt.related.getElementsByClassName('sortable-btn')?.length;

    return !!preventSwap; // Prevent swap if the element has not draggable button
  },
};

let sortableInstance = null;

const getFieldsForSortable = () => {
  return !search.value
    ? itemInstance.value.fields
    : itemInstance.value.fields.filter((field) => {
      return field.name.toLowerCase().includes(search.value?.toLowerCase());
    });
};

const initSortable = (wrapper) => {
  if (sortableInstance) {
    sortableInstance.destroy();
    sortableInstance = null;
  }

  sortableInstance = new Sortable(wrapper, {
    ...sortableConfig,

    async onEnd({ oldIndex, newIndex }) {
      // change value to true for hide table and trigger re-render table with new positions items
      isLoading.value = true;
      // Swap items in the array
      if (oldIndex === newIndex) {
        setTimeout(() => {
          isLoading.value = false;
        }, 100);
        return;
      } // No need to swap if indexes are the same

      // We need sort array before change position
      const changePositionArray = deepCopy(getFieldsForSortable()).sort(
        (a, b) => a.position - b.position,
      );

      const movedItem = changePositionArray[newIndex];
      const movedItemPosition = movedItem.position;
      const replaceItem = changePositionArray[oldIndex];
      movedItem.position = replaceItem.position;
      replaceItem.position = movedItemPosition;

      itemInstance.value.fields.forEach((field, index) => {
        if (field.id === movedItem.id) {
          itemInstance.value.fields[index] = movedItem;
        } else if (field.id === replaceItem.id) {
          itemInstance.value.fields[index] = replaceItem;
        }
      });

      setItemProp({ path: 'fields', value: itemInstance.value.fields });

      // wait until all data will be loaded and then display table
      setTimeout(() => {
        isLoading.value = false;
      }, 100);
    },
  });
};

function callSortable() {
  const wrapper = document.querySelector('.wt-table__body');
  if (wrapper) {
    initSortable(wrapper);
  }
}

const {
  isVisible: isDeleteConfirmationPopup,
  deleteCount,
  deleteCallback,
  askDeleteConfirmation,
  closeDelete,
} = useDeleteConfirmationPopup();

const deleteField = (field) => {
  const itemIndex = itemInstance.value.fields.findIndex(
    (item) => item.id === field.id,
  );
  itemInstance.value.fields.splice(itemIndex, 1);

  itemInstance.value.fields.forEach((item, index) => {
    if (item?.position > field.position) {
      itemInstance.value.fields[index].position = item.position - 1;
    }
  });
  setItemProp({ path: 'fields', value: itemInstance.value.fields });
};

const deleteSelected = (selectedFields) => {
  selectedFields
    .filter((field) => !field.readonly && field.id !== 'name')
    .forEach(deleteField);

  selected.value = [];
};

const showEditFieldPopup = ref(false);
const editItem = ref(null);
const edit = (item) => {
  editItem.value = item;
  showEditFieldPopup.value = true;
};

const editField = (filed) => {
  const itemIndex = fields.value.findIndex(
    (item) => item.id === editItem.value.id,
  );
  filed.position = fields.value[itemIndex].position;
  fields.value[itemIndex] = filed;
  setItemProp({ path: 'fields', value: fields.value });
  showEditFieldPopup.value = false;
};

// Implemented for correct for table empty composable
const error = computed(() => null);

const {
  showEmpty,
  image: imageEmpty,
  text: textEmpty,
  headline: emptyHeadline,
  title: emptyTitle,
  primaryActionText: emptyPrimaryActionText,
} = useTableEmpty({
  dataList: fields, error, isLoading, filters: computed(() => {
    if (search.value) {
      return {
        search: itemInstance.value?.fields,
      };
    }

    return {};
  }),
});

const showAddFieldPopup = ref(false);

const addNewField = (field) => {
  const filtered = itemInstance.value.fields.filter((field) => field.position);

  const lastField = filtered.sort((a, b) => a.position - b.position)[
  filtered.length - 1
    ];

  const createField = {
    ...field,
    position: lastField ? lastField.position + 1 : 1,
  };

  itemInstance.value.fields.push(createField);
  showAddFieldPopup.value = false;

  setItemProp({ path: 'fields', value: itemInstance.value.fields });
};

watch(
  () => fields.value,
  () => {
    callSortable();
  },
  {
    deep: true,
  },
);

// IMPORTANT that watch trigger for isLoading, because we need to wait until all data will be loaded and then call sortable
watch(
  () => isLoading.value,
  (value) => {
    if (!value) {
      setTimeout(() => {
        callSortable();
      }, 300);
    }
  },
);

onMounted(async () => {
  isLoading.value = false;

  if (!Sortable.__pluginsMounted) {
    Sortable.mount(new Swap());
    Sortable.__pluginsMounted = true;
  }

  setTimeout(() => {
    callSortable();
  }, 100);
});
</script>

<style lang="scss" scoped>
.opened-custom-lookup-columns {
  :deep(.wt-table .sortable-swap-highlight) {
    background: var(--primary-color);
  }
}
</style>
