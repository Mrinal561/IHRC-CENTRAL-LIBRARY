export type DistrictData = {
    name: string;
    state_id: number;
  }

  export type DistrictResponseData = {
    districts: DistrictData[];
    loading: boolean;
    error: string | null;
    currentDistrict: DistrictData | null;

  }