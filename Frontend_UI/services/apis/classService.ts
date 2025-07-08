import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";

export interface ClassData {
  classId?: number; 
  className?: string;
  classDescription?: string;
  capacity: number;
  createdAt?: Date; 
  createdBy?: number;
  updatedBy?: number;
  updatedAt?: Date; 
  isActive?: boolean;
}

export const classApi = createApi({
  reducerPath: "classApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}Class/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchClass: builder.query<ApiResponse<ClassData[]>, void>({
      query: () => "GetClass",
    }),
    fetchClassById: builder.query<ApiResponse<ClassData>, number>({
      query: (id) => `GetClassById/${id}`,
    }),
    addClass: builder.mutation<ApiResponse<ClassData>, ClassData>({
      query: (classData) => ({
        url: "AddClass",
        method: "POST",
        body: classData,
      }),
    }),
    updateClass: builder.mutation<ApiResponse<void>, ClassData>({
      query: (classData) => ({
        url: "UpdateClass",
        method: "PUT",
        body: classData,
      }),
    }),
    deleteClass: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `DeleteClass?classId=${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
 useAddClassMutation,
 useUpdateClassMutation,
 useDeleteClassMutation,
 useFetchClassQuery,
 useFetchClassByIdQuery
} = classApi;

export default classApi;
