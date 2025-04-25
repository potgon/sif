import FinanceMetrics from "../../components/finances/FinanceMetrics.tsx";
import AnnualExpensesChart from "../../components/finances/AnnualExpensesChart.tsx";
import StatisticsChart from "../../components/finances/StatisticsChart";
import MonthlyTarget from "../../components/finances/MonthlyTarget";
import RecentOrders from "../../components/finances/RecentOrders";
import DemographicCard from "../../components/finances/DemographicCard";
import PageMeta from "../../components/common/PageMeta";
import {useState} from "react";

const months = [
    {label: "January", value: 1},
    {label: "February", value: 2},
    {label: "March", value: 3},
    {label: "April", value: 4},
    {label: "May", value: 5},
    {label: "June", value: 6},
    {label: "July", value: 7},
    {label: "August", value: 8},
    {label: "September", value: 9},
    {label: "October", value: 10},
    {label: "November", value: 11},
    {label: "December", value: 12},
]

const years = Array.from({length: 5}, (_, i) => new Date().getFullYear() - i)

export default function Home() {
    const now = new Date()
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1)
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
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
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
                    <FinanceMetrics year={Number(selectedYear)} month={Number(selectedMonth)}/>

                    <AnnualExpensesChart year={Number(selectedYear)}/>
                </div>

                <div className="col-span-12 xl:col-span-5">
                    <MonthlyTarget/>
                </div>

                <div className="col-span-12">
                    <StatisticsChart/>
                </div>

                <div className="col-span-12 xl:col-span-5">
                    <DemographicCard/>
                </div>

                <div className="col-span-12 xl:col-span-7">
                    <RecentOrders/>
                </div>
            </div>
        </>
    );
}
