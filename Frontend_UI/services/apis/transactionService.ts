import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";

export interface TransactionDetail {
  transactionDetailId?: number,
  accountId: string,
  description: string,
  debitAmount: number,
  creditAmount: number,
  isActive?: boolean
  createdAt?: Date,
}

export interface TransactionData {
  transactionId?: number,
  voucherTypeId?: number,
  voucherType?: string,
  voucherNo?: string,
  payee: string,
  messer?: string,
  entryDate?: Date,
  status?: string,
  transactionDetail: TransactionDetail[],
  isActive?: boolean,
  createdAt?: Date,
  createdBy?: number,
  updatedAt?: Date,
  updatedBy?: number
}

export const transactionApi = createApi({
  reducerPath: "transactionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}Transaction/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Transaction"],

  endpoints: (builder) => ({
    fetchTransactions: builder.query<ApiResponse<TransactionData[]>, void>({
      query: () => "GetAllTransactions",
      providesTags: ["Transaction"],
    }),
    
    fetchTransactionById: builder.query<ApiResponse<TransactionData>, number>({
      query: (id) => `GetTransactionById?id=${id}`,
    }),

    addTransaction: builder.mutation<ApiResponse<TransactionData>, TransactionData>({
      query: (transactionData) => ({
        url: "AddTransaction",
        method: "POST",
        body: transactionData,
      }),
      invalidatesTags: ["Transaction"],
    }),

    updateTransaction: builder.mutation<ApiResponse<void>, TransactionData>({
      query: (transactionData) => ({
        url: "UpdateTransaction",
        method: "PUT",
        body: transactionData,
      }),
      invalidatesTags: ["Transaction"],
    }),

    deleteTransaction: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `DeleteTransaction?transactionId=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Transaction"],
    }),
  }),
});

export const {
useFetchTransactionsQuery,
useFetchTransactionByIdQuery,
useAddTransactionMutation,
useUpdateTransactionMutation,
useDeleteTransactionMutation
} = transactionApi;

export default transactionApi;
