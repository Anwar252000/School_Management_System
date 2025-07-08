"use client";
import React, { useEffect, useState } from "react";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CalendarIcon, DownloadIcon } from "lucide-react";
import { format, set } from "date-fns";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  useFetchAccountsQuery,
  AccountData,
} from "@/services/apis/accountService";
// import { useFetchLedgerQuery } from "@/services/apis/ledgerService"; // Assume this returns filtered ledger entries
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  GeneralLedgerData,
  useFetchGeneralLedgersQuery,
} from "@/services/apis/accountReportsService";
import { ParentAccountData, useFetchParentAccountsQuery } from "@/services/apis/parentAccountService";
import { AccountGroupData, useFetchAccountGroupsQuery } from "@/services/apis/accountGroupService";
import { log } from "console";

const GeneralLedgerPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>();
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null
  );
  const [selectedParentAccountId, setSelectedParentAccountId] = useState<string | null>(
    null
  );
  const [selectedAccountGroupId, setSelectedAccountGroupId] = useState<string | null>(
    null
  )
  const { data: accountsData } = useFetchAccountsQuery();
  const accounts = accountsData?.data as AccountData[];

  const { data: parentAccountsData } = useFetchParentAccountsQuery();
  const parentAccounts = parentAccountsData?.data as ParentAccountData[];

  const { data: accountGroupsData } = useFetchAccountGroupsQuery();
  const accountGroups = accountGroupsData?.data as AccountGroupData[];

  const [calendarOpen, setCalendarOpen] = useState(false);

  const { data: generalLedger } = useFetchGeneralLedgersQuery();
  const generalLedgerData = generalLedger?.data as GeneralLedgerData[];
  console.log(generalLedgerData);

  const [ledgerData, setLedgerData] = useState<GeneralLedgerData[]>([]);

  useEffect(() => {
    if (!generalLedgerData) return;

    const normalizeDate = (date: Date) => new Date(date.setHours(0, 0, 0, 0));

    const from = dateRange?.from
      ? normalizeDate(new Date(dateRange.from))
      : new Date("1900-01-01");
    const to = dateRange?.to
      ? normalizeDate(new Date(dateRange.to))
      : dateRange?.from
        ? normalizeDate(new Date(dateRange.from))
        : new Date("3000-01-01");

    const filtered = generalLedgerData.filter((entry) => {
      const entryDate = new Date(entry.entryDate);
      const matchesAccount = selectedAccountId
        ? entry.accountCode?.toString() === selectedAccountId
        : true;
      const matchesParentAccount = selectedParentAccountId
        ? entry.parentAccountCode?.toString() === selectedParentAccountId
        : true;
      const matchesAccountGroup = selectedAccountGroupId
        ? entry.accountGroupCode?.toString() === selectedAccountGroupId
        : true;

      return entryDate >= from && entryDate <= to && matchesAccount && matchesParentAccount && matchesAccountGroup;
    });

    setLedgerData(filtered);
  }, [generalLedgerData, selectedAccountId, selectedParentAccountId, selectedAccountGroupId, dateRange]);

  // Compute balances
  const openingBalance =
    ledgerData.length > 0 ? ledgerData[0].runningBalance : 0;
  const totalDebit = ledgerData.reduce(
    (acc, curr) => acc + curr.debitAmount,
    0
  );
  const totalCredit = ledgerData.reduce(
    (acc, curr) => acc + curr.creditAmount,
    0
  );
  const closingBalance =
    ledgerData.length > 0
      ? ledgerData[ledgerData.length - 1].runningBalance
      : 0;

  const resetFilters = () => {
    setSelectedAccountId(null);
    setSelectedParentAccountId(null);
    setSelectedAccountGroupId(null);
    setDateRange(undefined);
    setLedgerData(generalLedgerData);
  };

  const handleExportExcel = () => {
    if (!ledgerData?.length) return;

    const rows = ledgerData.map((entry: any) => ({
      Date: format(new Date(entry.entryDate), "dd-MM-yyyy"),
      AccountName: entry.accountName,
      ParentAccountName: entry.parentAccountName,
      AccountGroupName: entry.accountGroupName,
      Payee: entry.payee,
      Description: entry.description,
      Debit: entry.debitAmount,
      Credit: entry.creditAmount,
      Balance: entry.runningBalance,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);

    // Apply bold style to header cells
    const headerKeys = Object.keys(rows[0]);
    headerKeys.forEach((key, index) => {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: index }); // Header is in first row (r: 0)
      if (!worksheet[cellRef]) return;

      worksheet[cellRef].s = {
        font: { bold: true },
      };
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ledger");

    // Note: styling requires writing with 'cellStyles: true'
    XLSX.writeFile(workbook, "general_ledger.xlsx", { cellStyles: true });
  };

  const handleExportPDF = () => {
    if (!ledgerData?.length) return;

    const doc = new jsPDF();

    // Set margins and title details
    const companyName = "The Beginners Academy";
    const reportTitle = "General Ledger Report";
    const from = dateRange?.from
      ? format(dateRange.from, "dd-MM-yyyy")
      : "Start";
    const to = dateRange?.to ? format(dateRange.to, "dd-MM-yyyy") : "End";
    const dateRangeText = `Date Range: ${from} to ${to}`;

    const pageWidth = doc.internal.pageSize.getWidth();

    const centerText = (text: string, y: number, fontSize: number = 12) => {
      doc.setFontSize(fontSize);
      const textWidth = doc.getTextWidth(text);
      const x = (pageWidth - textWidth) / 2;
      doc.text(text, x, y);
    };

    centerText(companyName, 15, 14);
    centerText(reportTitle, 23, 12);
    centerText(dateRangeText, 30, 10);

    // Add table below the headings
    autoTable(doc, {
      startY: 35,
      head: [
        [
          "Date",
          "Account Name",
          "Payee",
          "Description",
          "Debit",
          "Credit",
          "Balance",
        ],
      ],
      body: ledgerData.map((entry: any) => [
        format(new Date(entry.entryDate), "yyyy-MM-dd"),
        entry.accountName,
        entry.payee,
        entry.description,
        entry.debitAmount,
        entry.creditAmount,
        entry.runningBalance,
      ]),
    });

    doc.save("general_ledger.pdf");
  };

  return (
    <div className="space-y-4">
      <Breadcrumbs>
        <BreadcrumbItem>Accounts</BreadcrumbItem>
        <BreadcrumbItem className="text-primary">General Ledger</BreadcrumbItem>
      </Breadcrumbs>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-col md:flex-row gap-4 p-4">
          <div className="flex-1">
            <Label>Account Name</Label>
            <Select onValueChange={(value) => setSelectedAccountId(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Search By Account" />
              </SelectTrigger>
              <SelectContent>
                {accounts?.map((account) => (
                  <SelectItem
                    key={account.accountId}
                    value={account.accountCode?.toString() ?? ""}
                  >
                    {account.accountName} ({account.accountCode})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Label>Parent Account Name</Label>
            <Select onValueChange={(value) => setSelectedParentAccountId(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Search By Parent Account" />
              </SelectTrigger>
              <SelectContent>
                {parentAccounts?.map((account) => (
                  <SelectItem
                    key={account.parentAccountId}
                    value={account.parentAccountCode?.toString() ?? ""}
                  >
                    {account.parentAccountName} ({account.parentAccountCode})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Label>Account Group Name</Label>
            <Select onValueChange={(value) => setSelectedAccountGroupId(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Search By Account Group" />
              </SelectTrigger>
              <SelectContent>
                {accountGroups?.map((account) => (
                  <SelectItem
                    key={account.accountGroupId}
                    value={account.accountGroupCode?.toString() ?? ""}
                  >
                    {account.accountGroupName} ({account.accountGroupCode})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Label>Date Range</Label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from && dateRange?.to
                    ? `${format(dateRange.from, "yyyy-MM-dd")} - ${format(
                      dateRange.to,
                      "yyyy-MM-dd"
                    )}`
                    : "Pick a date range"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => {
                    setDateRange(range);
                    setCalendarOpen(false);
                  }}
                  numberOfMonths={1}
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button
            onClick={resetFilters}
            variant="outline"
            color="destructive"
            className="self-end"
          >
            Reset Filter
          </Button>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Replace these with dynamic summary values */}
        <Card>
          <CardContent className="p-4">
            <Label>Opening Balance</Label>
            <p className="text-lg font-semibold text-muted-foreground">
              ${openingBalance.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Label>Total Debit</Label>
            <p className="text-lg font-semibold text-green-600">
              ${totalDebit.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Label>Total Credit</Label>
            <p className="text-lg font-semibold text-red-600">
              ${totalCredit.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Label>Closing Balance</Label>
            <p className="text-lg font-semibold text-blue-600">
              ${closingBalance.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>
      {/* Export Buttons */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={handleExportExcel}>
          <DownloadIcon className="w-4 h-4 mr-2" /> Export to Excel
        </Button>
        <Button variant="outline" size="sm" onClick={handleExportPDF}>
          <DownloadIcon className="w-4 h-4 mr-2" /> Export to PDF
        </Button>
      </div>
      <div className="overflow-auto border rounded-lg">
        <Table className="min-w-full text-sm">
          {/* Table Headers */}
          <TableHeader className="bg-muted text-muted-foreground">
            <TableRow>
              <TableHead className="px-4 py-2">Entry Date</TableHead>
              {/* <TableHead className="px-4 py-2">Account Name</TableHead> */}
              <TableHead className="px-4 py-2">Description</TableHead>
              <TableHead className="px-4 py-2">Debit</TableHead>
              <TableHead className="px-4 py-2">Credit</TableHead>
              {/* <TableHead className="px-4 py-2">Running Balance</TableHead> */}
            </TableRow>
          </TableHeader>

          <TableBody>
            {Object.entries(
              ledgerData.reduce((acc, entry) => {
                const name = entry.accountName || "Unknown";
                if (!acc[name]) acc[name] = [];
                acc[name].push(entry);
                return acc;
              }, {} as Record<string, GeneralLedgerData[]>)
            ).map(([accountName, entries]) => {
              const totalDebit = entries.reduce((sum, e) => sum + (e.debitAmount || 0), 0);
              const totalCredit = entries.reduce((sum, e) => sum + (e.creditAmount || 0), 0);
              const netMovement = totalDebit - totalCredit;

              return (
                <React.Fragment key={accountName}>

                  {/* Transaction Entries */}
                  <TableRow>
                  <TableCell className="font-bold">{accountName}</TableCell>
                  <TableCell colSpan={5}></TableCell>
                </TableRow>
                  {entries.map((entry, idx) => (
                  <TableRow key={`${accountName}-${idx}`} className={idx === 0 ? "font-bold" : ""}>
                      <TableCell className="px-4 py-2">
                        {format(new Date(entry.entryDate), "dd-MM-yyyy")}
                      </TableCell>
                      {/* <TableCell className="px-4 py-2"></TableCell> */}
                      <TableCell className="px-4 py-2 pl-6">{entry.description}</TableCell>
                      <TableCell className="px-4 py-2">
                        {entry.debitAmount?.toFixed(2)}
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        {entry.creditAmount?.toFixed(2)}
                      </TableCell>
                      {/* <TableCell className="px-4 py-2">
                        {entry.runningBalance?.toFixed(2)}
                      </TableCell> */}
                    </TableRow>
                  ))}

                  {/* Net Movement Summary Row */}
                  <TableRow className="font-bold bg-gray-50">
                    <TableCell colSpan={3} className="text-right px-4 py-2 font-bold">
                      Net movement
                    </TableCell>
                    <TableCell className="px-4 py-2 font-bold">
                      {Math.abs(netMovement).toFixed(2)}
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>

    </div>
  );
};

export default GeneralLedgerPage;
