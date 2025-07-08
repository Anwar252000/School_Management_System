"use client"
import { EmployeesData, useFetchEmployeesQuery } from '@/services/apis/employeeService'
import React from 'react'
import AddEmployeeLeave from './add-employee-leave'
import { BreadcrumbItem, Breadcrumbs } from '@/components/ui/breadcrumbs'
import EmployeeLeaveListTable from './employee-leave-table'
import { EmployeeLeaveData, useFetchEmployeeLeaveQuery } from '@/services/apis/employeeLeaveService'

const page = () => {


const {data: employeeData , refetch:empRefetch} = useFetchEmployeesQuery()
const employees = employeeData?.data as EmployeesData[] || [];
const {data: employeeLeaveData, refetch} = useFetchEmployeeLeaveQuery()
const employeeLeaves = employeeLeaveData?.data as EmployeeLeaveData[] || []

const handleRefetch = () => {
  empRefetch();
  refetch();

}

  return (
    <React.Fragment>
      <div>
        <Breadcrumbs>
                <BreadcrumbItem>Administration</BreadcrumbItem>
                <BreadcrumbItem className="text-primary">Employees Leave</BreadcrumbItem>
              </Breadcrumbs>
      </div>
      <div>
      <AddEmployeeLeave refetch={handleRefetch} employees={employees}/>
      <EmployeeLeaveListTable refetch={handleRefetch} leaves={employeeLeaves}/>
      </div>

    </React.Fragment>
  )
}

export default page
