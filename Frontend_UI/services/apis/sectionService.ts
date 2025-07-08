import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";
export interface SectionData {
  sectionId?: number;
  sectionName: string;
  capacity: number;
  classId?: number;
  className?: string;
  createdAt?: Date;
  createdBy?: number;
  updatedBy?: number;
  updatedAt?: Date;
  isActive?: boolean;
}

export const sectionApi = createApi({
  reducerPath: "sectionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}Section/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchSection: builder.query<ApiResponse<SectionData[]>, void>({
      query: () => "GetSection",
    }),
    fetchSectionById: builder.query<ApiResponse<SectionData>, number>({
      query: (id) => `GetSectionById/${id}`,
    }),
    addSection: builder.mutation<ApiResponse<SectionData>, SectionData>({
      query: (sectionData) => ({
        url: "AddSection",
        method: "POST",
        body: sectionData,
      }),
    }),
    updateSection: builder.mutation<ApiResponse<void>, SectionData>({
      query: (sectionData) => ({
        url: "UpdateSection",
        method: "PUT",
        body: sectionData,
      }),
    }),
    deleteSection: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `DeleteSection?sectionId=${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useFetchSectionQuery,
  useFetchSectionByIdQuery,
  useAddSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
} = sectionApi;

export default sectionApi;
