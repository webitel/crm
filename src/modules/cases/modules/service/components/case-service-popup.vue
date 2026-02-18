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
        item-data="id"
        item-label="name"
        children-prop="service"
        @update:model-value="selectedElement = $event"
      >
        <template #item-prefix="{data}">
          <wt-icon-btn
            v-tooltip.bottom="data.description"
            class="case-service-popup__description-icon"
            :disabled="!data.description"
            :size="ComponentSize.SM"
            color="info"
            icon="docs"
          />
        </template>
      </wt-tree>
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
        {{ $t('reusable.ok') }}
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
import { ServiceCatalogsAPI } from '@webitel/api-services/api';
import { ComponentSize } from '@webitel/ui-sdk/enums/ComponentSize/ComponentSize.js';
import deepCopy from 'deep-copy';
import { onMounted, ref, watch } from 'vue';

import ServiceAPI from '../api/ServiceAPI.js';

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

const emit = defineEmits([
	'save',
	'close',
]);

const selectedElement = ref(props.value?.id ?? null);
const search = ref('');
const loading = ref(false);

const save = async () => {
	const service = await ServiceAPI.get({
		itemId: selectedElement.value,
	});
	const catalog = await ServiceCatalogsAPI.get({
		itemId: service.catalogId,
	});

	emit('save', {
		service: service,
		catalog: catalog,
	});
	close();
};

function close() {
	emit('close');
}

const catalogData = ref([]);

const loadCatalogs = async () => {
	try {
		loading.value = true;

		const { items } = await ServiceCatalogsAPI.getList({
			size: -1, // It this case for get all catalogs with services we need to pass size -1
			search: search.value,
			fields: [
				'id',
				'name',
				'closeReasonGroup',
				'status',
				'service',
				'description',
			],
			hasSubservices: true,
			state: true,
		});

		catalogData.value = deepCopy(items);
	} finally {
		loading.value = false;
	}
};

watch(
	() => props.value,
	() => {
		selectedElement.value = props.value?.id;
	},
);

watch(
	() => props.shown,
	(newVal) => {
		if (newVal) {
			search.value = '';
			selectedElement.value = props.value?.id;
			loadCatalogs();
		}
	},
);

onMounted(() => {
	loadCatalogs();
});
</script>

<style lang="scss" scoped>
.case-service-popup {
  &__search-bar {
    margin-bottom: var(--spacing-sm);
  }

  &__description-icon {
    margin: auto 0;
    flex-shrink: 0;
  }
}
</style>
