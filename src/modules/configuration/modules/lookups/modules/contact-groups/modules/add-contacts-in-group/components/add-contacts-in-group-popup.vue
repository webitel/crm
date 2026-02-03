<template>
  <wt-popup
    v-bind="$attrs"
    class="add-contacts-in-group-popup"
    size="lg"
    @close="close"
  >
    <template #title>
      {{
        t('contacts.addContacts', 2)
      }}
    </template>

    <template #main>
      <div class="add-contacts-in-group-popup__content">
        <div class="add-contacts-in-group-popup__filters">
          <add-contact-in-group-search-bar :use-table-store="useTableStore" />

          <add-contacts-in-group-filters-panel :use-table-store="useTableStore" />
        </div>

        <div class="add-contacts-in-group-popup__scroll-wrapper wt-scrollbar">
          <wt-table
            :data="dataList"
            :headers="headers"
            :selected="selected"
            :lazy="true"
            :on-loading="handleIntersect"
            data-key="id"
            sortable
            @sort="updateSort"
            @update:selected="updateSelected"
          >
            <template #name="{ item }">
              <div class="add-contacts-in-group-popup__username-wrapper">
                <wt-avatar
                  size="xs"
                  :username="item.name"
                />
                {{ item.name }}
              </div>
            </template>

            <template #user="{ item }">
              <wt-icon
                v-if="item.user"
                icon="webitel-logo"
              />
            </template>

            <template #groups="{ item }">
              <wt-display-chip-items
                v-if="item.groups"
                :items="item.groups"
              />
            </template>

            <template #labels="{ item }">
              <div
                v-if="item.labels"
                class="add-contacts-in-group-popup__labels-wrapper"
              >
                <wt-chip
                  v-for="{ label, id } of item.labels"
                  :key="id"
                >
                  {{ label }}
                </wt-chip>
              </div>
            </template>
          </wt-table>
        </div>
      </div>
    </template>

    <template #actions>
      <wt-button
        :disabled="!selected?.length"
        @click="save"
      >
        {{ t('reusable.add') }}
      </wt-button>

      <wt-button
        color="secondary"
        @click="close"
      >
        {{ t('reusable.close') }}
      </wt-button>
    </template>
  </wt-popup>
</template>

<script
  lang="ts"
  setup
>
import { ContactGroupsAPI } from '@webitel/api-services/api';
import { WtDisplayChipItems } from '@webitel/ui-sdk/components';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { createAddContactsInGroupComposableTableStore } from '../stores/addContactsInGroup';
import AddContactInGroupSearchBar from './add-contact-in-group-search-bar.vue';
import AddContactsInGroupFiltersPanel from './add-contacts-in-group-filters-panel.vue';

const props = defineProps<{
  groupIds: string[]
}>();
const emit = defineEmits(['load-data', 'close']);

const { t } = useI18n();

const useTableStore = createAddContactsInGroupComposableTableStore();
const tableStore = useTableStore();
const isFirstLoad = ref(false)

const {
  dataList,
  selected,
  headers,
  next,
} = tableStore;

const {
  initialize,
  updateSort,
  updateSelected,
  appendToDataList,
} = tableStore;

initialize();


const handleIntersect = () => {
  if (!next.value && isFirstLoad.value) return;
  appendToDataList();
  isFirstLoad.value = true;
}

const save = async () => {
  await ContactGroupsAPI.addContactsToGroups({
    groupIds: props.groupIds,
    contactIds: selected.value.map(({ id }) => id),
  });
  close();
  emit('load-data');
};

function close() {
  emit('close');
}

</script>

<style
  lang="scss"
  scoped
>
@use '@webitel/ui-sdk/src/css/main' as *;

.add-contacts-in-group-popup {
  &__scroll-wrapper {
    height: 440px;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  &__filters,
  &__group-wrapper {
    display: flex;
    gap: var(--spacing-xs);
  }

  &__labels-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-2xs);
  }

  &__username-wrapper {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-xs);

    .wt-avatar {
      flex: 0 0 var(--wt-avatar-size--size-xs);
    }
  }
}
</style>
