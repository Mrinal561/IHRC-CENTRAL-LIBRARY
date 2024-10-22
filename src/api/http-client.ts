// import store from "@/store";
// import { fetchAuthUser } from "../store/slices/auth/auth";
// import axios from "axios";

// const httpClient = axios.create({
//   withCredentials: true,
// });

// httpClient.interceptors.request.use((config) => {
//   const platform = store.getState().setting.platform;
//   if (platform) {
//     if (!config.params?.ignorePlatform) {
//       config.params = { ...(config.params || {}), platform: platform.uuid };
//     } else {
//       config.params = {
//         ...(config.params || {}),
//         ignorePlatform: undefined,
//       };
//     }
//   }
//   return config;
// });

// httpClient.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (
//       error.response.status === 401 &&
//       !error.request.responseURL.includes("auth/profile")
//     ) {
//       store.dispatch(fetchAuthUser());
//     }
//     return Promise.reject(error);
//   }
// );

// export default httpClient;


import axios from "axios";
 
const httpClient = axios.create({
  withCredentials: true,  // Only include if you need credentials sent with requests
});
 
// Simple request interceptor
httpClient.interceptors.request.use((config) => {
  // You can add any common headers or parameters here
  // For example:
  config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
  // or
  config.params = { ...config.params, someCommonParam: 'value' };
  return config;
}, (error) => {
  return Promise.reject(error);
});
 
// Response interceptor for handling auth errors
httpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized errors
      // For example: redirect to login or refresh token
      console.log(error);
      
    }
    return Promise.reject(error);
  }
);
 
export default httpClient;