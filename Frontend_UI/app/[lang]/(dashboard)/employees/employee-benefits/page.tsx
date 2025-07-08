"use client"
import { EmployeeBenefitData, useFetchEmployeeBenefitsQuery } from '@/services/apis/employeeBenefitsService';
import React from 'react'
import ViewEmployeeBenefits from './view-employee-benefits';
import { EmployeesData, useFetchEmployeesQuery } from '@/services/apis/employeeService';
import { BreadcrumbItem, Breadcrumbs } from '@/components/ui/breadcrumbs';
import AddEmployeeBenefit from './add-employee-benefits';

const page = () => {

  // Fetch employee benefits data using the custom hook
  const { data, error, isLoading, refetch } = useFetchEmployeeBenefitsQuery();
  const employeeBenefits = data?.data as EmployeeBenefitData[] || [];
const {data: employee, error: employeeError, isLoading: employeeLoading} = useFetchEmployeesQuery();
const employees = employee?.data as EmployeesData[] || [];

  const handleRefetch = () => {
  refetch();
  }
  return (
    <>
    <div>
      <Breadcrumbs>
        <BreadcrumbItem>Administration</BreadcrumbItem>
        <BreadcrumbItem className="text-primary">Employee Benefits</BreadcrumbItem>
      </Breadcrumbs>
    </div>
    <div className="mt-4">
      
      <AddEmployeeBenefit refetch={handleRefetch} employees={employees} />
      <ViewEmployeeBenefits employees={employees} employeeBenefits={employeeBenefits} refetch={handleRefetch} />
    </div>
      </>
  )
}

export default page
