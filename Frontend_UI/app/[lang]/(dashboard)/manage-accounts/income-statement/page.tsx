"use client";
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import { CalendarIcon, DownloadIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import {
  IncomeStatementData,
  useFetchIncomeStatementQuery,
} from "@/services/apis/accountReportsService";

const IncomeStatementPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null
  );
  const { data: incomeStatement } = useFetchIncomeStatementQuery();
  const incomeStatementsData = incomeStatement?.data as IncomeStatementData[];
  const [incomeStatementData, setIncomeStatementData] = useState<
    IncomeStatementData[]
  >([]);
  const companyName = "The Beginners Academy";

  useEffect(() => {
    if (incomeStatementsData && incomeStatementData?.length === 0) {
      setIncomeStatementData(incomeStatementsData);
    }
  }, [incomeStatementsData]);

  useEffect(() => {
    if (!incomeStatementsData) return;

    const normalizeDate = (date: Date) => new Date(date.setHours(0, 0, 0, 0));

    const from = dateRange?.from
      ? normalizeDate(new Date(dateRange.from))
      : null;

    const to = dateRange?.to
      ? normalizeDate(new Date(dateRange.to))
      : dateRange?.from
        ? normalizeDate(new Date(dateRange.from))
        : null;

    if (dateRange || selectedAccountId) {
      const filtered = incomeStatementsData.filter((entry) => {
        const entryDate = new Date(entry.entryDate);
        const matchesAccount = selectedAccountId
          ? entry.accountId?.toString() === selectedAccountId
          : true;

        const matchesDate =
          (!from || entryDate >= from) && (!to || entryDate <= to);

        return matchesAccount && matchesDate;
      });

      setIncomeStatementData(filtered);
    }
  }, [incomeStatementsData, selectedAccountId, dateRange]);

  const resetFilters = () => {
    setSelectedAccountId(null);
    setDateRange(undefined);
    setIncomeStatementData(incomeStatementsData);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`${companyName}\nIncome Statement`, 105, 20, { align: "center" });

    if (dateRange?.from && dateRange?.to) {
      doc.setFontSize(12);
      doc.text(
        `Period: ${format(dateRange.from, "MMM dd, yyyy")} - ${format(
          dateRange.to,
          "MMM dd, yyyy"
        )}`,
        105,
        30,
        { align: "center" }
      );
    }

    autoTable(doc, {
      startY: 40,
      head: [["Category", "Account", "Amount"]],
      body: incomeStatementData?.map((entry) => [
        entry.accountGroupName || "",
        entry.accountName || entry.otherAccounts,
        `$${entry.amount.toFixed(2)}`,
      ]),
    });

    doc.save("income_statement.pdf");
  };

  const handleExportExcel = () => {
    const rows = incomeStatementData?.map((entry) => ({
      Category: entry.accountGroupName || "",
      Account: entry.accountName || entry.otherAccounts,
      Amount: entry.amount,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Income Statement");
    XLSX.writeFile(workbook, "income_statement.xlsx");
  };

  return (
    <div className="space-y-4">
      <Breadcrumbs>
        <BreadcrumbItem>Accounts</BreadcrumbItem>
        <BreadcrumbItem className="text-primary">
          Income Statement
        </BreadcrumbItem>
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
      {/* Dynamic Income Statement Table */}
      <h1 className="text-2xl font-bold text-center">
        Income Statement Report
      </h1>
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              const grouped: Record<string, any[]> = {};
              const boldLabels = [
                "Total Revenue",
                "Total Expenses",
                "Operating Income",
                "Income After Tax",
                "Net Income",
              ];

              // Group entries
              incomeStatementData?.forEach((entry) => {
                const key = entry.accountGroupName || "Ungrouped";
                if (!grouped[key]) grouped[key] = [];
                grouped[key].push(entry);
              });

              const rows: JSX.Element[] = [];

              const renderEntries = (entries: any[], groupLabel: string) => {
                let shownGroup = false;
                entries.forEach((entry, idx) => {
                  const label = entry.accountName || entry.otherAccounts;
                  const isBold = boldLabels.includes(label);
                  const isSubtotal = entry.otherAccounts && !entry.accountName;

                  rows.push(
                    <tr
                      key={`${groupLabel}-${idx}`}
                      className={`border-t ${isSubtotal ? "bg-gray-200" : ""} ${isBold ? "font-semibold" : ""
                        }`}
                    >
                      <td className="px-4 py-2">{!shownGroup ? groupLabel : ""}</td>
                      <td className="px-4 py-2">{label}</td>
                      <td className="px-4 py-2 text-right">
                        ${entry.amount.toFixed(2)}
                      </td>
                    </tr>
                  );
                  shownGroup = true;
                });
              };

              // 1. Revenue and Total Revenue
              renderEntries(grouped["Revenue"] || [], "Revenue");

              const totalRevenue = (grouped["Ungrouped"] || []).find(
                (e) => e.otherAccounts === "Total Revenue"
              );
              if (totalRevenue) {
                rows.push(
                  <tr className="font-bold bg-muted border-t">
                    <td className="px-4 py-2"></td>
                    <td className="px-4 py-2">{totalRevenue.otherAccounts}</td>
                    <td className="px-4 py-2 text-right">
                      ${totalRevenue.amount.toFixed(2)}
                    </td>
                  </tr>
                );
              }

              // 2. Operating Expenses (exclude tax)
              const operatingExpenses = (grouped["Expenses"] || []).filter(
                (e) => e.accountName !== "Income Tax"
              );
              renderEntries(operatingExpenses, "Operating Expenses");

              const totalExpenses = (grouped["Ungrouped"] || []).find(
                (e) => e.otherAccounts === "Total Expenses"
              );
              if (totalExpenses) {
                rows.push(
                  <tr className="font-bold bg-muted border-t">
                    <td className="px-4 py-2"></td>
                    <td className="px-4 py-2">{totalExpenses.otherAccounts}</td>
                    <td className="px-4 py-2 text-right">
                      ${totalExpenses.amount.toFixed(2)}
                    </td>
                  </tr>
                );
              }

              // 3. Operating Income
              const operatingIncome = (grouped["Ungrouped"] || []).find(
                (e) => e.otherAccounts === "Operating Income"
              );
              if (operatingIncome) {
                rows.push(
                  <tr className="font-bold bg-muted border-t">
                    <td className="px-4 py-2"></td>
                    <td className="px-4 py-2">{operatingIncome.otherAccounts}</td>
                    <td className="px-4 py-2 text-right">
                      ${operatingIncome.amount.toFixed(2)}
                    </td>
                  </tr>
                );
              }

              // 4. Tax Expense
              const taxEntry = (grouped["Expenses"] || []).find(
                (e) => e.accountName === "Income Tax"
              );
              if (taxEntry) {
                rows.push(
                  <tr className="border-t">
                    <td className="px-4 py-2">Tax Expense</td>
                    <td className="px-4 py-2">{taxEntry.accountName}</td>
                    <td className="px-4 py-2 text-right">
                      ${taxEntry.amount.toFixed(2)}
                    </td>
                  </tr>
                );
              }

              // 5. Income After Tax
              const incomeAfterTax = (grouped["Ungrouped"] || []).find(
                (e) => e.otherAccounts === "Income After Tax"
              );
              if (incomeAfterTax) {
                rows.push(
                  <tr className="font-bold bg-muted border-t">
                    <td className="px-4 py-2"></td>
                    <td className="px-4 py-2">{incomeAfterTax.otherAccounts}</td>
                    <td className="px-4 py-2 text-right">
                      ${incomeAfterTax.amount.toFixed(2)}
                    </td>
                  </tr>
                );
              }

              // 6. Other Income
              renderEntries(grouped["Equity"] || [], "Other Income");

              // 7. Net Income
              const netIncome = (grouped["Ungrouped"] || []).find(
                (e) => e.otherAccounts === "Net Income"
              );
              if (netIncome) {
                rows.push(
                  <tr className="font-bold bg-muted border-t">
                    <td className="px-4 py-2"></td>
                    <td className="px-4 py-2">{netIncome.otherAccounts}</td>
                    <td className="px-4 py-2 text-right">
                      ${netIncome.amount.toFixed(2)}
                    </td>
                  </tr>
                );
              }

              return rows;
            })()}
          </tbody>


        </table>
      </div>
    </div>
  );
};

export default IncomeStatementPage;
