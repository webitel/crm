const onFulfilled = (response) => response;

const onReject = (error) => {
  if (error.response && error.response.status === 401) {
    console.warn('intercepted 401');
    localStorage.removeItem('access-token');
  }
  return Promise.reject(error);
};

const unauthorizedResponse = {
  default: [
    onFulfilled,
    onReject,
  ],
};

export default unauthorizedResponse;
