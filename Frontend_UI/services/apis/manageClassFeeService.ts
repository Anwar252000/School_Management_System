import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";

export interface ClassFeeData {
  classFeeId?: number;
  amount?: number;
  classId?: number;
  feeCategoryId?: number;
  feeName?: string;
  campusId?: number;
  className?: string;
  campusName?: string;
  feeCategory?: string;
  createdAt?: Date | string | null;
  createdBy?: number;
  updatedBy?: number;
  updatedAt?: Date;
  isActive?: boolean;
}

export const classFeeApi = createApi({
  reducerPath: "classFeeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}ClassFee/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchClassFee: builder.query<ApiResponse<ClassFeeData[]>, void>({
      query: () => "GetClassFee",
    }),
    fetchClassFeeById: builder.query<ApiResponse<ClassFeeData>, number>({
      query: (id) => `GetClassFeeById/${id}`,
    }),
    addClassFee: builder.mutation<ApiResponse<ClassFeeData>, ClassFeeData>({
      query: (classFeeData) => ({
        url: "AddClassFee",
        method: "POST",
        body: classFeeData,
      }),
    }),
    updateClassFee: builder.mutation<ApiResponse<void>, ClassFeeData>({
      query: (classFeeData) => ({
        url: "UpdateClassFee",
        method: "PUT",
        body: classFeeData,
      }),
    }),
    deleteClassFee: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `DeleteClassFee?classFeeId=${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useFetchClassFeeQuery,
  useFetchClassFeeByIdQuery,
  useAddClassFeeMutation,
  useUpdateClassFeeMutation,
  useDeleteClassFeeMutation,
} = classFeeApi;

export default classFeeApi;
