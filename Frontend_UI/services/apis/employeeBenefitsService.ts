
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "./apiResponse";



export interface EmployeeBenefitData {
  benefitId?: number;
  employeeId?: number;
  employeeName?: string;
  benefitType?: string;
  description?: string;
  createdBy?: number;
}

export const employeeBenefitsApi = createApi({
  reducerPath: "employeeBenefitsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}EmployeeBenefits`,
    prepareHeaders: (headers) => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchEmployeeBenefits: builder.query<ApiResponse, void>({
      query: () => "GetEmployeeBenefits",
   }),
    addEmployeeBenefits: builder.mutation<ApiResponse, EmployeeBenefitData>({
      query: (data) => ({
        url: "AddEmployeeBenefits",
        method: "POST",
        body: data,
      }),
    }),
    updateEmployeeBenefits: builder.mutation<ApiResponse, EmployeeBenefitData>({
      query: (data) => ({
        url: `UpdateEmployeeBenefits`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteEmployeeBenefits: builder.mutation<ApiResponse, number>({
      query: (id) => ({
        url: `DeleteEmployeeBenefits?employeeBenefitId=${id}`,
        method: "DELETE",
      }),
    }),
 
})
  })
  export const {
    useFetchEmployeeBenefitsQuery,
    useAddEmployeeBenefitsMutation,
    useUpdateEmployeeBenefitsMutation,
    useDeleteEmployeeBenefitsMutation,
  } = employeeBenefitsApi;
export default employeeBenefitsApi;


