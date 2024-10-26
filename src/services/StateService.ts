import { StateData, StateResponseData } from "@/@types/state";
import ApiService from "./LoginApiService";
import { endpoints } from "@/api/endpoint";

export async function getStates(data: StateData){
  return ApiService.fetchData<StateResponseData>({
    url:'/state',
    method: 'get',
    data,
  })
}

export async function getStateById(id: string){
  return ApiService.fetchData({
    url: endpoints.state.getById(id),
    method: 'get',
  })
}
export async function createState(data: any){
  return ApiService.fetchData({
    url: endpoints.state.create(),
    method: 'post',
    data,
  })
}
export async function updateState(id: string, data: any){
  return ApiService.fetchData({
    url: endpoints.state.update(id),
    method: 'put',
    data,
  })
}
export async function deleteState(id: string){
  return ApiService.fetchData({
    url: endpoints.state.delete(id),
    method: 'delete',
  })
}


// export class StateService(data: StateData) {
//     // Fetch all states
//     static async getStates() {
//       return ApiService.fetchData({
//         url: endpoints.state.getAll(),
//         method: 'get',
//         data,
//       })
//     }
  
//     // Get state by ID
//     static async getStateById(id: string) {
      // return ApiService.fetchData({
      //   url: endpoints.state.getById(id),
      //   method: 'get',
      // })
//     }
  
//     // Create new state
//     static async createState(data: any) {
      // return ApiService.fetchData({
      //   url: endpoints.state.create(),
      //   method: 'post',
      //   data,
      // })
//     }
  
//     // Update state
//     static async updateState(id: string, data: any) {
      // return ApiService.fetchData({
      //   url: endpoints.state.update(id),
      //   method: 'put',
      //   data,
      // })
//     }
  
//     // Delete state
//     static async deleteState(id: string) {
    //   return ApiService.fetchData({
    //     url: endpoints.state.delete(id),
    //     method: 'delete',
    //   })
    // }
//   }
  
//   export default StateService


// // import ApiService from "./LoginApiService";
// // import { endpoints } from "@/api/endpoint";
// // import { StateData } from '@/store/slices/state/stateSlice';

// // export class StateService {
// //     // Fetch all states
// //     static async getStates(): Promise<StateData[]> {
// //       const response = await ApiService.fetchData({
// //         url: endpoints.state.getAll(),
// //         method: 'get',
// //       });
// //       return Array.isArray(response.data) ? response.data : [];
// //     }
  
// //     // Get state by ID
// //     static async getStateById(id: string): Promise<StateData> {
// //       const response = await ApiService.fetchData({
// //         url: endpoints.state.getById(id),
// //         method: 'get',
// //       });
// //       return response.data;
// //     }
  
// //     // Create new state
// //     static async createState(data: Omit<StateData, 'id'>): Promise<StateData> {
// //       const response = await ApiService.fetchData({
// //         url: endpoints.state.create(),
// //         method: 'post',
// //         data,
// //       });
// //       return response.data;
// //     }
  
// //     // Update state
// //     static async updateState(id: string, data: Partial<StateData>): Promise<StateData> {
// //       const response = await ApiService.fetchData({
// //         url: endpoints.state.update(id),
// //         method: 'put',
// //         data,
// //       });
// //       return response.data;
// //     }
  
// //     // Delete state
// //     static async deleteState(id: string): Promise<void> {
// //       await ApiService.fetchData({
// //         url: endpoints.state.delete(id),
// //         method: 'delete',
// //       });
// //     }
// // }

// // export default StateService;