<template>
  <wt-popup
    :shown="shown"
    @close="close"
  >
    <template #header>
      {{ $t('cases.selectAService') }}
    </template>
    <template #main>
      <wt-search-bar
        :value="search"
        class="case-service-popup__search-bar"
        @input="search = $event"
        @search="loadCatalogs"
      />
      <wt-loader v-if="loading" />
      <wt-tree
        v-else-if="catalogData.length"
        :model-value="selectedElement"
        style="height: 350px"
        :data="catalogData"
        item-label="name"
        children-prop="service"
        @update:model-value="selectedElement = $event"
      />
      <wt-empty
        v-else
        :text="$t('webitelUI.empty.text.empty')"
      />
    </template>
    <template #actions>
      <wt-button
        :disabled="!selectedElement"
        @click="save"
      >
        {{ $t('reusable.add') }}
      </wt-button>
      <wt-button
        color="secondary"
        @click="close"
      >
        {{ $t('reusable.close') }}
      </wt-button>
    </template>
  </wt-popup>
</template>

<script setup>
import deepCopy from 'deep-copy';
import { onMounted, ref } from 'vue';

import CatalogsAPI from '../../../../configuration/modules/lookups/modules/service-catalogs/api/service-catalogs.js';

const props = defineProps({
  value: {
    type: Object,
    required: true,
  },
  shown: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['save', 'close']);

const selectedElement = ref(props.value ?? null);
const search = ref('');
const loading = ref(false);

function save() {
  emit('save', {
    service: selectedElement.value,
    catalog: catalogData.value.find(
      (item) => item.id === selectedElement.value.catalogId,
    ),
  });
  close();
}

function close() {
  emit('close');
}

const catalogData = ref([]);

const loadCatalogs = async () => {
  try {
    loading.value = true;

    const { items } = await CatalogsAPI.getList({
      size: -1, // It this case for get all catalogs with services we need to pass size -1
      search: search.value,
      fields: ['id', 'name', 'closeReasonGroup', 'status', 'service'],
      hasSubservices: true,
    });

    catalogData.value = deepCopy(items);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadCatalogs();
});
</script>

<style lang="scss" scoped>
.case-service-popup {
  &__search-bar {
    margin-bottom: var(--spacing-sm);
  }
}
</style>
