"use client";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import { useEffect, useState } from "react";
import ViewUserRole from "./userRoles/veiw-user-role";
import UserListTable from "./users/user-table";
import AddUser from "./users/add-user";
import ViewUserPermission from "./userPermission/view-user-permission";
import { useFetchUsersQuery, UserData } from "@/services/apis/userService";
import {
  useFetchUserRolesQuery,
  UserRoleData,
} from "@/services/apis/userRoleService";
import {
  CampusData,
  useFetchCampusesQuery,
} from "@/services/apis/campusService";

const Page = () => {
  const { data: campusData } = useFetchCampusesQuery();
  const campuses = (campusData?.data as CampusData[]) || [];
  const { data: allUsers, refetch } = useFetchUsersQuery();
  const users = (allUsers?.data as UserData[]) || [];
  const { data: allUserRoles, refetch: refetchUserRoles } =
    useFetchUserRolesQuery();
  const userRole = (allUserRoles?.data as UserRoleData[]) || [];

  const handleRefetch = () => {
    refetch();
    refetchUserRoles();
  };

  return (
    <div>
      <Breadcrumbs>
        <BreadcrumbItem>Administration</BreadcrumbItem>
        <BreadcrumbItem className="text-primary">Users</BreadcrumbItem>
      </Breadcrumbs>
      <div className="flex justify-end space-x-4 m-2">
        <ViewUserPermission />

        <AddUser
          users={users}
          refetch={handleRefetch}
          userRole={userRole}
          campuses={campuses}
        />

        <ViewUserRole userRole={userRole} refetch={handleRefetch} />
      </div>

      <UserListTable
        users={users}
        refetch={handleRefetch}
        userRole={userRole}
      />

      {/* <UserListTable users={users}/> */}
    </div>
  );
};

export default Page;
