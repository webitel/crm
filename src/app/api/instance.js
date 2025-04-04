import generateInstance from '@webitel/ui-sdk/src/api/axios/generateInstance';
import updateTokenInterceptor from '@webitel/ui-sdk/src/api/interceptors/request/updateToken.interceptor';
import handleUnauthorizedInterceptor from '@webitel/ui-sdk/src/api/interceptors/response/handleUnauthorized.interceptor';

export default generateInstance({
  baseURL: import.meta.env.VITE_API_URL,
  interceptors: {
    request: [updateTokenInterceptor],
    response: [handleUnauthorizedInterceptor],
  },
});
