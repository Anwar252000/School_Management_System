import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";

export interface DailyExpenseData {
  dailyExpenseId?: number;
  item: string;
  expenseCategoryId: number;
  categoryName?: string;
  description?: string;
  amount: number;
  totalAmount?: number;
  quantity: number;
  amountDate: string;
  amountType: string;
  isActive?: boolean;
  createdAt?: string;
  createdBy: number;
  updatedAt?: string;
  updatedBy?: number;
}

export const dailyExpenseApi = createApi({
  reducerPath: "dailyExpenseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}DailyExpense/`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchDailyExpenses: builder.query<ApiResponse, void>({
      query: () => "GetAllDailyExpenses",
    }),
    addDailyExpense: builder.mutation<ApiResponse, DailyExpenseData>({
      query: (data) => ({
        url: "AddDailyExpense",
        method: "POST",
        body: data,
      }),
    }),
    updateDailyExpense: builder.mutation<ApiResponse, DailyExpenseData>({
      query: (data) => ({
        url: "UpdateDailyExpense",
        method: "PUT",
        body: data,
      }),
    }),
    deleteDailyExpense: builder.mutation<ApiResponse, number>({
      query: (id) => ({
        url: `DeleteDailyExpense?dailyExpenseId=${id}`,
        method: "DELETE",
      }),
    }),

    fetchExpenseCategories: builder.query<ApiResponse, void>({
      query: () => "GetExpenseCategories", 
    }),
  }),
});

export const {
  useFetchDailyExpensesQuery,
  useAddDailyExpenseMutation,
  useUpdateDailyExpenseMutation,
  useDeleteDailyExpenseMutation,
  useFetchExpenseCategoriesQuery, 
} = dailyExpenseApi;

export default dailyExpenseApi;
