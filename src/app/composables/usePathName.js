import { ref, watch } from 'vue';

// https://my.webitel.com/browse/WTEL-3449
export const usePathName = (itemInstance) => {
  const pathName = ref('');

  function setPathName() {
    pathName.value = itemInstance.value.name;
  }

  watch(() => itemInstance.value._dirty, (value) => {
    if (!value) setPathName();
  });

  // itemInstance._dirty isn't init as "false",
  // so that we should set up first name representation in other way
  const unwatchName = watch(() => itemInstance.value.name, () => {
    setPathName();
    unwatchName();
  });

  return { pathName };
};
