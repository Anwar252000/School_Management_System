import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ApiResponse } from './apiResponse'; 



export interface RoleData {
  roleId?: number;
  roleName?: string;
  roleDescription?: string;
  createdAt?: Date;
  createdBy?: number;
  updatedBy?: number;
  updatedAt?: Date;
  isActive?: boolean;
}  




export const empRoleApi = createApi({
  reducerPath: 'empRoleApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}EmployeeRoles`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        headers.set('Authorization', `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchRoles: builder.query<ApiResponse, void>({
      query: () => 'GetRoles',
    }),

    fetchRoleById: builder.query<RoleData, number>({
      query: (id) => `GetRoleById/${id}`,
    }),

    addRole: builder.mutation<ApiResponse, RoleData>({
      query: (roleData) => ({
        url: 'AddRole',
        method: 'POST',
        body: roleData,
      }),
    }),

    updateRole: builder.mutation<ApiResponse, RoleData>({
      query: (roleData) => ({
        url: 'UpdateRoles',
        method: 'PUT',
        body: roleData,
      }),
    }),

    deleteRole: builder.mutation<ApiResponse, number>({
      query: (id) => ({
        url: `DeleteRole?roleId=${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useFetchRolesQuery,
  useFetchRoleByIdQuery,
  useAddRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = empRoleApi;

