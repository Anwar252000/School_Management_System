import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";

export interface PeriodData {
  periodId?: number;
  periodName: string;
  startTime: string;
  endTime: string;
  isActive?: boolean;
}

export const periodApi = createApi({
  reducerPath: "periodApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}Period/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    fetchPeriods: builder.query<ApiResponse<PeriodData[]>, void>({
      query: () => "GetAllPeriods",
    }),
    fetchPeriodById: builder.query<ApiResponse<PeriodData>, number>({
      query: (id) => `GetPeriodById/${id}`,
    }),
    addPeriod: builder.mutation<ApiResponse<PeriodData>, PeriodData>({
      query: (PeriodData) => ({
        url: "AddPeriod",
        method: "POST",
        body: PeriodData,
      }),
    }),
    updatePeriod: builder.mutation<ApiResponse<void>, PeriodData>({
      query: (PeriodData) => ({
        url: "UpdatePeriod",
        method: "PUT",
        body: PeriodData,
      }),
    }),
    deletePeriod: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `DeletePeriod?periodId=${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useFetchPeriodsQuery,
  useFetchPeriodByIdQuery,
  useAddPeriodMutation,
  useUpdatePeriodMutation,
  useDeletePeriodMutation,
} = periodApi;

export default periodApi;
