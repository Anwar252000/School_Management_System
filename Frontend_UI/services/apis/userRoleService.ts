import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";
export interface UserRoleData {
  roleId?: number; 
  roleName?: string;
  roleDescription?: string;
  createdAt?: Date;
  createdBy?: number;
  updatedBy?: number;
  updatedAt?: Date;
  isActive?: boolean;
}

export const userRoleApi = createApi({
  reducerPath: "userRoleApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}UserRoles/`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchUserRoles: builder.query<ApiResponse<UserRoleData[]>, void>({
      query: () => "GetUserRoles",
    }),

    fetchUserRoleById: builder.query<ApiResponse<UserRoleData>, number>({
      query: (id) => `GetRoleById?roleId=${id}`,
    }),

    addUserRole: builder.mutation<ApiResponse<UserRoleData>, UserRoleData>({
      query: (userData) => ({
        url: "AddUserRole",
        method: "POST",
        body: userData,
      }),
    }),
    
    updateUserRole: builder.mutation<ApiResponse<void>, UserRoleData>({
      query: (userRoleData) => ({
        url: "UpdateUserRoles",
        method: "PUT",
        body: userRoleData,
      }),
    }),

    deleteUserRole: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `DeleteUserRole?roleId=${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAddUserRoleMutation,
  useFetchUserRolesQuery,
  useFetchUserRoleByIdQuery,
  useDeleteUserRoleMutation,
  useUpdateUserRoleMutation,
} = userRoleApi;

export default userRoleApi;
