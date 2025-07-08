import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";

export interface InventoryCategoryData {
  categoryId: number,
  categoryName: string,
  description?: string,
  isActive?: boolean,
  createdBy?: number,
  createdAt?: Date,
}

export const inventoryCategoryApi = createApi({
  reducerPath: "inventoryCategoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}InventoryCategory/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Category"],

  endpoints: (builder) => ({
    fetchInventoryCategories: builder.query<ApiResponse<InventoryCategoryData[]>, void>({
      query: () => "GetInventoryCategories",
      providesTags: ["Category"],
    }),
    
    fetchInventoryCategoryById: builder.query<ApiResponse<InventoryCategoryData>, number>({
      query: (id) => `GetInventoryCategoryById?id=${id}`,
    }),
    addInventoryCategory: builder.mutation<ApiResponse<InventoryCategoryData>, InventoryCategoryData>({
      query: (inventoryCategoryData) => ({
        url: "AddInventoryCategory",
        method: "POST",
        body: inventoryCategoryData,
      }),
      invalidatesTags: ["Category"],
    }),
    updateInventoryCategory: builder.mutation<ApiResponse<void>, InventoryCategoryData>({
      query: (inventoryCategoryData) => ({
        url: "UpdateInventoryCategory",
        method: "PUT",
        body: inventoryCategoryData,
      }),
      invalidatesTags: ["Category"],
    }),
    deleteInventoryCategory: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `DeleteInventoryCategory?inventoryCategoryId=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
useFetchInventoryCategoriesQuery,
useFetchInventoryCategoryByIdQuery,
useAddInventoryCategoryMutation,
useUpdateInventoryCategoryMutation,
useDeleteInventoryCategoryMutation,
} = inventoryCategoryApi;

export default inventoryCategoryApi;
