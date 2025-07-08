import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";

export interface InventoryStatusData {
  statusId?: number,
  statusName: string,
  isActive?: boolean,
  createdBy?: number,
  createdAt?: Date,
}

export const inventoryStatusApi = createApi({
  reducerPath: "inventoryStatusApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}InventoryStatus/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Item"],

  endpoints: (builder) => ({
    fetchInventoryStatus: builder.query<ApiResponse<InventoryStatusData[]>, void>({
      query: () => "GetInventoryStatus",
      providesTags: ["Item"],
    }),
    
    fetchInventoryStatusById: builder.query<ApiResponse<InventoryStatusData>, number>({
      query: (id) => `GetInventoryStatusById?id=${id}`,
    }),
    addInventoryStatus: builder.mutation<ApiResponse<InventoryStatusData>, InventoryStatusData>({
      query: (inventoryStatusData) => ({
        url: "AddInventoryStatus",
        method: "POST",
        body: inventoryStatusData,
      }),
      invalidatesTags: ["Item"],
    }),
    updateInventoryStatus: builder.mutation<ApiResponse<void>, InventoryStatusData>({
      query: (inventoryStatusData) => ({
        url: "UpdateInventoryStatus",
        method: "PUT",
        body: inventoryStatusData,
      }),
      invalidatesTags: ["Item"],
    }),
    deleteInventoryStatus: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `DeleteInventoryStatus?inventoryStatusId=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Item"],
    }),
  }),
});

export const {
useFetchInventoryStatusQuery,
useFetchInventoryStatusByIdQuery,
useAddInventoryStatusMutation,
useUpdateInventoryStatusMutation,
useDeleteInventoryStatusMutation,
} = inventoryStatusApi;

export default inventoryStatusApi;
