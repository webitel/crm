import applyInterceptors from './apply';
import InterceptorType from './InterceptorType.enum';
import attachStarToRequestUrlSearchQuery
  from './request/attachStarToRequestUrlSearchQuery.interceptor';
import camelToSnakeRequestData from './request/camelToSnakeRequestData.interceptor';
import errorEventBusNotificationResponse
  from './response/errorEventBusNotificationResponse.interceptor';
import snakeToCamelResponseData from './response/snakeToCamelResponseData.interceptor';
import unauthorizedResponse from './response/unauthorizedResponse.interceptor';

const DO_NOT_CONVERT_KEYS = [
  'schema',
  'profile',
  'variables',
  'patterns',
  'errorIds',
];

const defaultInterceptorsSetup = ({ instance, config }) => {
  const interceptors = [
    {
      type: InterceptorType.REQUEST,
      interceptor: attachStarToRequestUrlSearchQuery.default,
    },
    {
      type: InterceptorType.REQUEST,
      interceptor: camelToSnakeRequestData.setup(DO_NOT_CONVERT_KEYS),
    },

    {
      type: InterceptorType.RESPONSE,
      interceptor: errorEventBusNotificationResponse.setup(config),
    },
    {
      type: InterceptorType.RESPONSE,
      interceptor: snakeToCamelResponseData.setup(DO_NOT_CONVERT_KEYS),
    },
    {
      type: InterceptorType.RESPONSE,
      interceptor: unauthorizedResponse.default,
    },
  ];

  applyInterceptors({ instance, interceptors });
  return instance;
};

export default defaultInterceptorsSetup;
