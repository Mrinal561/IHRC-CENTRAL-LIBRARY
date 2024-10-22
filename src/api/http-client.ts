import axios from 'axios';
import store from '@/store';
// import { login } from '@/store/features/auth';
import { loginUser } from '@/store/features/auth/authSlice';

const httpClient = axios.create({
  withCredentials: true,
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !error.request.responseURL.includes('superadmin/profile')
    ) {
      store.dispatch(loginUser());
    }
    return Promise.reject(error);
  }
);

export default httpClient;