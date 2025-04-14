<template>
  <div>
    <wt-loader v-show="isLoading" />

    <wt-empty
      v-if="showEmpty"
      v-bind="emptyProps"
      @click:primary="emptyProps.primaryAction"
    />

    <div
      v-show="!isLoading && dataList.length"
      class="table-wrapper"
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
          <div class="username-wrapper">
            <wt-avatar
              size="xs"
              :username="item.name"
            />

            <wt-item-link
              :link="{
                  name: `${CrmSections.CONTACTS}-card`,
                  params: { id: item.id },
                }"
            >
              {{ item.name }}
            </wt-item-link>
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

        <template #about="{ item }">
          {{ item.about }}
        </template>

        <template #managers="{ item }">
          {{ item.managers[0]?.user.name }}
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

        <template #actions="{ item }">
          <slot name="actions" :item="item" />
          <!--          <wt-icon-action-->
          <!--            :disabled="!item.access.edit"-->
          <!--            action="edit"-->
          <!--            @click="edit(item)"-->
          <!--          />-->

          <!--          <wt-icon-action-->
          <!--            :disabled="!item.access.delete"-->
          <!--            action="delete"-->
          <!--            @click="-->
          <!--                askDeleteConfirmation({-->
          <!--                  deleted: [item],-->
          <!--                  callback: () => deleteData(item),-->
          <!--                })-->
          <!--              "-->
          <!--          />-->
        </template>
      </wt-table>

      <wt-pagination
        :next="next"
        :prev="page > 1"
        :size="size"
        debounce
        @change="updateSize"
        @next="updatePage(page + 1)"
        @prev="updatePage(page - 1)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import CrmSections from '@webitel/ui-sdk/enums/WebitelApplications/CrmSections.enum';
import { useTableEmpty } from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty.js';
import deepmerge from 'deepmerge';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

import { useContactsStore } from '../stores/contacts';

interface Props {
  emptyProps?: {
    primaryActionText?: string | boolean;
    disabledPrimaryAction?: boolean
    primaryAction?: () => void
  };
}

const props = defineProps<Props>();

const tableStore = useContactsStore();

const {
  dataList,
  selected,
  isLoading,
  headers,
  page,
  size,
  next,
  error,
  filtersManager,
} = storeToRefs(tableStore);

const {
  updateSelected,
  updatePage,
  updateSize,
  updateSort,
  addFilter,
} = tableStore;

const defaultEmptyProps = useTableEmpty({
  dataList,
  error,
  filters: computed(() => filtersManager.value.getAllValues()),
  isLoading,
});

const emptyProps = computed(() => {
  return deepmerge.all([
    ...defaultEmptyProps,
    ...props.emptyProps,
  ]);
});
</script>

<style scoped lang="scss">

</style>
