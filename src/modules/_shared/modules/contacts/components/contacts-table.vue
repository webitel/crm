<template>
  <section class="table-section">
    <header class="table-title">
      <h3 class="table-title__title">
        {{ props.header }}
      </h3>

      <slot name="action-bar" />
    </header>

    <div
      class="table-section__table-wrapper">
      <wt-loader v-show="isLoading" />

      <wt-empty
        v-if="emptyProps.showEmpty"
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
  </section>
</template>

<script setup lang="ts">
import { createTableStore } from '@webitel/ui-datalist';
import CrmSections from '@webitel/ui-sdk/enums/WebitelApplications/CrmSections.enum';
import { WtEmpty } from '@webitel/ui-sdk/src/components/index';
import { useTableEmpty } from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty';
import deepmerge from 'deepmerge';
import { storeToRefs } from 'pinia';
import { computed, isRef } from 'vue';

interface Props {
  header: string
  tableStore: ReturnType<createTableStore>
  emptyData?: {
    primaryActionText?: string | boolean;
    disabledPrimaryAction?: boolean
    primaryAction?: () => void
  };
}

const props = defineProps<Props>();

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
} = storeToRefs(props.tableStore);

const {
  updateSelected,
  updatePage,
  updateSize,
  updateSort,
} = props.tableStore;

const defaultEmptyProps = useTableEmpty({
  dataList,
  error,
  filters: computed(() => filtersManager.value.getAllValues()),
  isLoading,
});

/**
 * @author Oleksandr Palonnyi
 *
 * [WTEL-6801](https://webitel.atlassian.net/browse/WTEL-6801)
 *
 * the unwrapProps method is used to unwrap the data passed by useTableEmpty,
 * because if you use ‘return defaultEmptyProps’,
 * then vue will not be able to unwrap all the necessary props itself through v-bind=“emptyProps”
 * and the component will not work correctly
 */
function unwrapProps(obj) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, val]) => [key, isRef(val) ? val.value : val])
  );
}

const emptyProps = computed(() => {
  if (!props.emptyData) {
    return unwrapProps(defaultEmptyProps)
  }

  return deepmerge.all([
    unwrapProps(defaultEmptyProps),
    props.emptyData,
  ]);
});
</script>

<style scoped lang="scss">
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
</style>
