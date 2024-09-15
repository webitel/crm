import IsEmpty from '@webitel/ui-sdk/src/scripts/isEmpty';
import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import defaultDummyPicAfterSearchDark from '../assets/dummy-dark.svg';
import defaultDummyPicAfterSearchLight from '../assets/dummy-light.svg';

export function useDummy({
  namespace,
  showAction,
  hiddenText,
  dummyPic,
  dummyText,
  dummyPicAfterSearch,
  dummyTextAfterSearch = 'objects.emptyResultSearch',
}) {
  const store = useStore();
  const route = useRoute();

  const dummy = ref('');

  const dataList = computed(() => getNamespacedState(store.state, namespace).dataList);
  const search = computed(() => getNamespacedState(store.state, namespace).search);

  const darkMode = computed(() => store.getters['appearance/DARK_MODE']);
  const dummyImgAfterSearch = computed(() => {
    if (dummyPicAfterSearch) return dummyPicAfterSearch;
    return darkMode.value ? defaultDummyPicAfterSearchDark : defaultDummyPicAfterSearchLight;
  });

  watch(
    () => dataList,
    () => {
      if (!dataList.value.length) {
        if (
          IsEmpty(route?.query)
            ? search.value
            : Object.values(route.query).some((query) => query.length)
        ) {
          return (dummy.value = {
            src: dummyImgAfterSearch,
            text: dummyTextAfterSearch,
          });
        }
        return (dummy.value = {
          src: dummyPic,
          text: dummyText,
          showAction,
          hiddenText,
        });
      }
      return (dummy.value = '');
    },
    { deep: true },
  );
  return { dummy };
}
