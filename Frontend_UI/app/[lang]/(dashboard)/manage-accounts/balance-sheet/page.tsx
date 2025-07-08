"use client";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, DownloadIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";

import {
  AccountData,
  useFetchAccountsQuery,
} from "@/services/apis/accountService";
import { useFetchBalanceSheetQuery } from "@/services/apis/accountReportsService";
import { log } from "console";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

const BalanceSheetReport: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null
  );
  const { data: accountsData } = useFetchAccountsQuery();
  const accounts = accountsData?.data as AccountData[];
  const { data: balanceSheetData } = useFetchBalanceSheetQuery();
  const allEntries = balanceSheetData?.data as any[];
  const [groupedData, setGroupedData] = useState<
    Record<string, { account: string; amount: number }[]>
  >({});

  useEffect(() => {
    if (allEntries?.length > 0) {
      applyFilters();
    }
  }, [allEntries, dateRange, selectedAccountId]);

  const applyFilters = () => {
    const from = dateRange?.from ?? new Date("1900-01-01");
    const to = dateRange?.to ?? new Date("3000-01-01");

    const filtered = allEntries.filter((item) => {
      const entryDate = new Date(item.entryDate);
      const matchesAccount = selectedAccountId
        ? item.accountId.toString() === selectedAccountId
        : true;
      return entryDate >= from && entryDate <= to && matchesAccount;
    });

    const grouped: Record<string, Record<string, number>> = {};

    filtered.forEach((item) => {
      if (!grouped[item.groupName]) grouped[item.groupName] = {};
      if (!grouped[item.groupName][item.accountName])
        grouped[item.groupName][item.accountName] = 0;
      grouped[item.groupName][item.accountName] += item.balance;
    });

    const validGroups = ["Assets", "Liabilities", "Equity"];
    const structuredData: Record<
      string,
      { account: string; amount: number }[]
    > = {};

    for (const group of validGroups) {
      if (grouped[group]) {
        structuredData[group] = Object.entries(grouped[group]).map(
          ([account, amount]) => ({ account, amount })
        );
      }
    }

    setGroupedData(structuredData);
  };

  const total = (items: { account: string; amount: number }[] = []) =>
    items.reduce((sum, item) => sum + item.amount, 0);

  const resetFilters = () => {
    setSelectedAccountId(null);
    setDateRange(undefined);
    if (allEntries?.length > 0) applyFilters();
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("The Beginners Academy", 105, 15, { align: "center" });
    doc.text("Balance Sheet", 105, 25, { align: "center" });

    if (dateRange?.from && dateRange?.to) {
      doc.setFontSize(10);
      doc.text(`As of ${format(dateRange.to, "yyyy-MM-dd")}`, 105, 32, {
        align: "center",
      });
    }

    autoTable(doc, {
      startY: 40,
      head: [["Account", "Amount"]],
      body: Object.entries(groupedData).flatMap(([group, items]) => {
        const groupRows = items.map((item) => [
          item.account,
          item.amount.toFixed(2),
        ]);
        const groupTotal = total(items).toFixed(2);
        return [
          [{ content: group, colSpan: 2, styles: { fontStyle: "bold" } }],
          ...groupRows,
          ["Total " + group, groupTotal],
        ];
      }),
    });

    doc.save("balance_sheet.pdf");
  };

  const handleExportExcel = () => {
    const rows: any[] = [];

    Object.entries(groupedData).forEach(([group, items]) => {
      rows.push({ Section: group });
      items.forEach((item) =>
        rows.push({ Account: item.account, Amount: item.amount })
      );
      rows.push({ Account: `Total ${group}`, Amount: total(items) });
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Balance Sheet");
    XLSX.writeFile(wb, "balance_sheet.xlsx");
  };

  const totalAssets = total(groupedData["Assets"]);
  const totalLiabilities = total(groupedData["Liabilities"]);
  // const totalEquity = total(groupedData["Equity"]);

  const filteredEquityEntries = (groupedData["Equity"] || []).filter((item) => {
    const name = item.account?.toLowerCase() || "";

    // Keep 'net income', remove other 'income' or 'services'
    const isNetIncome = name.includes("net income");
    const isOtherIncomeOrService = (name.includes("income") || name.includes("services")) && !isNetIncome;

    return !isOtherIncomeOrService;
  });

  const totalEquity = total(filteredEquityEntries);

  console.log("totalEquity", totalEquity);


  return (
    <div className="space-y-6">
      <Breadcrumbs>
        <BreadcrumbItem>Accounts</BreadcrumbItem>
        <BreadcrumbItem className="text-primary">Balance Sheet</BreadcrumbItem>
      </Breadcrumbs>
      <Card>
        <CardContent className="flex flex-col md:flex-row gap-4 py-6">
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full text-left">
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
          <Button
            onClick={resetFilters}
            variant="outline"
            color="destructive"
            className="self-end"
          >
            Reset Filter
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportExcel}>
            <DownloadIcon className="w-4 h-4 mr-2" /> Export to Excel
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <DownloadIcon className="w-4 h-4 mr-2" /> Export to PDF
          </Button>
        </CardContent>
      </Card>
      <h1 className="text-2xl font-bold text-center">Balance Sheet</h1>
      {Object.entries(groupedData).map(([group, items]) => {
        const filteredItems =
          group === "Equity"
            ? items.filter((item) => {
              const name = item.account?.toLowerCase() || "";
              const isNetIncome = name.includes("net income");
              const isOtherIncomeOrService = (name.includes("income") || name.includes("services")) && !isNetIncome;
              return !isOtherIncomeOrService;
            })
            : items;

        return (
          <Card key={group}>
            <CardContent className="p-4 space-y-2">
              <h3 className="font-semibold text-lg">{group}</h3>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted">
                    <TableHead>Account</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>{item.account}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                  <TableCell className="font-bold">Total {group}</TableCell>
                  <TableCell className="text-right font-bold">
                    {formatCurrency(total(filteredItems))}
                  </TableCell>
                </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );
      })}


      {/* Balance Check Summary */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg">Balance Sheet Summary</h3>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Total Assets</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(totalAssets)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Total Liabilities + Equity
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(totalLiabilities + totalEquity)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Balanced?</TableCell>
                <TableCell className="text-right">
                  {totalAssets === totalLiabilities + totalEquity
                    ? "✅ Yes"
                    : "❌ No"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BalanceSheetReport;
