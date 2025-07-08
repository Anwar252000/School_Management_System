import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";

export interface SubjectData {
  subjectId?: number;
  subjectName: string;
  subjectDescription?: string;
  isActive?: boolean;
}

export const subjectApi = createApi({
  reducerPath: "subjectApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}Subject/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchSubject: builder.query<ApiResponse<SubjectData[]>, void>({
      query: () => "GetSubject",
    }),
    fetchSubjectById: builder.query<ApiResponse<SubjectData>, number>({
      query: (id) => `GetSubjectById/${id}`,
    }),
    addSubject: builder.mutation<ApiResponse<SubjectData>, SubjectData>({
      query: (subjectData) => ({
        url: "AddSubject",
        method: "POST",
        body: subjectData,
      }),
    }),
    updateSubject: builder.mutation<ApiResponse<void>, SubjectData>({
      query: (subjectData) => ({
        url: "UpdateSubject",
        method: "PUT",
        body: subjectData,
      }),
    }),
    deleteSubject: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `DeleteSubject?subjectId=${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAddSubjectMutation,
  useFetchSubjectQuery,
  useFetchSubjectByIdQuery,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation
} = subjectApi;

export default subjectApi;
