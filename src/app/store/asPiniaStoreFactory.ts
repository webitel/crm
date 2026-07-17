import type { StoreGeneric } from 'pinia';

// TODO(types): @webitel/ui-datalist types its store factories as plain
// records (PatchableStore), which pinia APIs (storeToRefs, StoreGeneric
// props) reject, although the runtime object is a real pinia store.
// Reflect that in the type until ui-datalist ships pinia-compatible types.
export const asPiniaStoreFactory = <S>(
	factory: () => S,
): (() => S & StoreGeneric) => factory as () => S & StoreGeneric;
