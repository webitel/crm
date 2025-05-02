<template>
  <wt-popup
    v-bind="$attrs"
    class="add-contacts-popup"
    size="lg"
    @close="close"
  >
    <template #title>
      {{
        t('contacts.addContacts', 2)
      }}
    </template>

    <template #main>
      <div class="add-contacts-popup__filters">
        <wt-search-bar
          :value="filters.name"
          debounce
          @enter="handleFilterChange"
          @input="filters.name = $event"
          @search="handleFilterChange"
        />

        <wt-select
          :options="BooleanOptions"
          :value="filters.user"
          :placeholder="t('objects.user')"
          track-by="value"
          use-value-from-options-by-prop="value"
          @input="handleUserSelect"
        />

        <wt-select
          :close-on-select="false"
          :search-method="LabelsAPI.getList"
          :value="filters.contactLabel"
          :placeholder="t('vocabulary.labels', 1)"
          option-label="label"
          multiple
          track-by="label"
          @input="handleLabelSelect"
        />

        <wt-select
          :close-on-select="false"
          :search-method="ContactGroupsAPI.getLookup"
          :value="filters.groups"
          :placeholder="t('reusable.group')"
          multiple
          use-value-from-options-by-prop="id"
          @input="handleGroupSelect"
        />

        <wt-icon-btn
          :disabled="!hasFilters"
          icon="clear"
          @click="resetFilters"
        />
      </div>

      <div
        ref="infiniteScrollWrap"
        class="scroll-wrap"
      >
        <wt-table
          :data="dataList"
          :headers="headers"
          :selected="selectedContactList"
          sortable
          @sort="sort"
          @update:selected="updateSelected"
        >
          <template #name="{ item }">
            <div class="username-wrapper">
              <wt-avatar
                size="xs"
                :username="item.name"
              />

              <!--                <wt-item-link-->
              <!--                  :link="{-->
              <!--                  name: `${CrmSections.CONTACTS}-card`,-->
              <!--                  params: { id: item.id },-->
              <!--                }"-->
              <!--                >-->
              {{ item.name }}
              <!--                </wt-item-link>-->
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

                <div class="contacts-groups__wrapper">
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
              class="contacts-labels-wrapper"
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
    </template>

    <template #actions>
      <wt-button
        :disabled="disabledSave"
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

<script lang="ts" setup>
import { useInfiniteScroll } from '@vueuse/core';
import ContactsAPI from '@webitel/ui-sdk/src/api/clients/сontacts/contacts';
import { SortSymbols, sortToQueryAdapter } from '@webitel/ui-sdk/src/scripts/sortQueryAdapters';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import LabelsAPI from '../../../../../../../../_shared/modules/contacts/api/LabelsAPI';
import ContactGroupsAPI from '../../../api/contactGroups';

const props = defineProps<{
  groupIds: string[]
}>();
const emit = defineEmits(['load-data', 'close']);

const { t } = useI18n();

const BooleanOptions = [
  {
    locale: 'vocabulary.yes',
    value: 'true',
  },
  {
    locale: 'vocabulary.no',
    value: 'false',
  },
]

const getFilters = () => ({
  name: '',
  user: null,
  groups: [],
  contactLabel: [],
  sort: '',
});

const filters = ref(getFilters());
const headers = [
  {
    value: 'name',
    locale: 'reusable.name',
    show: true,
    field: 'name',
    sort: SortSymbols.NONE,
  },
  {
    value: 'user',
    locale: ['objects.user', 1],
    show: true,
    field: 'user',
    // width: '100px',
    sort: SortSymbols.NONE,
  },
  {
    value: 'labels',
    locale: ['vocabulary.labels', 1],
    show: true,
    field: 'labels',
    sort: SortSymbols.NONE,
  },
  {
    value: 'groups',
    locale: 'reusable.group',
    show: true,
    field: 'groups',
    sort: SortSymbols.NONE,
  },
];
const dataList = ref([]);
const selectedContactList = ref([]);
const page = ref(0);
const isNext = ref(false);
const isLoading = ref(false);

const infiniteScrollWrap = ref(null);

const hasFilters = computed(() => {
  return Object.values(filters.value).some((filter) => {
    if (Array.isArray(filter)) {
      return filter.length > 0;
    }
    return filter !== null && filter !== '';
  });
});
const disabledSave = computed(() => !selectedContactList.value.length);

function updateSelected(val) {
  selectedContactList.value = val;
}

function setDataList(items) {
  if (page.value === 1) dataList.value = items;
  else dataList.value.push(...items);
}

async function loadDataList() {
  const size = 20;
  const params = {
    size,
    ...filters.value,
    fields: headers.map(({ field }) => field),
    contactLabel: filters.value.contactLabel,
    group: filters.value.groups,
    user: filters.value.user,
    page: page.value,
  };

  const { items, next } = await ContactsAPI.getLookup(params);
  const _items = items.map((i) => ({ ...i, _isSelected: false }));
  setDataList(_items);
  isNext.value = next;
}

async function callLoadDataList() {
  isLoading.value = true;
  await loadDataList();
  isLoading.value = false;
}

function handleLabelSelect(value) {
  filters.value.contactLabel = value;
  return handleFilterChange();
}

function handleGroupSelect(value) {
  filters.value.groups = value;
  return handleFilterChange();
}

function handleUserSelect(value) {
  filters.value.user = value;
  return handleFilterChange();
}

function handleFilterChange() {
  page.value = 1;
  return loadDataList();
}

function sort(header, nextSortOrder) {
  filters.value.sort = nextSortOrder
    ? `${sortToQueryAdapter(nextSortOrder)}${header.field}`
    : nextSortOrder;
  handleFilterChange();

  headers.forEach((oldHeader) => {
    if (oldHeader.sort !== undefined) {

      oldHeader.sort = oldHeader.field === header.field ? nextSortOrder : SortSymbols.NONE;
    }
  });
}

const save = async () => {
  for (const id of props.groupIds) {
    await ContactGroupsAPI.addContactsToGroup({
      id: id,
      contactIds: selectedContactList.value.map(({ id }) => id),
    });
  }
  await close();
  emit('load-data');
};

async function close() {
  emit('close');
  await resetFilters()
}

function resetFilters() {
  filters.value = getFilters();
  selectedContactList.value = []
  return handleFilterChange();
}

useInfiniteScroll(infiniteScrollWrap,
  async () => {
    if (isLoading.value || !isNext.value) return;
    page.value += 1;
    await callLoadDataList();
  },
  {
    distance: 100,
  }
);

onMounted(async () => {
  page.value = 1;
  await callLoadDataList();
});
</script>

<style lang="scss" scoped>
.add-contacts-popup {
  &.wt-popup {
    .wt-popup__main {
      display: flex;
      flex-direction: column;
    }

    .scroll-wrap {
      overflow: auto;
      flex-grow: 1;
      min-height: 0;
    }
  }

  &__filters {
    display: grid;
    align-items: center;
    margin-bottom: var(--spacing-xs);
    grid-template-columns: repeat(4, 1fr) var(--spacing-md);
    gap: var(--spacing-xs);
  }

  .scroll-wrap {
    height: 440px;
  }

  .contacts {
    &-groups {
      display: flex;
      gap: var(--spacing-xs);
    }

    &-labels-wrapper {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-2xs);
    }
  }

  .username-wrapper {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-xs);

    .wt-avatar {
      flex: 0 0 var(--wt-avatar-size--size-xs);
    }
  }
}
</style>
