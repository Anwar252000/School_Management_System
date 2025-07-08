import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";

export interface GeneralLedgerData {
  entryDate: string,
  voucherNo: string,
  accountCode: string,
  parentAccountId: string,
  parentAccountCode: string,
  accountGroupId: string,
  accountGroupCode: string,
  parentAccountName: string,
  accountGroupName: string,
  accountName: string,
  payee: string,
  description: string,
  debitAmount: number,
  creditAmount: number,
  runningBalance: number
}

export interface TrailBalanceData {
  entryDate: string,
  accountId: number,
  accountCode: string,
  accountName: string,
  debit: number,
  credit: number,
}
export interface IncomeStatementData {
  entryDate: string,
  accountId: number,
  accountGroupName: string,
  accountName: string,
  otherAccounts: string,
  amount: number,
}

export const accountReportsApi = createApi({
  reducerPath: "accountReportsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}Reports/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Reports"],

  endpoints: (builder) => ({
    fetchGeneralLedgers: builder.query<ApiResponse<GeneralLedgerData[]>, void>({
      query: () => "GetGeneralLedger",
      providesTags: ["Reports"],
    }),
    fetchTrialBalance: builder.query<ApiResponse<TrailBalanceData[]>, void>({
      query: () => "GetTrialBalance",
      providesTags: ["Reports"],
    }),
    fetchIncomeStatement: builder.query<ApiResponse<IncomeStatementData[]>, void>({
      query: () => "GetIncomeStatement",
      providesTags: ["Reports"],
    }),
    fetchBalanceSheet: builder.query<ApiResponse<TrailBalanceData[]>, void>({
      query: () => "GetBalanceSheet",
      providesTags: ["Reports"],
    }),

    fetchGeneralLedgersByAccountId: builder.query<ApiResponse<GeneralLedgerData>, number>({
      query: (id) => `GetGeneralLedgerByAccountId?accountId=${id}`,
    }),
  }),
});

export const {
useFetchGeneralLedgersQuery,
useFetchTrialBalanceQuery,
useFetchIncomeStatementQuery,
useFetchBalanceSheetQuery,
useFetchGeneralLedgersByAccountIdQuery,
} = accountReportsApi;

export default accountReportsApi;
