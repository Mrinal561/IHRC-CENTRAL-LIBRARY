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