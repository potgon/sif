import Chart from "react-apexcharts";
import {ApexOptions} from "apexcharts";
import {useCallback, useEffect, useState} from "react";
import {fetchMonthlyExpenseTarget} from "../../api/finances/metrics.ts";
import {MonthlyExpenseTarget} from "../../api/finances/types.ts";

interface Props {
    year: number,
    month: number,
}

export default function MonthlyTarget({year, month}: Readonly<Props>) {
    const options: ApexOptions = {
        colors: ["#465FFF"],
        chart: {
            fontFamily: "Outfit, sans-serif",
            type: "radialBar",
            height: 330,
            sparkline: {
                enabled: true,
            },
        },
        plotOptions: {
            radialBar: {
                startAngle: -85,
                endAngle: 85,
                hollow: {
                    size: "80%",
                },
                track: {
                    background: "#E4E7EC",
                    strokeWidth: "100%",
                    margin: 5, // margin is in pixels
                },
                dataLabels: {
                    name: {
                        show: false,
                    },
                    value: {
                        fontSize: "36px",
                        fontWeight: "600",
                        offsetY: -40,
                        color: "#1D2939",
                        formatter: function (val) {
                            return val + "%";
                        },
                    },
                },
            },
        },
        fill: {
            type: "solid",
            colors: ["#465FFF"],
        },
        stroke: {
            lineCap: "round",
        },
        labels: ["Progress"],
    };
    const [data, setData] = useState<MonthlyExpenseTarget | null>(null);
    const [loading, setLoading] = useState(true)
    const series = [data?.currentExpensePercentage ?? 0] ;

    const refetchData = useCallback(() => {
        setLoading(true);
        fetchMonthlyExpenseTarget(year, month)
            .then(setData)
            .catch((err) => {
                console.error("Error fetching metrics", err);
                setData(null);
            })
            .finally(() => setLoading(false));
    }, [year, month]);

    useEffect(() => {
        refetchData();
        const handleRefresh = () => refetchData();
        window.addEventListener('transactionUpdated', handleRefresh);
        return () => window.removeEventListener('transactionUpdated', handleRefresh);
    }, [refetchData]);

    return (
        <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
                <div className="flex justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                            Objetivo de Gastos Mensuales
                        </h3>
                        <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
                            Detalles del objetivo de gasto que has establecido para este mes
                        </p>
                    </div>
                </div>
                <div className="relative ">
                    <div className="max-h-[330px]" id="chartDarkStyle">
                        <Chart
                            options={options}
                            series={loading ? [] : series}
                            type="radialBar"
                            height={330}
                        />
                    </div>
                </div>
                <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
                    Has establecido un objetivo de gastos de {data?.targetExpense ?? '...'}€ para este mes
                </p>
            </div>

            <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
                <div>
                    <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
                        Objetivo
                    </p>
                    <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
                        {data?.targetPercentage ?? '...'}%
                    </p>
                </div>

                <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

                <div>
                    <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
                        Superávit
                    </p>
                    <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
                        {data?.surplus ?? '...'}€
                    </p>
                </div>

                <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

                <div>
                    <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
                        Acumulado
                    </p>
                    <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
                        {data?.accumulated ?? '...'}€
                    </p>
                </div>
            </div>
        </div>
    );
}
