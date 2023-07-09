import { useRouter } from 'vue-router';

// eslint-disable-next-line import/prefer-default-export
export const useClose = () => {
  const router = useRouter();

  function close() {
    router.go(-1);
  }

  return { close };
};
