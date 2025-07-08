import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";

export interface InventoryStockData {
  stockId?: number,
  itemId?: number,
  itemName?: string,
  categoryName?: string,
  currentStock?: number,
  totalStockIn?: number,
  totalStockOut?: number,
  statusId?: number,
  statusName?: string,
  quantity?: number,
  transactionType?: string,
  transactionDate?: string,
  remarks?: string,
  isActive?: boolean,
  updatedBy?: number,
  createdBy?: number,
  createdAt?: Date,
}

export const inventoryStockApi = createApi({
  reducerPath: "inventoryStockApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}InventoryStock/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Stock"],

  endpoints: (builder) => ({
    fetchInventoryStocks: builder.query<ApiResponse<InventoryStockData[]>, void>({
      query: () => "GetInventoryStocks",
      providesTags: ["Stock"],
    }),

    fetchInventoryStocksByItemId: builder.query<ApiResponse<InventoryStockData[]>, number>({
      query: (itemId) => `GetInventoryStocksByItemId?itemId=${itemId}`,
      providesTags: ["Stock"],
    }),
    
    fetchInventoryStockById: builder.query<ApiResponse<InventoryStockData>, number>({
      query: (id) => `GetInventoryStockById?id=${id}`,
    }),
    addInventoryStock: builder.mutation<ApiResponse<InventoryStockData>, InventoryStockData>({
      query: (inventoryStockData) => ({
        url: "AddInventoryStock",
        method: "POST",
        body: inventoryStockData,
      }),
      invalidatesTags: ["Stock"],
    }),
    updateInventoryStock: builder.mutation<ApiResponse<void>, InventoryStockData>({
      query: (inventoryStockData) => ({
        url: "UpdateInventoryStock",
        method: "PUT",
        body: inventoryStockData,
      }),
      invalidatesTags: ["Stock"],
    }),
    deleteInventoryStock: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `DeleteInventoryStock?inventoryStockId=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Stock"],
    }),
  }),
});

export const {
useFetchInventoryStocksQuery,
useFetchInventoryStocksByItemIdQuery,
useFetchInventoryStockByIdQuery,
useAddInventoryStockMutation,
useUpdateInventoryStockMutation,
useDeleteInventoryStockMutation,
} = inventoryStockApi;

export default inventoryStockApi;
