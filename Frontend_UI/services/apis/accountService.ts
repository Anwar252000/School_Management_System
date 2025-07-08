import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";

export interface AccountData {
  accountId?: number,
  parentAccountId?: number,
  parentAccountName?: string,
  accountName?: string,
  accountCode?: string,
  isSubAccount?: boolean,
  createdAt?: Date,
  createdBy?: number,
  updatedAt?: Date,
  updatedBy?: number
}

export const accountApi = createApi({
  reducerPath: "accountApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}Account/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Account"],

  endpoints: (builder) => ({
    fetchAccounts: builder.query<ApiResponse<AccountData[]>, void>({
      query: () => "GetAllAccounts",
      providesTags: ["Account"],
    }),
    
    fetchAccountById: builder.query<ApiResponse<AccountData>, number>({
      query: (id) => `GetAccountById?id=${id}`,
    }),

    addAccount: builder.mutation<ApiResponse<AccountData>, AccountData>({
      query: (accountData) => ({
        url: "AddAccount",
        method: "POST",
        body: accountData,
      }),
      invalidatesTags: ["Account"],
    }),

    updateAccount: builder.mutation<ApiResponse<void>, AccountData>({
      query: (accountData) => ({
        url: "UpdateAccount",
        method: "PUT",
        body: accountData,
      }),
      invalidatesTags: ["Account"],
    }),

    deleteAccount: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `DeleteAccount?accountId=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Account"],
    }),
  }),
});

export const {
useFetchAccountsQuery,
useFetchAccountByIdQuery,
useAddAccountMutation,
useUpdateAccountMutation,
useDeleteAccountMutation
} = accountApi;

export default accountApi;
