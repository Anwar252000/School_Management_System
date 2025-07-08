import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";

export interface InventoryPurchaseData {
  purchaseId?: number,
  itemId?: number,
  itemName?: string,
  supplierName: string,
  quantity?: number,
  unitPrice?: number,
  totalCost?: number,
  purchaseDate?: string,
  invoiceNumber?: string,
  remarks?: string,
  isActive?: boolean,
  createdBy?: number,
  createdAt?: Date,
}

export const inventoryPurchaseApi = createApi({
  reducerPath: "inventoryPurchaseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}InventoryPurchase/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Purchase"],

  endpoints: (builder) => ({
    fetchInventoryPurchases: builder.query<ApiResponse<InventoryPurchaseData[]>, void>({
      query: () => "GetInventoryPurchases",
      providesTags: ["Purchase"],
    }),
    
    fetchInventoryPurchaseById: builder.query<ApiResponse<InventoryPurchaseData>, number>({
      query: (id) => `GetInventoryPurchaseById?id=${id}`,
    }),
    addInventoryPurchase: builder.mutation<ApiResponse<InventoryPurchaseData>, InventoryPurchaseData>({
      query: (inventoryPurchaseData) => ({
        url: "AddInventoryPurchase",
        method: "POST",
        body: inventoryPurchaseData,
      }),
      invalidatesTags: ["Purchase"],
    }),
    updateInventoryPurchase: builder.mutation<ApiResponse<void>, InventoryPurchaseData>({
      query: (inventoryPurchaseData) => ({
        url: "UpdateInventoryPurchase",
        method: "PUT",
        body: inventoryPurchaseData,
      }),
      invalidatesTags: ["Purchase"],
    }),
    deleteInventoryPurchase: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `DeleteInventoryPurchase?purchaseId=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Purchase"],
    }),
  }),
});

export const {
  useFetchInventoryPurchasesQuery,
  useFetchInventoryPurchaseByIdQuery,
  useAddInventoryPurchaseMutation,
  useUpdateInventoryPurchaseMutation,
  useDeleteInventoryPurchaseMutation,
} = inventoryPurchaseApi;

export default inventoryPurchaseApi;
