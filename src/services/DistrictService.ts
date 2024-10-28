import { DistrictData } from "@/@types/district";
import ApiService from "./LoginApiService";
import { endpoints } from "@/api/endpoint";

export async function getDistricts() {
  return ApiService.fetchData({
    url: endpoints.district.getAll(),
    method: 'get',
  });
}

export async function getDistrictById(id: string) {
  return ApiService.fetchData({
    url: endpoints.district.getById(id),
    method: 'get',
  });
}

export async function createDistrict(data: DistrictData) {
  return ApiService.fetchData({
    url: endpoints.district.create(),
    method: 'post',
    data,
  });
}

export async function updateDistrict(id: string, data: DistrictData) {
  return ApiService.fetchData({
    url: endpoints.district.update(id),
    method: 'put',
    data,
  });
}

