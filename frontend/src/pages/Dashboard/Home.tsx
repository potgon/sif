import FinanceMetrics from "../../components/finances/FinanceMetrics.tsx";
import MonthlySalesChart from "../../components/finances/MonthlySalesChart";
import StatisticsChart from "../../components/finances/StatisticsChart";
import MonthlyTarget from "../../components/finances/MonthlyTarget";
import RecentOrders from "../../components/finances/RecentOrders";
import DemographicCard from "../../components/finances/DemographicCard";
import PageMeta from "../../components/common/PageMeta";
import {useState} from "react";

const months = [
  { label: "January", value: "01" },
  { label: "February", value: "02" },
  { label: "March", value: "03" },
  { label: "April", value: "04" },
  { label: "May", value: "05" },
  { label: "June", value: "06" },
  { label: "July", value: "07" },
  { label: "August", value: "08" },
  { label: "September", value: "09" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
]

const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

export default function Home() {
  const now = new Date()
  const [selectedMonth, setSelectedMonth] = useState(String(now.getMonth() + 1).padStart(2, "0"))
  const [selectedYear, setSelectedYear] = useState(now.getFullYear().toString())

  return (
    <>
      <PageMeta
        title="Sif - Home"
        description="Sif - Home"
      />

      <div className="flex flex-col items-start justify-between gap-4 mb-6 sm:flex-row sm:items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Dashboard</h2>

        <div className="flex gap-3">
          {/* Year Selector */}
          <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white"
          >
            {years.map((year) => (
                <option key={year} value={String(year)}>
                  {year}
                </option>
            ))}
          </select>

          {/* Month Selector */}
          <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white"
          >
            {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <FinanceMetrics />

          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div>
      </div>
    </>
  );
}
