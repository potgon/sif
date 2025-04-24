import Chart from "react-apexcharts";
import {options} from "../../utils/constants.ts";
import {useEffect, useState} from "react";
import {AnnualMetrics, fetchAnnualMetrics} from "../../api/finances/metrics.ts";

interface Props {
    year: number
}

export default function MonthlySalesChart({year}: Readonly<Props>) {
    const [annualData, setAnnualData] = useState<AnnualMetrics | null>(null)
    const [loading, setLoading] = useState(true)
    const series = [
        {
            name: "Expenses",
            data: annualData?.totalExpenses ?? [],
        },
    ];
    useEffect(() => {
        setLoading(true)
        fetchAnnualMetrics(year)
            .then(setAnnualData)
            .catch((err) => {
                console.error("Error fetching metrics", err)
                setAnnualData(null)
            })
            .finally(() => setLoading(false))
    }, [year])

    return (
        <div
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Monthly Expenses
                </h3>
            </div>

            <div className="max-w-full overflow-x-auto custom-scrollbar">
                <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
                    <Chart options={options} series={loading ? [] : series} type="bar" height={180}/>
                </div>
            </div>
        </div>
    );
}
