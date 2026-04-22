<template>
  <wt-popup
    :shown="shown"
    @close="close"
    class="wt-cases-export-type-popup"
  >
    <template #header>
      {{ t('reusable.export') }}
    </template>
    <template #main>
      <wt-select
        :value="type"
        :label="t('vocabulary.format')"
        required
        :v="v$.type"
        track-by="name"
        :options="options"
        @input="type = $event"
      />
    </template>
    <template #actions>
      <wt-button
        :disabled="v$.$invalid"
        @click="save"
      >
        {{ t('reusable.export') }}
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

<script setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';

const props = defineProps({
	shown: {
		type: Boolean,
		required: true,
	},
});

const emit = defineEmits([
	'save',
	'close',
]);

const { t } = useI18n();

const type = ref(null);
const options = ref([
	{
		name: 'csv',
		value: 'csv',
	},
	{
		name: 'xlsx',
		value: 'xlsx',
	},
]);

const v$ = useVuelidate(
	computed(() => {
		return {
			type: {
				required,
			},
		};
	}),
	{
		type,
	},
	{
		$autoDirty: true,
		$stopPropagation: true,
	},
);

v$.value.$touch();

const save = async () => {
	emit('save', type.value?.value);
	close();
};

const close = () => {
	emit('close');
};
</script>

<style lang="scss" scoped>
.wt-cases-export-type-popup {
  min-height: 200px;

  :deep(.wt-popup__main) {
    overflow-y: initial !important;
  }

  :deep(.wt-popup__popup) {
    max-width: 500px;
  }
}
</style>
