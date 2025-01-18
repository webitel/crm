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
        @input="search = $event"
      />
      <wt-tree
        :model-value="selectedElement"
        style="height: 350px"
        :data="catalogData"
        item-label="name"
        children-prop="service"
        @update:model-value="selectedElement = $event"
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
import { serviceCatalogData } from '../api/example.js';
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

const check = (event) => {
  console.log('event', event)
}

const selectedElement = ref(props.value ?? null)
const search = ref('')

const emit = defineEmits(['save', 'close']);


function save() {
  emit('save', selectedElement.value);
  close();
}

function close() {
  emit('close');
}

const catalogData = ref([]);

const loadCatalogs = async () => {
   const { items } = await CatalogsAPI.getList({
     size: -1,
     fields: ['id', 'name', 'service'],
  });

  catalogData.value = items;
}

onMounted(() => {
  loadCatalogs();
});
</script>

<style lang="scss" scoped>

</style>
