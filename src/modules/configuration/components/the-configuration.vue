<template>
  <div class="the-configuration">
    <wt-loader v-if="!isCustomLookupsLoaded" />
    <wt-navigation-menu v-else :nav="accessibleNav" :icons="icons" />
  </div>
</template>

<script setup>
import { WtNavigationMenu } from '@webitel/ui-sdk/components';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';
import { useRouter } from 'vue-router';

import { useConfigurationStore } from '../store/configurationStore';

const router = useRouter();

const icons = [
	'crm-lookups',
	'crm-customization',
];

const configurationStore = useConfigurationStore();
const { isCustomLookupsLoaded, accessibleNav, hasAnyConfigurationAccess } =
	storeToRefs(configurationStore);
const { loadCustomLookups } = configurationStore;

// Watch for empty accessible navigation and redirect to access denied
watch(
	() => isCustomLookupsLoaded.value,
	(newVal) => {
		if (newVal && !hasAnyConfigurationAccess.value) {
			router.push('/access-denied');
		}
	},
	{
		immediate: true,
	},
);

loadCustomLookups();
</script>

<style scoped>
.the-configuration {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
