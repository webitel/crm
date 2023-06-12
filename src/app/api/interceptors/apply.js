import InterceptorType from './InterceptorType.enum';

const applyInterceptors = ({ instance, interceptors = [] }) => {
  interceptors.forEach(({ type, interceptor }) => {
    if (type === InterceptorType.REQUEST
      || type === InterceptorType.RESPONSE) {
      instance.interceptors[type].use(...interceptor);
    } else {
      console.error('unknown interceptor type: ', type, interceptor);
    }
  });
};

export default applyInterceptors;
