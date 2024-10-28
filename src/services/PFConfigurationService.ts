import { PFConfigData, PFConfigResponseData } from "@/@types/pfConfig";
import ApiService from "./LoginApiService";
import { endpoints } from "@/api/endpoint";

export async function getPf(data: PFConfigData){
  return ApiService.fetchData<PFConfigResponseData>({
    url:'/pf-configuration',
    method: 'get',
    data,
  })
}

export async function getPfById(id: string){
  return ApiService.fetchData({
    url: endpoints.compliances.getById(id),
    method: 'get',
  })
}
export async function createPf(data: any){
  return ApiService.fetchData({
    url: endpoints.compliances.create(),
    method: 'post',
    data,
  })
}
export async function updatePf(id: string, data: any){
  return ApiService.fetchData({
    url: endpoints.compliances.update(id),
    method: 'put',
    data,
  })
}
