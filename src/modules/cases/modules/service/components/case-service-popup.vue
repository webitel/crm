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
        placeholder="Search"
        class="case-service-popup__search-bar"
        @input="search = $event"
        @search="loadCatalogs"
      />
      <wt-tree
        v-if="catalogData.length"
        :model-value="selectedElement"
        style="height: 350px"
        :data="catalogData"
        item-label="name"
        children-prop="service"
        @update:model-value="selectedElement = $event"
      />
      <wt-empty
        v-else
        :text="$t('empty.text.empty')"
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

const selectedElement = ref(props.value ?? null)
const search = ref('')

const emit = defineEmits(['save', 'close']);

function save() {
  emit('save', {
    service: selectedElement.value,
    catalog: catalogData.value.find((item) => item.id === selectedElement.value.catalogId),
  });
  close();
}

function close() {
  emit('close');
}

const catalogData = ref([]);

const loadCatalogs = async () => {
   const { items } = await CatalogsAPI.getList({
     size: -1,
     search: search.value,
     fields: ['id', 'name', 'service'],
     hasSubservices: true
  });

  catalogData.value = items;
}

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
