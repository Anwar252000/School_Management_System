import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";
import { DepartmentData } from "./departmentService";

export interface CampusData {
  campusId?: number;
  campusName: string;
  address: string;
  country?: string;
  state?: string;
  city?: string;
  postalCode?: string;
  phoneNumber?: string;
  email?: string;

  departments?: DepartmentData[] | null;
}

export const campusApi = createApi({
  reducerPath: "campusApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}campuses/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchCampuses: builder.query<ApiResponse<CampusData[]>, void>({
      query: () => "GetCampuses",
    }),
    fetchCampusById: builder.query<ApiResponse<CampusData>, number>({
      query: (id) => `GetCampusById/${id}`,
    }),
    addCampus: builder.mutation<ApiResponse<CampusData>, CampusData>({
      query: (campusData) => ({
        url: "AddCampus",
        method: "POST",
        body: campusData,
      }),
    }),
    updateCampus: builder.mutation<ApiResponse<void>, CampusData>({
      query: (campusData) => ({
        url: "UpdateCampus",
        method: "PUT",
        body: campusData,
      }),
    }),
    deleteCampus: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `DeleteCampus?campusId=${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useFetchCampusesQuery,
  useFetchCampusByIdQuery,
  useAddCampusMutation,
  useUpdateCampusMutation,
  useDeleteCampusMutation,
} = campusApi;

export default campusApi;
