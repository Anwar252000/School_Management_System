import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";

export interface InventoryItemData {
  itemId?: number,
  itemDetailId?: number,
  categoryId?: number,
  statusId?: number,
  itemName: string,
  categoryName?: string,
  tagNumber?: string,
  statusName?: string,
  unitPrice: number,
  totalQuantity: number,
  reorderLevel?: number,
  description?: string,
  isActive?: boolean,
  createdBy?: number,
  createdAt?: Date,
}

export const inventoryItemApi = createApi({
  reducerPath: "inventoryItemApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}InventoryItem/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Item", "Stock"],

  endpoints: (builder) => ({
    fetchInventoryItems: builder.query<ApiResponse<InventoryItemData[]>, void>({
      query: () => "GetInventoryItems",
      providesTags: ["Item"],
    }),
    fetchInventoryItemDetailsByItemId: builder.query<ApiResponse<InventoryItemData[]>, number>({
      query: (id) => `GetItemDetailsByItemId?itemId=${id}`,
      providesTags: ["Item", "Stock"],
    }),
    fetchInventoryItemById: builder.query<ApiResponse<InventoryItemData>, number>({
      query: (id) => `GetInventoryItemById?id=${id}`,
    }),
    addInventoryItem: builder.mutation<ApiResponse<InventoryItemData>, InventoryItemData>({
      query: (inventoryItemData) => ({
        url: "AddInventoryItem",
        method: "POST",
        body: inventoryItemData,
      }),
      invalidatesTags: ["Item", "Stock"],
    }),
    updateInventoryItem: builder.mutation<ApiResponse<void>, InventoryItemData>({
      query: (inventoryItemData) => ({
        url: "UpdateInventoryItem",
        method: "PUT",
        body: inventoryItemData,
      }),
      invalidatesTags: ["Item", "Stock"],
    }),

    updateItemDetailStatus: builder.mutation<ApiResponse<void>, {itemDetailId: number; statusId: number}>({
      query: ({itemDetailId, statusId}) => ({
        url: "UpdateItemDetailStatus",
        method: "PUT",
        body: { itemDetailId, statusId},
      }),
      invalidatesTags: ["Item", "Stock"],
    }),

    deleteInventoryItem: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `DeleteInventoryItem?inventoryItemId=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Item", "Stock"],
    }),
  }),
});

export const {
useFetchInventoryItemsQuery,
useFetchInventoryItemDetailsByItemIdQuery,
useFetchInventoryItemByIdQuery,
useAddInventoryItemMutation,
useUpdateInventoryItemMutation,
useUpdateItemDetailStatusMutation,
useDeleteInventoryItemMutation,
} = inventoryItemApi;

export default inventoryItemApi;
