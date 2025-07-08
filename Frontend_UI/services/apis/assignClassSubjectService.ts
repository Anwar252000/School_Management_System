import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";

export interface AssignClassSubjectData {
  classSubjectId?: number;
  classId?: number;
  subjectIds?: number[]; 
  isActive?: boolean;
  subjectName?: string;
  subjects?: string[];
}

export const assignClassSubjectApi = createApi({
  reducerPath: "assignClassSubjectApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}ClassSubjectAssignment/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchClassSubject: builder.query<ApiResponse<AssignClassSubjectData[]>, void>({
      query: () => "GetAllClassSubjectAssignment",
    }),
    fetchClassSubjectById: builder.query<ApiResponse<AssignClassSubjectData>, number>({
      query: (id) => `GetClassSubjectById/${id}`,
    }),
    addClassSubject: builder.mutation<ApiResponse<AssignClassSubjectData>, AssignClassSubjectData>({
      query: (classSubjectData) => ({
        url: "AddClassSubjectAssignment",
        method: "POST",
        body: classSubjectData,
      }),
    }),
    updateClassSubject: builder.mutation<ApiResponse<void>, AssignClassSubjectData>({
      query: (classSubjectData) => ({
        url: "UpdateClassSubjectAssignment",
        method: "PUT",
        body: classSubjectData,
      }),
    }),
    deleteClassSubject: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `DeleteClassSubjectAssignment?classId=${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useFetchClassSubjectQuery,
  useLazyFetchClassSubjectByIdQuery,
  useAddClassSubjectMutation,
  useUpdateClassSubjectMutation,
  useDeleteClassSubjectMutation
} = assignClassSubjectApi;

export default assignClassSubjectApi;
