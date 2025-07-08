"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useThemeStore } from "@/store";
import { useTheme } from "next-themes";
import { themes } from "@/config/thems";
import { getGridConfig } from "@/lib/appex-chart-options";
import { PaymentData, useFetchSponsorPaymentsQuery } from "@/services/apis/sponsorPaymentService";


const ReportChart = ({ height = 360 }) => {
  const { theme: config, setTheme: setConfig, isRtl } = useThemeStore();
  const { theme: mode } = useTheme();

  const theme = themes.find((theme) => theme.name === config);

  // const [paymentData, setPaymentData] = useState<PaymentData[]>([]);
  const [totalPaidOverTime, setTotalPaidOverTime] = useState<number[]>([]);
  const [remainingBalanceOverTime, setRemainingBalanceOverTime] = useState<number[]>([]);

  // Define months outside the function so it is accessible for chart options
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

 
  const { data, isLoading, error, refetch } = useFetchSponsorPaymentsQuery();
  const paymentData = data?.data as PaymentData[]; 

  const calculatePaymentsOverTime = (payments: PaymentData[]) => {
    let paidByMonth = Array(12).fill(0); // Initializing array for 12 months
    let balanceByMonth = Array(12).fill(0); // Initializing array for remaining balance for 12 months

    payments.forEach((payment) => {
      if (payment.isActive && payment.paymentDate) {
        const month = new Date(payment.paymentDate).getMonth(); // Get month index (0-11)
        paidByMonth[month] += payment.amountPaid || 0;
        balanceByMonth[month] += payment.sponsorshipAmount || 0;
      }
    });

    const remainingBalance = balanceByMonth.map((totalAmount, index) => totalAmount - paidByMonth[index]);

    setTotalPaidOverTime(paidByMonth);
    setRemainingBalanceOverTime(remainingBalance);
  };

  // Line Chart data
  const series = [
    {
      name: "Payments Made",
      data: totalPaidOverTime,
    },
    {
      name: "Remaining Payments",
      data: remainingBalanceOverTime,
    },
  ];

  const options: any = {
    chart: {
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: [2],
      curve: "smooth", // Line curve for smooth representation
    },
    colors: [
      `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].success})`, // For Payments Made
      `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].destructive})`, // For Remaining Payments
    ],
    tooltip: {
      theme: mode === "dark" ? "dark" : "light",
    },
    markers: {
      size: 4,
    },
    grid: getGridConfig(
      `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].chartGird})`
    ),
    xaxis: {
      type: "category",
      categories: months, // Now accessible here
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          fontSize: "12px",
          fontFamily: "inter",
          colors: `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].chartLabel})`,
        },
      },
    },
    yaxis: {
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          fontSize: "12px",
          fontFamily: "inter",
          colors: [
            `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].chartLabel})`,
          ],
        },
      },
    },
    legend: {
      labels: {
        colors: `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].chartLabel})`,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 8,
      },
      markers: {
        width: 10,
        height: 10,
        radius: 10,
        offsetX: isRtl ? 5 : -5,
      },
    },
  };

  return (
    <div>
      <h3>Payments Over Time</h3>
      <Chart
        options={options}
        series={series}
        type="line" // Line chart to show the payments trend
        height={height}
        width={"100%"}
      />
      <div>
        <h4>Total Paid: ${totalPaidOverTime.reduce((acc, curr) => acc + curr, 0)}</h4>
        <h4>Remaining Balance: ${remainingBalanceOverTime.reduce((acc, curr) => acc + curr, 0)}</h4>
      </div>
    </div>
  );
};

export default ReportChart;
