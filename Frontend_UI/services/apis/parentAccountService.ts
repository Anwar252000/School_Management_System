import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";
import { AccountData } from "./accountService";

export interface ParentAccountData {
  parentAccountId?: number,
  accountGroupId?: number,
  accountGroupName?: string,
  parentAccountCode?: string,
  parentAccountName?: string,
  createdAt?: Date,
  createdBy?: number | null,
  updatedAt?: Date,
  updatedBy?: number
  controllingAccount?: AccountData[];
}

export const parentAccountApi = createApi({
  reducerPath: "parentAccountApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}ParentAccount/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ["ParentAccount"],

  endpoints: (builder) => ({
    fetchParentAccounts: builder.query<ApiResponse<ParentAccountData[]>, void>({
      query: () => "GetAllParentAccounts",
      providesTags: ["ParentAccount"],
    }),
    
    fetchParentAccountById: builder.query<ApiResponse<ParentAccountData>, number>({
      query: (id) => `GetParentAccountById?id=${id}`,
    }),
    addParentAccount: builder.mutation<ApiResponse<ParentAccountData>, ParentAccountData>({
      query: (parentAccountData) => ({
        url: "AddParentAccount",
        method: "POST",
        body: parentAccountData,
      }),
      invalidatesTags: ["ParentAccount"],
    }),
    updateParentAccount: builder.mutation<ApiResponse<void>, ParentAccountData>({
      query: (parentAccountData) => ({
        url: "UpdateParentAccount",
        method: "PUT",
        body: parentAccountData,
      }),
      invalidatesTags: ["ParentAccount"],
    }),
    deleteParentAccount: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `DeleteParentAccount?parentAccountId=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ParentAccount"],
    }),
  }),
});

export const {
useFetchParentAccountsQuery,
useFetchParentAccountByIdQuery,
useAddParentAccountMutation,
useUpdateParentAccountMutation,
useDeleteParentAccountMutation
} = parentAccountApi;

export default parentAccountApi;
