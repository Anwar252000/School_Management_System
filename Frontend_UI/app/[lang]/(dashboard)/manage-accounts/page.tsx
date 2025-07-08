"use client";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import React from "react";
import AddAccountGroup from "./account-groups/add-account-group";
import ReportsCard from "./reports";
import ChartofAccounts from "./chart-of-accounts";
import {
  AccountGroupData,
  useFetchAccountGroupsQuery,
  useFetchAccountHierarchyQuery,
} from "@/services/apis/accountGroupService";
import AddParentAccount from "./parent-account/add-parent-account";
import {
  ParentAccountData,
  useFetchParentAccountsQuery,
} from "@/services/apis/parentAccountService";
import AddAccount from "./account/add-account";
import {
  AccountData,
  useFetchAccountsQuery,
} from "@/services/apis/accountService";

const page: React.FC = () => {
  const { data: accountGroupData } = useFetchAccountGroupsQuery();
  const accountGroups = accountGroupData?.data as AccountGroupData[];
  const { data: parentAccountData } = useFetchParentAccountsQuery();
  const parentAccounts = parentAccountData?.data as ParentAccountData[];
  const { data: accountData } = useFetchAccountsQuery();
  const accounts = accountData?.data as AccountData[];
  const { data: accountsData, refetch } = useFetchAccountHierarchyQuery();
  const accountHierarchy = accountsData?.data as AccountGroupData[];

  const handleRefetch = () => {
    refetch();
  };

  return (
    <div>
      <Breadcrumbs>
        <BreadcrumbItem>Manage Chart of Accounts</BreadcrumbItem>
      </Breadcrumbs>
      <div className="flex justify-end space-x-4 m-2">
        <AddAccountGroup refetch={handleRefetch} />
        <AddParentAccount refetch={handleRefetch} />
        <AddAccount refetch={handleRefetch} />
      </div>
      <div className="col-span-12 md:col-span-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-5">
          <ReportsCard
            accountGroups={accountGroups}
            parentAccounts={parentAccounts}
            accounts={accounts}
          />
        </div>
      </div>
      <div>
        <ChartofAccounts accounts={accountHierarchy} />
      </div>
    </div>
  );
};

export default page;
