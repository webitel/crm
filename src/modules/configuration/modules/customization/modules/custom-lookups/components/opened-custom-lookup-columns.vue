<template>
  <section class="table-section opened-custom-lookup-columns">
    <header class="opened-card-header">
      <h3 class="opened-card-header__title">
        {{ title || t('customization.customLookups.columns') }}
      </h3>
      <wt-action-bar
        :include="[IconAction.ADD, IconAction.DELETE]"
        :disabled:delete="!selected.length || disableUserInput"
        :disabled:add="disableUserInput"
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

      <wt-empty
        v-if="showEmpty"
        :image="imageEmpty"
        :headline="emptyHeadline"
        :title="emptyTitle"
        :text="textEmpty"
        :disabled-primary-action="disableUserInput"
        :primary-action-text="emptyPrimaryActionText"
        @click:primary="showAddFieldPopup = true"
      />

      <div
       v-if="!showEmpty"
       class="table-section__table-wrapper"
      >
        <wt-table
          :data="fields"
          :headers="headers"
          :selected="selected"
          sortable
          row-reorder
          :is-row-reorder-disabled="isReorderDisabled"
          @update:selected="setSelected"
          @reorder:row="handleReorder"
        >
          <template #title="{ item }">
            {{ t(item?.name ?? 'reusable.title') }}
          </template>
          <template #type="{ item }">
            {{ t(`customization.customLookups.fieldType.${item.kind}`) }}
          </template>
          <template #actions="{ item }">
            <template v-if="!isSystemField(item)">
              <wt-icon-action
                action="edit"
                :disabled="disableUserInput"
                @click="edit(item)"
              />
              <wt-icon-action
                action="delete"
                :disabled="disableUserInput"
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

    <!--    TODO With some reason validation from this popup using on validate all ItemInstance, need investigate why this happening, for now use v-if to work correct for add and update field -->
    <custom-field-popup
      v-if="showAddFieldPopup"
      :shown="showAddFieldPopup"
      @close="showAddFieldPopup = false"
      @save="addNewField"
    />
    <custom-field-popup
      v-if="showEditFieldPopup"
      :shown="showEditFieldPopup"
      :field="editItem"
      @close="showEditFieldPopup = false"
      @save="editField"
    />
  </section>
</template>

<script setup lang="ts">
import { WtEmpty, WtTable } from '@webitel/ui-sdk/components';
import { IconAction } from '@webitel/ui-sdk/enums';
import DeleteConfirmationPopup from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import { useDeleteConfirmationPopup } from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
import { useTableEmpty } from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { useUserAccessControl } from '../../../../../../../app/composables/useUserAccessControl';
import type { ColumnField } from '../types/customLookupField';
import CustomFieldPopup from './custom-field-popup.vue';

// this component is bound generically alongside sibling card tabs (e.g. the
// "general" tab), which pass along their own model-value/validation-fields/
// access props that this component doesn't use — don't let those fall
// through onto the root <section>.
defineOptions({
	inheritAttrs: false,
});

const props = defineProps<{
	itemInstance: {
		fields: ColumnField[];
	} & Record<string, any>;
	title?: string;
}>();

const { t } = useI18n();

const { disableUserInput } = useUserAccessControl();

const sortFields = (fields: ColumnField[]) => {
	const unSortableFields = fields?.filter((field) => !field.position);

	const sortedFields = fields
		.filter((field) => field.position)
		.toSorted((a, b) => {
			return (a.position ?? 0) - (b.position ?? 0);
		});

	sortedFields.unshift(...unSortableFields);

	return sortedFields;
};

const search = ref('');

const fields = computed(() => {
	const itemFields = props.itemInstance.fields ?? [];

	if (search.value) {
		return sortFields(
			itemFields.filter((field) => {
				return field.name?.toLowerCase().includes(search.value?.toLowerCase());
			}),
		);
	}

	return sortFields(itemFields);
});

const selected = ref<ColumnField[]>([]);
const setSelected = (selectedElements: ColumnField[]) => {
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

const isSystemField = (field: ColumnField) =>
	field.id === 'name' || field.readonly;

const isReorderDisabled = (field: ColumnField) => {
	if (!field) return true;
	return isSystemField(field) || disableUserInput.value;
};

const getFieldsForSortable = () => {
	return !search.value
		? props.itemInstance.fields
		: props.itemInstance.fields.filter((field) => {
				return field.name.toLowerCase().includes(search.value?.toLowerCase());
			});
};

// Handle row reorder from the table
const handleReorder = async ({
	oldIndex,
	newIndex,
}: {
	oldIndex: number;
	newIndex: number;
}) => {
	if (isReorderDisabled(fields.value[newIndex])) return;

	if (oldIndex === newIndex) return;

	const changePositionArray = getFieldsForSortable().toSorted(
		(a, b) => (a.position ?? 0) - (b.position ?? 0),
	);

	const movedItem = changePositionArray[newIndex];
	const movedItemPosition = movedItem.position;
	const replaceItem = changePositionArray[oldIndex];
	movedItem.position = replaceItem.position;
	replaceItem.position = movedItemPosition;

	props.itemInstance.fields.forEach((field, index) => {
		if (field.id === movedItem.id) {
			props.itemInstance.fields[index] = movedItem;
		} else if (field.id === replaceItem.id) {
			props.itemInstance.fields[index] = replaceItem;
		}
	});
};

const {
	isVisible: isDeleteConfirmationPopup,
	deleteCount,
	deleteCallback,
	askDeleteConfirmation,
	closeDelete,
} = useDeleteConfirmationPopup();

const deleteField = (field: ColumnField) => {
	const itemIndex = props.itemInstance.fields.findIndex(
		(item) => item.id === field.id,
	);
	if (itemIndex !== -1) {
		props.itemInstance.fields.splice(itemIndex, 1);
	}

	props.itemInstance.fields.forEach((item, index) => {
		if ((item?.position ?? 0) > (field.position ?? 0)) {
			props.itemInstance.fields[index].position = (item.position ?? 0) - 1;
		}
	});
};

const deleteSelected = (selectedFields: ColumnField[]) => {
	selectedFields
		.filter((field) => !field.readonly && field.id !== 'name')
		.forEach(deleteField);

	selected.value = [];
};

const showEditFieldPopup = ref(false);
const editItem = ref<ColumnField | null>(null);
const edit = (item: ColumnField) => {
	editItem.value = item;
	showEditFieldPopup.value = true;
};

const editField = (field: ColumnField) => {
	const itemIndex = fields.value.findIndex(
		(item) => item.id === editItem.value?.id,
	);
	field.position = fields.value[itemIndex].position;
	props.itemInstance.fields[itemIndex] = field;
	showEditFieldPopup.value = false;
};

// Implemented for correct for table empty composable
const error = computed(() => null);
const isLoading = computed(() => false);

const {
	showEmpty,
	image: imageEmpty,
	text: textEmpty,
	headline: emptyHeadline,
	title: emptyTitle,
	primaryActionText: emptyPrimaryActionText,
} = useTableEmpty({
	dataList: fields,
	error,
	isLoading,
	filters: computed(() => {
		if (search.value) {
			return {
				search: props.itemInstance.fields,
			};
		}

		return {};
	}),
});

const showAddFieldPopup = ref(false);

const addNewField = (field: ColumnField) => {
	const filtered = props.itemInstance.fields.filter((field) => field.position);

	const lastField = filtered.toSorted(
		(a, b) => (a.position ?? 0) - (b.position ?? 0),
	)[filtered.length - 1];

	const createField = {
		...field,
		position: lastField ? (lastField.position ?? 0) + 1 : 1,
	};

	props.itemInstance.fields.push(createField);
	showAddFieldPopup.value = false;
};

watch(
	() => props.itemInstance,
	() => {
		setSelected([]);
	},
);
</script>
