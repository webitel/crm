<template>
  <wt-popup
    :shown="shown"
    overflow
    size="sm"
    @close="close"
  >
    <template #title>
      {{ t('permissions.granteePopup.title') }}
    </template>
    <template #main>
      <grantee-select
        :value="grantee"
        @input="grantee = $event"
      />
    </template>
    <template #actions>
      <wt-button
        :disabled="v$.$invalid"
        :loading="isSaving"
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
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

import GranteeSelect from './grantee-select.vue';

const props = defineProps({
	namespace: {
		type: String,
		required: true,
	},
});

const emit = defineEmits([
	'close',
]);

const { t } = useI18n();
const route = useRoute();
const store = useStore();

// animation
const shown = ref(false);
const isSaving = ref(false);
const grantee = ref({});

const v$ = useVuelidate(
	{
		grantee: {
			required,
		},
	},
	{
		grantee,
	},
	{
		$autoDirty: true,
	},
);
v$.value.$touch();

const permissionId = computed(() => route.params.permissionId);

function close() {
	emit('close');
}

function grantPermissions(payload) {
	return store.dispatch(`${props.namespace}/GRANT_PERMISSIONS`, payload);
}

async function save() {
	isSaving.value = true;
	await grantPermissions(grantee.value);
	close();

	isSaving.value = false;

	setTimeout(() => {
		close();
	}, 1500);
}

watch(
	permissionId,
	async () => {
		grantee.value = {};
	},
	{
		immediate: true,
	},
);

watch(
	permissionId,
	() => {
		if (permissionId.value) {
			setTimeout(() => (shown.value = !!permissionId.value), 300);
		} else {
			shown.value = !!permissionId.value;
		}
	},
	{
		immediate: true,
	},
);
</script>

<style lang="scss" scoped>
</style>
