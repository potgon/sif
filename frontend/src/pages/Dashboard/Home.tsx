import FinanceMetrics from "../../components/expenses/FinanceMetrics.tsx";
import AnnualExpensesChart from "../../components/expenses/AnnualExpensesChart.tsx";
import MonthlyTarget from "../../components/expenses/MonthlyTarget";
import RecentTransactions from "../../components/expenses/RecentTransactions.tsx";
import PageMeta from "../../components/common/PageMeta";
import {useState} from "react";

const months = [
    {label: "Enero", value: 1},
    {label: "Febrero", value: 2},
    {label: "Marzo", value: 3},
    {label: "Abril", value: 4},
    {label: "Mayo", value: 5},
    {label: "Junio", value: 6},
    {label: "Julio", value: 7},
    {label: "Agosto", value: 8},
    {label: "Septiembre", value: 9},
    {label: "Octubre", value: 10},
    {label: "Noviembre", value: 11},
    {label: "Diciembre", value: 12},
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
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Panel de Control</h2>

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
                    <MonthlyTarget year={Number(selectedYear)} month={Number(selectedMonth)}/>
                </div>

                {/*<div className="col-span-12 xl:col-span-6">
                    <StatisticsChart/>
                </div>*/}

                <div className="col-span-12 xl:col-span-6">
                    <RecentTransactions year={Number(selectedYear)} month={Number(selectedMonth)}/>
                </div>
            </div>
        </>
    );
}
