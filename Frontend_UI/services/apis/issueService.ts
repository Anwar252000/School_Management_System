import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";

export interface IssueData {
  bookIssueId?:number;
  bookId: number;
  bookTitle: string;
  issuedTo: string;
  issuedDate: string | Date;
  advancePayment: number;
  createdAt?: Date;
  createdBy?: number;
  issueDate:string | Date;
  updatedBy?: number; 
  isActive?: boolean 
}

export const issueApi = createApi({
  reducerPath: "issueApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}BookIssue/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Issue"],
  endpoints: (builder) => ({
    fetchIssues: builder.query<ApiResponse<IssueData[]>, void>({
      query: () => "GetIssue",
      providesTags: ["Issue"],
    }),

    addIssue: builder.mutation<ApiResponse<IssueData>, IssueData>({
      query: (issueData) => ({
        url: "AddIssue",
        method: "POST",
        body: issueData,
      }),
      invalidatesTags: ["Issue"],
    }),

    updateIssue: builder.mutation<ApiResponse<void>, IssueData>({
      query: (issueData) => ({
        url: "UpdateIssue",
        method: "PUT",
        body: issueData,
      }),
      invalidatesTags: ["Issue"],
    }),

    deleteIssue: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `DeleteIssue?issueId=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Issue"],
    }),
  }),
});

export const {
  useFetchIssuesQuery,
  useAddIssueMutation,
  useUpdateIssueMutation,
  useDeleteIssueMutation,
} = issueApi;

export default issueApi;
