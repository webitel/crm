<template>
  <wt-selection-popup
    v-bind="$attrs"
    :shown="shown"
    :selected="selected"
    :options="options"
    :title="t('lookups.contactGroups.addGroup')"
    @close="close"
    @add="createGroup"
    @change="changeGroupType"
  />
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useCardStore } from '@webitel/ui-sdk/src/store/new/index.js';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum.js';
import TypeContactGroups from '../enums/TypeContactGroups.enum.js';

const { t } = useI18n();
const router = useRouter();

const selected = ref(null);

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
  shown: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits(['close']);

const { setItemProp } = useCardStore(`${props.namespace}/card`);

const options = computed(() => {
  return Object.values(TypeContactGroups).map((type) => ({
    value: type,
    title: t(`lookups.contactGroups.types.${type}`),
  }));
});

function createGroup() {
  router.push({ name: `${CrmSections.CONTACT_GROUPS}-card`, params: { id: 'new' }});
  setItemProp({ path: 'type', value: selected.value.value })
}

function changeGroupType(option) {
  selected.value = option;
}

function close() {
  emit('close');
}

onMounted(() => {
  selected.value = options.value[0];
});
</script>

<style lang="scss" scoped>

</style>
