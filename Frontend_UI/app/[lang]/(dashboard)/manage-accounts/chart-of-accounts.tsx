import React, { useState } from "react";
import {
  Folder,
  ChevronDown,
  ChevronRight,
  DollarSign,
  Banknote,
} from "lucide-react";
import { AccountGroupData } from "@/services/apis/accountGroupService";

interface Props {
  accounts: AccountGroupData[];
}

const ChartofAccounts: React.FC<Props> = ({ accounts }) => {
  const [expandedGroups, setExpandedGroups] = useState<number[]>([]);
  const [expandedParents, setExpandedParents] = useState<number[]>([]);

  const toggleGroup = (id: number) => {
    setExpandedGroups((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleParent = (id: number) => {
    setExpandedParents((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Chart of Accounts</h2>
      <div className="space-y-4 border rounded shadow">
        {accounts?.map((group) => (
          <div key={group.accountGroupId} className="p-3 border">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleGroup(group.accountGroupId)}
            >
              <div className="flex items-center gap-2 text-lg">
                {expandedGroups.includes(group.accountGroupId) ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
                {group.accountGroupCode} - {group.accountGroupName}
              </div>
            </div>

            {expandedGroups.includes(group.accountGroupId) && (
              <div className="pl-6 mt-2 space-y-3">
                {group.parentAccount?.map((parent) => (
                  <div key={parent.parentAccountId}>
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() =>
                        parent.parentAccountId !== undefined &&
                        toggleParent(parent.parentAccountId)
                      }
                    >
                      <div className="flex items-center gap-2 text-md font-medium text-gray-800">
                        {expandedParents.includes(
                          parent.parentAccountId ?? 0
                        ) ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                        <Folder size={16} />
                        {group.accountGroupCode}-{parent.parentAccountCode} -{" "}
                        {parent.parentAccountName}
                      </div>
                    </div>

                    {expandedParents?.includes(parent.parentAccountId ?? 0) && (
                      <ul className="pl-6 mt-1 space-y-1 text-gray-600 list-disc">
                        {parent.controllingAccount?.map((controlling) => (
                          <li
                            key={controlling.accountId}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2 ml-8 mt-2">
                              <Banknote size={14} />
                              {group.accountGroupCode}-
                              {parent.parentAccountCode}-
                              {controlling.accountCode} -{" "}
                              {controlling.accountName}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartofAccounts;
