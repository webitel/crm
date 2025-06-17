<template>
  <wt-popup
    v-bind="$attrs"
    class="add-contacts-in-group-popup"
    size="lg"
    @close="closePopup"
  >
    <template #title>
      {{
        t('contacts.addContacts', 2)
      }}
    </template>

    <template #main>
      <div class="add-contacts-in-group-popup__content">
        <div class="add-contacts-in-group-popup__filters">
          <add-contact-in-group-search-bar />
          <add-contacts-in-group-filters-panel />
        </div>

        <div
          ref="infiniteScrollWrap"
          class="add-contacts-in-group-popup__scroll-wrapper"
        >
          <wt-table
            :data="dataList"
            :headers="headers"
            :selected="selected"
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
              <div
                v-if="item.groups"
                class="contacts-groups"
              >
                <p>
                  {{ item.groups[0]?.name }}
                </p>

                <wt-tooltip
                  v-if="item.groups.length > 1"
                  :triggers="['click']"
                >
                  <template #activator>
                    <wt-chip> +{{ item.groups.length - 1 }}</wt-chip>
                  </template>

                  <div class="add-contacts-in-group-popup__group-wrapper">
                    <p
                      v-for="(group, idx) of item.groups.slice(1)"
                      :key="idx"
                    >
                      {{ group.name }}
                    </p>
                  </div>
                </wt-tooltip>
              </div>
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
        @click="closePopup"
      >
        {{ t('reusable.close') }}
      </wt-button>
    </template>
  </wt-popup>
</template>

<script lang="ts" setup>
import { useInfiniteScroll } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import ContactGroupsAPI from '../../../api/contactGroups';
import { useAddContactsInGroupStore } from '../stores/addContactsInGroup';
import AddContactInGroupSearchBar from './add-contact-in-group-search-bar.vue';
import AddContactsInGroupFiltersPanel from './add-contacts-in-group-filters-panel.vue';

const props = defineProps<{
  groupIds: string[]
}>();
const emit = defineEmits(['load-data', 'close']);

const { t } = useI18n();

const tableStore = useAddContactsInGroupStore();

const {
  dataList,
  selected,
  headers,
  isLoading,
  next,
} = storeToRefs(tableStore);

const {
  initialize,
  updateSort,
  updateSelected,
  appendToDataList,
  updatePage,
} = tableStore;

onMounted(() => {
  updatePage(1);
  initialize();
});

const infiniteScrollWrap = ref(null);

const save = async () => {
  await ContactGroupsAPI.addContactsToGroups({
    groupIds: props.groupIds,
    contactIds: selected.value.map(({ id }) => id),
  });
  closePopup();
  emit('load-data');
};

function close() {
  emit('close');
}

const closePopup = () => {
  close();
  if (selected.value.length) updateSelected([]);
};

useInfiniteScroll(infiniteScrollWrap,
  async () => {
    if (isLoading.value || !next.value) return;
    await appendToDataList();
  },
  { distance: 100 },
);

</script>

<style lang="scss" scoped>
@use '@webitel/ui-sdk/src/css/main' as *;

.add-contacts-in-group-popup {
  &__scroll-wrapper {
    @extend %wt-scrollbar;
    height: 440px;
    overflow: auto;
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
