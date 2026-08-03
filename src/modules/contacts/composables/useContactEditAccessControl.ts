import { WtObject } from '@webitel/ui-sdk/enums';
import { type ComputedRef, computed, inject } from 'vue';

import { useUserAccessControl } from '../../../app/composables/useUserAccessControl';

export function useContactEditAccessControl(
	resource: WtObject = WtObject.Contact,
) {
	const access =
		inject<
			ComputedRef<{
				hasRbacEditAccess?: boolean;
				hasRbacDeleteAccess?: boolean;
			}>
		>('access');
	const isReadOnly = inject<boolean>('isReadOnly');

	const { hasCreateAccess, hasUpdateAccess, hasDeleteAccess } =
		useUserAccessControl(resource);

	const hasContactEditAccess = computed(
		() => !!access?.value?.hasRbacEditAccess && !isReadOnly,
	);

	const disabledAdd = computed(
		() => !hasContactEditAccess.value || !hasCreateAccess.value,
	);
	const disabledUpdate = computed(
		() => !hasContactEditAccess.value || !hasUpdateAccess.value,
	);
	const disabledDelete = computed(
		() => !hasContactEditAccess.value || !hasDeleteAccess.value,
	);

	return {
		access,
		isReadOnly,
		hasContactEditAccess,
		disabledAdd,
		disabledUpdate,
		disabledDelete,
	};
}
