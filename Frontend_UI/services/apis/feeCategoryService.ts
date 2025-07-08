import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";

export interface FeeCategoryData {
  feeCategoryId?: number; 
  feeName?: string;
  feeDescription?: string;
  createdAt?: Date; 
  createdBy?: number;
  updatedBy?: number;
  updatedAt?: Date; 
  isActive?: boolean;
}

export const feeCategoryApi = createApi({
  reducerPath: "feeCategoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}FeeCategory/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchFeeCategories: builder.query<ApiResponse<FeeCategoryData[]>, void>({
      query: () => "GetFeeCategories",
    }),
    fetchFeeCategoryById: builder.query<ApiResponse<FeeCategoryData>, number>({
      query: (id) => `GetFeeCategoryById/${id}`,
    }),
    addFeeCategory: builder.mutation<ApiResponse<FeeCategoryData>, FeeCategoryData>({
      query: (feeCategoryData) => ({
        url: "AddFeeCategory",
        method: "POST",
        body: feeCategoryData,
      }),
    }),
    updateFeeCategory: builder.mutation<ApiResponse<void>, FeeCategoryData>({
      query: (feeCategoryData) => ({
        url: "UpdateFeeCategory",
        method: "PUT",
        body: feeCategoryData,
      }),
    }),
    deleteFeeCategory: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `DeleteFeeCategory?feeCategoryId=${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
 useAddFeeCategoryMutation,
 useUpdateFeeCategoryMutation,
 useDeleteFeeCategoryMutation,
 useFetchFeeCategoriesQuery,
 useFetchFeeCategoryByIdQuery
} = feeCategoryApi;

export default feeCategoryApi;
