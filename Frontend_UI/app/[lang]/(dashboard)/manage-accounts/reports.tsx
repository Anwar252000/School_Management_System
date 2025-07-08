"use client";

import { Docs } from "@/components/svg";
import { Card } from "@/components/ui/card";
import React, { Fragment } from "react";
import { Icon } from "@iconify/react";
import ViewAccountGroups from "./account-groups/view-account-groups";
import { AccountGroupData } from "@/services/apis/accountGroupService";
import { ParentAccountData } from "@/services/apis/parentAccountService";
import ViewParentAccount from "./parent-account/view-parent-account";
import { AccountData } from "@/services/apis/accountService";
import ViewAccount from "./account/view-account";

const ReportsCard = ({
  accountGroups,
  parentAccounts,
  accounts,
}: {
  accountGroups: AccountGroupData[];
  parentAccounts: ParentAccountData[];
  accounts: AccountData[];
}) => {
  const groupsCount = accountGroups?.length.toString();
  const parentAccountsCount = parentAccounts?.length.toString();
  const accountsCount = accounts?.length.toString();

  interface ReportItem {
    id: number;
    name: string;
    count: string;
    rate: string;
    icon: React.ReactNode;
    color?:
      | "primary"
      | "secondary"
      | "success"
      | "info"
      | "warning"
      | "destructive"
      | "default"
      | "dark";
  }

  const reports: ReportItem[] = [
    {
      id: 1,
      name: "No. of Account Groups",
      count: (groupsCount ? groupsCount : 0).toString(),
      rate: "8.2",
      icon: (
        <Icon
          icon="heroicons:rectangle-stack-solid"
          className="w-6 h-6 text-info"
        />
      ),
      color: "destructive",
    },
    {
      id: 2,
      name: "No. of Parent Accounts",
      count: (parentAccountsCount ? parentAccountsCount : 0).toString(),
      rate: "8.2",
      icon: (
        <Icon
          icon="heroicons:cube-solid"
          className="w-6 h-6 text-warning-700"
        />
      ),
      color: "destructive",
    },
    {
      id: 3,
      name: "No. of Controlling Accounts",
      count: (accountsCount ? accountsCount : 0).toString(),
      rate: "8.2",
      icon: (
        <Icon
          icon="heroicons:clipboard-document-list-solid"
          className="w-6 h-6"
        />
      ),
      color: "info",
    },
  ];
  return (
    <Fragment>
      {reports.map((item) => (
        <Card
          key={item.id}
          className="rounded-lg p-4 xl:p-2 xl:py-6 2xl:p-6  flex flex-col items-center 2xl:min-w-[168px]"
        >
          <div>
            <span
              className={`h-12 w-12 rounded-full flex justify-center items-center bg-${item.color}/10`}
            >
              {item.icon}
            </span>
          </div>
          <div className="mt-4 text-center">
            <div className="text-base font-medium text-default-600">
              {item.name}
            </div>
            <div className={"text-3xl font-semibold text-${item.color} mt-1"}>
              {item.count}
            </div>
            {item.id === 1 && (
              <ViewAccountGroups
                selectedAccountGroup={accountGroups as AccountGroupData[]}
              />
            )}
            {item.id === 2 && (
              <ViewParentAccount
                selectedParentAccount={parentAccounts as ParentAccountData[]}
              />
            )}
            {item.id === 3 && (
              <ViewAccount
                selectedAccount={accounts as AccountData[]}
              />
            )}
          </div>
        </Card>
      ))}
    </Fragment>
  );
};

export default ReportsCard;

function setLoading(arg0: boolean) {
  throw new Error("Function not implemented.");
}
