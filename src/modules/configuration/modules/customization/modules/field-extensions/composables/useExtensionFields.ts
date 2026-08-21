import { WtTypeExtensionAPI } from '@webitel/api-services/api';
import type { DataField } from '@webitel/api-services/gen/models';
import { computed, ref } from 'vue';

export const useExtensionFields = ({ type }: { type: string }) => {
	const fields = ref<DataField[]>([]);
	const isLoading = ref(false);

	const hasExtensionFields = computed(() => {
		return !isLoading.value && fields.value.length > 0;
	});

	const getFields = async () => {
		try {
			isLoading.value = true;
			const extension = await WtTypeExtensionAPI.get({
				itemId: type,
			});

			fields.value = extension.fields ?? [];
		} catch {
			fields.value = [];
		} finally {
			isLoading.value = false;
		}
	};

	return {
		fields,
		isLoading,
		hasExtensionFields,
		getFields,
	};
};
