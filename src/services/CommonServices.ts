import { CommonStateData } from "@/@types/commonApi";
import ApiService from "./ApiService";

export async function getAllCompanies() {
    return ApiService.fetchData<CommonStateData[]>({
        url: '/states',
        method: 'get',
    });
}