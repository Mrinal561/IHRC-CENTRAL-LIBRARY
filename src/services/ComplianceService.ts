// import { StateData, StateResponseData } from "@/@types/state";
import { ComplianceData, ComplianceResponseData } from "@/@types/compliance";
import ApiService from "./LoginApiService";
import { endpoints } from "@/api/endpoint";

export async function getCompliances(data: ComplianceData){
  return ApiService.fetchData<ComplianceResponseData>({
    url:'/compliance',
    method: 'get',
    data,
  })
}

export async function getComplianceById(id: string){
  return ApiService.fetchData({
    url: endpoints.compliances.getById(id),
    method: 'get',
  })
}
export async function createCompliance(data: any){
  return ApiService.fetchData({
    url: endpoints.compliances.create(),
    method: 'post',
    data,
  })
}
export async function updateCompliance(id: string, data: any){
  return ApiService.fetchData({
    url: endpoints.compliances.update(id),
    method: 'put',
    data,
  })
}

