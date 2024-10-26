import ApiService from "./LoginApiService";
import { endpoints } from "@/api/endpoint";

export class StateService {
    // Fetch all states
    static async getStates() {
      return ApiService.fetchData({
        url: endpoints.state.getAll(),
        method: 'get',
      })
    }
  
    // Get state by ID
    static async getStateById(id: string) {
      return ApiService.fetchData({
        url: endpoints.state.getById(id),
        method: 'get',
      })
    }
  
    // Create new state
    static async createState(data: any) {
      return ApiService.fetchData({
        url: endpoints.state.create(),
        method: 'post',
        data,
      })
    }
  
    // Update state
    static async updateState(id: string, data: any) {
      return ApiService.fetchData({
        url: endpoints.state.update(id),
        method: 'put',
        data,
      })
    }
  
    // Delete state
    static async deleteState(id: string) {
      return ApiService.fetchData({
        url: endpoints.state.delete(id),
        method: 'delete',
      })
    }
  }
  
  export default StateService