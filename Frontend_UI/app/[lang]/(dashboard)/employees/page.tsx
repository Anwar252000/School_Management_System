"use client";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import { useEffect, useState } from "react";
import {
  RoleData,
  useFetchRolesQuery,
} from "@/services/apis/employeeRoleService";
import {
  EmployeesData,
  useFetchEmployeesQuery,
} from "@/services/apis/employeeService";
import AddEmployee from "./manage-employees/add-employee";
import ViewRole from "./employees-role/view-roles";
import EmployeeListTable from "./manage-employees/employee-table";
import {
  CampusData,
  useFetchCampusesQuery,
} from "@/services/apis/campusService";

const Page = () => {
  const {
    data: employeeData,
    isLoading: isEmployeeLoading,
    error: employeeError,
    refetch,
  } = useFetchEmployeesQuery();
  const employee = employeeData?.data as EmployeesData[];
  const {
    data: rolesData,
    isLoading: isRoleLoading,
    error: roleError,
    refetch: roleRefetch,
  } = useFetchRolesQuery();
  const roles = rolesData?.data as RoleData[];
  const { data: campusData } = useFetchCampusesQuery();
  const campuses = (campusData?.data as CampusData[]) || [];

  const handleRefetch = () => {
    refetch();
    roleRefetch();
  };

  return (
    <div>
      <Breadcrumbs>
        <BreadcrumbItem>Administration</BreadcrumbItem>
        <BreadcrumbItem className="text-primary">Employees</BreadcrumbItem>
      </Breadcrumbs>
      <div className="flex justify-end space-x-4 m-2">
        <AddEmployee
          campuses={campuses}
          employeeRole={roles}
          refetch={handleRefetch}
        />
        <ViewRole roles={roles} refetch={handleRefetch} />
      </div>
      <EmployeeListTable
        employees={employee}
        employeeRole={roles}
        refetch={handleRefetch}
      />
    </div>
  );
};

export default Page;
