import { getDefaultAxiosInstance } from '@webitel/api-services/api/axios';

/*
 * The same instance generated api-services clients use by default, so
 * interceptors or header changes made here apply to generated calls too.
 */
export const instance = getDefaultAxiosInstance();

// compat. prefer named export
export default instance;
