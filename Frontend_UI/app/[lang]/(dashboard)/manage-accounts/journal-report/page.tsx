"use client";
import React, { useState } from "react";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CalendarIcon, DownloadIcon } from "lucide-react";
import { format } from "date-fns";
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

const JournalReportPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>();
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null
  );
  const { data: accountsData } = useFetchAccountsQuery();
  const accounts = accountsData?.data as AccountData[];
  const [calendarOpen, setCalendarOpen] = useState(false);
  const dummyLedgerRecords = [
    {
      EntryDate: "2025-04-25T11:44:24.810",
      VoucherNo: "VCH001",
      AccountId: 5,
      AccountCode: "0001",
      AccountName: "Cash",
      Payee: "John Doe",
      Description: "Payment for office rent",
      DebitAmount: 1200.0,
      CreditAmount: 0.0,
      RunningBalance: 1200.0,
    },
    {
      EntryDate: "2025-04-25T11:44:24.810",
      VoucherNo: "VCH003",
      AccountId: 5,
      AccountCode: "0001",
      AccountName: "Cash",
      Payee: "Acme Corp.",
      Description: "Purchase of inventory",
      DebitAmount: 1500.0,
      CreditAmount: 0.0,
      RunningBalance: 2700.0,
    },
    {
      EntryDate: "2025-04-25T11:44:24.810",
      VoucherNo: "VCH005",
      AccountId: 5,
      AccountCode: "0001",
      AccountName: "Cash",
      Payee: "Global Tech",
      Description: "Service income received",
      DebitAmount: 0.0,
      CreditAmount: 2500.0,
      RunningBalance: 1000.0,
    },
    {
      EntryDate: "2025-04-28T00:00:00.000",
      VoucherNo: "VCH002",
      AccountId: 6,
      AccountCode: "0002",
      AccountName: "Bank",
      Payee: "Jane Smith",
      Description: "Receipt from client",
      DebitAmount: 2000.0,
      CreditAmount: 0.0,
      RunningBalance: 2000.0,
    },
    {
      EntryDate: "2025-04-29T00:00:00.000",
      VoucherNo: "VCH546",
      AccountId: 8,
      AccountCode: "0004",
      AccountName: "Accounts Payable",
      Payee: "Payee",
      Description: "Particular",
      DebitAmount: 0.0,
      CreditAmount: 2000.0,
      RunningBalance: -2000.0,
    },
  ];

  const [ledgerData, setLedgerData] = useState(dummyLedgerRecords);
  //   const { data: ledgerData, refetch } = useFetchLedgerQuery(
  //     {
  //       accountId: selectedAccountId,
  //       from: dateRange?.from?.toISOString(),
  //       to: dateRange?.to?.toISOString(),
  //     },
  //     { skip: !selectedAccountId }
  //   );

  // Dummy ledger records for testing

  const handleApplyFilter = () => {
    if (!selectedAccountId) return;
    const filtered = ledgerData.filter((entry) => {
      const entryDate = new Date(entry.EntryDate);
      const from = dateRange?.from ?? new Date("1900-01-01");
      const to = dateRange?.to ?? new Date("3000-01-01");
      return (
        entry.AccountId.toString() === selectedAccountId &&
        entryDate >= from &&
        entryDate <= to
      );
    });
    setLedgerData(filtered);
  };

  const resetFilters = () => {
    setSelectedAccountId(null);
    setDateRange(undefined);
    setLedgerData(dummyLedgerRecords);
  };

  const handleExportExcel = () => {
    if (!ledgerData?.length) return;

    const rows = ledgerData.map((entry: any) => ({
      Date: format(new Date(entry.EntryDate), "dd-MM-yyyy"),
      VoucherNo: entry.VoucherNo,
      Payee: entry.Payee,
      Description: entry.Description,
      Debit: entry.DebitAmount,
      Credit: entry.CreditAmount,
      Balance: entry.RunningBalance,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ledger");
    XLSX.writeFile(workbook, "journal-report.xlsx");
  };

  const handleExportPDF = () => {
    if (!ledgerData?.length) return;

    const doc = new jsPDF();

    // Set margins and title details
    const companyName = "The Begginners Academy";
    const reportTitle = "Journal Report Report";
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
          "Voucher No",
          "Payee",
          "Description",
          "Debit",
          "Credit",
          "Balance",
        ],
      ],
      body: ledgerData.map((entry: any) => [
        format(new Date(entry.EntryDate), "yyyy-MM-dd"),
        entry.VoucherNo,
        entry.Payee,
        entry.Description,
        entry.DebitAmount,
        entry.CreditAmount,
        entry.RunningBalance,
      ]),
    });

    doc.save("journal-report.pdf");
  };

  return (
    <div className="space-y-4">
      <Breadcrumbs>
        <BreadcrumbItem>Accounts</BreadcrumbItem>
        <BreadcrumbItem className="text-primary">Journal Report</BreadcrumbItem>
      </Breadcrumbs>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-col md:flex-row gap-4 p-4">
          <div className="flex-1">
            <Label>Account</Label>
            <Select onValueChange={(value) => setSelectedAccountId(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Account" />
              </SelectTrigger>
              <SelectContent>
                {accounts?.map((account) => (
                  <SelectItem
                    key={account.accountId}
                    value={account.accountId?.toString() ?? ""}
                  >
                    {account.accountName} ({account.accountCode})
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
            onClick={handleApplyFilter}
            variant="outline"
            className="self-end"
          >
            Apply Filter
          </Button>
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
              $1,200.00
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Label>Total Debit</Label>
            <p className="text-lg font-semibold text-green-600">$4,700.00</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Label>Total Credit</Label>
            <p className="text-lg font-semibold text-red-600">$4,500.00</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Label>Closing Balance</Label>
            <p className="text-lg font-semibold text-blue-600">$200.00</p>
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
      {/* Ledger Table */}
      <div className="overflow-auto border rounded-lg">
        <Table className="min-w-full text-sm">
          <TableHeader className="bg-muted text-muted-foreground">
            <TableRow>
              <TableHead className="px-4 py-2">Date</TableHead>
              <TableHead className="px-4 py-2">Voucher No</TableHead>
              <TableHead className="px-4 py-2">Payee</TableHead>
              <TableHead className="px-4 py-2">Description</TableHead>
              <TableHead className="px-4 py-2">Debit</TableHead>
              <TableHead className="px-4 py-2">Credit</TableHead>
              <TableHead className="px-4 py-2">Running Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ledgerData?.map((entry: any, index: number) => (
              <TableRow key={index}>
                <TableCell className="px-4 py-2">
                  {format(new Date(entry.EntryDate), "yyyy-MM-dd")}
                </TableCell>
                <TableCell className="px-4 py-2">{entry.VoucherNo}</TableCell>
                <TableCell className="px-4 py-2">{entry.Payee}</TableCell>
                <TableCell className="px-4 py-2">{entry.Description}</TableCell>
                <TableCell className="px-4 py-2">
                  {entry.DebitAmount?.toFixed(2)}
                </TableCell>
                <TableCell className="px-4 py-2">
                  {entry.CreditAmount?.toFixed(2)}
                </TableCell>
                <TableCell className="px-4 py-2">
                  {entry.RunningBalance?.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default JournalReportPage;
