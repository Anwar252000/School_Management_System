import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";
import { ParentAccountData } from "./parentAccountService";

export interface AccountGroupData {
  accountGroupId: number,
  accountGroupCode: string,
  accountGroupName: string,
  normalBalance: string,
  createdAt?: Date,
  parentAccount?: ParentAccountData[];
}

export const accountGroupApi = createApi({
  reducerPath: "accountGroupApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}AccountGroup/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ["AccountGroup"],

  endpoints: (builder) => ({
    fetchAccountGroups: builder.query<ApiResponse<AccountGroupData[]>, void>({
      query: () => "GetAccountGroups",
      providesTags: ["AccountGroup"],
    }),

    fetchAccountHierarchy: builder.query<ApiResponse<AccountGroupData[]>, void>({
      query: () => "GetAccountHierarchy",
      providesTags: ["AccountGroup"],
    }),
    
    fetchAccountGroupById: builder.query<ApiResponse<AccountGroupData>, number>({
      query: (id) => `GetAccountGroupById?id=${id}`,
    }),
    addAccountGroup: builder.mutation<ApiResponse<AccountGroupData>, AccountGroupData>({
      query: (accountGroupData) => ({
        url: "AddAccountGroup",
        method: "POST",
        body: accountGroupData,
      }),
      invalidatesTags: ["AccountGroup"],
    }),
    updateAccountGroup: builder.mutation<ApiResponse<void>, AccountGroupData>({
      query: (accountGroupData) => ({
        url: "UpdateAccountGroup",
        method: "PUT",
        body: accountGroupData,
      }),
      invalidatesTags: ["AccountGroup"],
    }),
    deleteAccountGroup: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `DeleteAccountGroup?accountGroupId=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AccountGroup"],
    }),
  }),
});

export const {
useFetchAccountGroupsQuery,
useFetchAccountHierarchyQuery,
useFetchAccountGroupByIdQuery,
useAddAccountGroupMutation,
useUpdateAccountGroupMutation,
useDeleteAccountGroupMutation,
} = accountGroupApi;

export default accountGroupApi;
