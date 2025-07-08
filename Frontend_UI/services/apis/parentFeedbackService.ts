import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";

export interface FeedbackData {
  parentFeedbackId?: number;
  feedbackText?: string;
  studentName?: string;
  parentName?: string;
  studentId?: number;
  parentId?: number;
  dateSubmitted?: Date | string;
  createdBy?:number;
  isActive: boolean;
}

export const parentFeedbackApi = createApi({
  reducerPath: "parentFeedbackApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}ParentFeedback/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    fetchParentFeedbacks: builder.query<ApiResponse<FeedbackData[]>, void>({
      query: () => "GetAllParentFeedbacks",
    }),
    addParentFeedback: builder.mutation<ApiResponse<FeedbackData>, FeedbackData>({
      query: (ParentFeedbackData) => ({
        url: "AddParentFeedback",
        method: "POST",
        body: ParentFeedbackData,
      }),
    }),
    updateParentFeedback: builder.mutation<ApiResponse<void>, FeedbackData>({
      query: (ParentFeedbackData) => ({
        url: "UpdateParentFeedback",
        method: "PUT",
        body: ParentFeedbackData,
      }),
    }),
    deleteParentFeedback: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `DeleteParentFeedback?parentFeedbackId=${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
useFetchParentFeedbacksQuery,
useAddParentFeedbackMutation,
useUpdateParentFeedbackMutation,
useDeleteParentFeedbackMutation, 

} = parentFeedbackApi;

export default parentFeedbackApi;
