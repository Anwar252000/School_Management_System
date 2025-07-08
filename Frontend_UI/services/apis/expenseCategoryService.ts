// expenseCategoryApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";

export interface ExpenseCategoryData {
  expenseCategoryId?: number;
  categoryName: string;
  createdBy?: number;
}

export const expenseCategoryApi = createApi({
  reducerPath: "expenseCategoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}ExpenseCategory/`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchExpenseCategories: builder.query<ApiResponse, void>({
      query: () => "GetAllExpenseCategories",
    }),
    addExpenseCategory: builder.mutation<ApiResponse, Partial<ExpenseCategoryData>>({
      query: (data) => ({
        url: "AddExpenseCategory",
        method: "POST",
        body: data,
      }),
    }),
    updateExpenseCategory: builder.mutation<ApiResponse, ExpenseCategoryData>({
      query: (data) => ({
        url: "UpdateExpenseCategory",
        method: "PUT",
        body: data,
      }),
    }),
    deleteExpenseCategory: builder.mutation<ApiResponse, number>({
      query: (id) => ({
        url: `DeleteExpenseCategory?categoryId=${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useFetchExpenseCategoriesQuery,
  useAddExpenseCategoryMutation,
  useUpdateExpenseCategoryMutation,
  useDeleteExpenseCategoryMutation,
} = expenseCategoryApi;

export default expenseCategoryApi;
