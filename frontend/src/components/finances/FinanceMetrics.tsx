import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";
import {fetchMonthlyMetrics, MonthlyMetrics} from "../../api/finances/metrics.ts";
import {useEffect, useState} from "react";

interface Props {
  year: number
  month: number
}

export default function FinanceMetrics({ year, month }: Readonly<Props>) {
  const [data, setData] = useState<MonthlyMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchMonthlyMetrics(year, month)
        .then(setData)
        .catch((err) => {
          console.error("Error fetching metrics", err)
          setData(null)
        })
        .finally(() => setLoading(false))
  }, [year, month])

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Income
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? "..." : data?.totalIncome?.toFixed(2)}€
            </h4>
          </div>
          <Badge color={data?.prevMonthIncomeDiff !== undefined && data?.prevMonthIncomeDiff >= 0 ? "success" : "error"}>
            {data?.prevMonthIncomeDiff !== undefined && data?.prevMonthIncomeDiff >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
            {data?.prevMonthIncomeDiff !== undefined ? Math.abs(data.prevMonthIncomeDiff).toFixed(2) : "..."}
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Expense
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? "..." : data?.totalExpenses}€
            </h4>
          </div>

          <Badge color={data?.prevMonthExpensesDiff !== undefined && data?.prevMonthExpensesDiff <= 0 ? "success" : "error"}>
            {data?.prevMonthExpensesDiff !== undefined && data?.prevMonthExpensesDiff >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
            {data?.prevMonthExpensesDiff !== undefined ? Math.abs(data.prevMonthExpensesDiff).toFixed(2) : "..."}
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
}
