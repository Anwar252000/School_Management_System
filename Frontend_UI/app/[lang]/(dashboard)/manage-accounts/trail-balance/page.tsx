"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, DownloadIcon } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { DateRange } from "react-day-picker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import {
  AccountData,
  useFetchAccountsQuery,
} from "@/services/apis/accountService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrailBalanceData,
  useFetchTrialBalanceQuery,
} from "@/services/apis/accountReportsService";

const TrialBalanceReport: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null
  );
  const { data: accountsData } = useFetchAccountsQuery();
  const accounts = accountsData?.data as AccountData[];
  const { data: trailBalance } = useFetchTrialBalanceQuery();
  const trailBalanceData = trailBalance?.data as TrailBalanceData[];
  const [filteredData, setFilteredData] = useState<TrailBalanceData[]>([]);

  useEffect(() => {
    if (trailBalanceData && filteredData.length === 0) {
      // Initial load: show all data
      setFilteredData(trailBalanceData);
    }
  }, [trailBalanceData]);

  useEffect(() => {
    if (!trailBalanceData) return;

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
      const filtered = trailBalanceData.filter((entry) => {
        const entryDate = new Date(entry.entryDate);
        const matchesAccount = selectedAccountId
          ? entry.accountCode?.toString() === selectedAccountId
          : true;

        const matchesDate =
          (!from || entryDate >= from) && (!to || entryDate <= to);

        return matchesAccount && matchesDate;
      });

      setFilteredData(filtered);
    }
  }, [trailBalanceData, selectedAccountId, dateRange]);

  const resetFilters = () => {
    setSelectedAccountId(null);
    setDateRange(undefined);
    setFilteredData(trailBalanceData ?? []);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("The Beginners Academy", 105, 15, { align: "center" });
    doc.setFontSize(12);
    doc.text("Trial Balance Report", 105, 25, { align: "center" });
    if (dateRange?.from && dateRange?.to) {
      doc.setFontSize(10);
      doc.text(
        `From ${format(dateRange.from, "dd-MM-yyyy")} To ${format(
          dateRange.to,
          "dd-MM-yyyy"
        )}`,
        105,
        32,
        { align: "center" }
      );
    }

    autoTable(doc, {
      startY: 40,
      head: [["Account Code", "Account Name", "Debit", "Credit"]],
      body: filteredData.map((entry) => [
        entry.accountCode,
        entry.accountName,
        entry.debit.toFixed(2),
        entry.credit.toFixed(2),
      ]),
    });

    doc.save("trial_balance.pdf");
  };

  const handleExportExcel = () => {
    const rows = filteredData.map((entry) => ({
      "Account Code": entry.accountCode,
      "Account Name": entry.accountName,
      Debit: entry.debit,
      Credit: entry.credit,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Trial Balance");
    XLSX.writeFile(workbook, "trial_balance.xlsx");
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs>
        <BreadcrumbItem>Accounts</BreadcrumbItem>
        <BreadcrumbItem className="text-primary">Trail Balance</BreadcrumbItem>
      </Breadcrumbs>
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
                    value={account.accountCode?.toString() ?? ""}
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
            onClick={resetFilters}
            variant="outline"
            color="destructive"
            className="self-end"
          >
            Reset Filter
          </Button>
        </CardContent>
      </Card>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleExportExcel}>
          <DownloadIcon className="w-4 h-4 mr-2" />
          Export Excel
        </Button>
        <Button variant="outline" onClick={handleExportPDF}>
          <DownloadIcon className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
      </div>
      <div className="overflow-auto border rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead>Account Code</TableHead>
              <TableHead>Account Name</TableHead>
              <TableHead>Debit</TableHead>
              <TableHead>Credit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData?.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>{entry.accountCode}</TableCell>
                <TableCell>{entry.accountName}</TableCell>
                <TableCell>{entry.debit.toFixed(2)}</TableCell>
                <TableCell>{entry.credit.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TrialBalanceReport;
