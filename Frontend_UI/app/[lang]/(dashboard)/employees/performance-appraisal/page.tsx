"use client";

import React from "react";
import {
  EmployeesData,
  useFetchEmployeesQuery,
} from "@/services/apis/employeeService";
import {
  EmployeeAppraisalData,
  useFetchEmployeeAppraisalQuery,
} from "@/services/apis/employeePerformanceService";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import AddEmployeeAppraisal from "./add-employee-appraisal";
import EmployeeAppraisalListTable from "./employee-appraisal-list-table";

const page = () => {
  const { data: employeeData, refetch: empRefetch } = useFetchEmployeesQuery();
  const employees = (employeeData?.data as EmployeesData[]) || [];

  const { data: employeeAppraisalData, refetch } =
    useFetchEmployeeAppraisalQuery();
  const employeeAppraisals =
    (employeeAppraisalData?.data as EmployeeAppraisalData[]) || [];

  const handleRefetch = () => {
    empRefetch();
    refetch();
  };

  return (
    <React.Fragment>
      <div>
        <Breadcrumbs>
          <BreadcrumbItem>Administration</BreadcrumbItem>
          <BreadcrumbItem className="text-primary">
            Employee Performance Appraisal
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <div>
        <div className="flex justify-end mb-4">
          <AddEmployeeAppraisal refetch={handleRefetch} employees={employees} />
        </div>
        <EmployeeAppraisalListTable
          refetch={handleRefetch}
          appraisals={employeeAppraisals}
        />
      </div>
    </React.Fragment>
  );
};

export default page;
