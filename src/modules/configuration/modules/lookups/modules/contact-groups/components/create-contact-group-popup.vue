<template>
  <wt-selection-popup
    v-bind="attrs"
    :selected="selected"
    :options="options"
    :title="t('lookups.contactGroups.addGroup')"
    @close="close"
    @add="createGroup"
    @change="changeGroupType"
  />
</template>

<script lang="ts" setup>
import { ContactsGroupType } from '@webitel/api-services/gen/models';
import { CrmSections } from '@webitel/ui-sdk/enums';
import { computed, ref, useAttrs } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const emit = defineEmits([
	'close',
]);

const { t } = useI18n();
const router = useRouter();
const attrs = useAttrs();

const options = computed(() =>
	Object.values(ContactsGroupType)
		.filter((type) => type !== ContactsGroupType.GroupTypeUnspecified)
		.map((type) => ({
			value: type,
			title: t(`lookups.contactGroups.types.${type}`),
		})),
);

const selected = ref(options.value[0]);

function createGroup() {
	router.push({
		name: `${CrmSections.ContactGroups}-card`,
		params: {
			id: 'new',
		},
		query: {
			type: selected.value.value.toLowerCase(),
		},
	});
}

function changeGroupType(option: (typeof options.value)[number]) {
	selected.value = option;
}

function close() {
	emit('close');
}
</script>

<style lang="scss" scoped></style>
