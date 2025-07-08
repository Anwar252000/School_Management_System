import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";

export interface DocumentData {
  documentManagerId?: number; // This should match the backend DTO
  documentTitle?: string;
  filePath?: string;
  documentType?: string;
  fileName?: string;
  formFile?: File;
  createdBy?: number;
  createdUser?: string;
  createdAt?: string;
  updatedBy?: number;
  updatedAt?: string;
  updatedUser?: string;
  isActive?: boolean;
 
}

export const documentApi = createApi({
  reducerPath: "documentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}DocumentManager`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAllFile: builder.query<ApiResponse<DocumentData[]>, void>({
      query: () => "GetAllFile",
    }),

    uploadFile: builder.mutation<ApiResponse<DocumentData>, FormData>({
      query: (formData) => ({
        url: "UploadFile",
        method: "POST",
        body: formData,
      }),
    }),

    updateDocument: builder.mutation<ApiResponse<DocumentData>, FormData>({
      query: (formData) => ({
        url: "UpdateDocument",
        method: "PUT",
        body: formData,
      }),
    }),

    deleteDocument: builder.mutation<ApiResponse<null>, number>({
      query: (documentId) => ({
        url: `DeleteDocument?documentId=${documentId}`,
        method: "DELETE",
      }),
    }),

    downloadDocument: builder.query<Blob, number>({
      query: (id) => ({
        url: `Download?id${id}`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useGetAllFileQuery,
  useUploadFileMutation,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
  useDownloadDocumentQuery,
} = documentApi;

export default documentApi;
