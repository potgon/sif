import FinanceMetrics from "../../components/finances/FinanceMetrics.tsx";
import MonthlySalesChart from "../../components/finances/MonthlySalesChart";
import StatisticsChart from "../../components/finances/StatisticsChart";
import MonthlyTarget from "../../components/finances/MonthlyTarget";
import RecentOrders from "../../components/finances/RecentOrders";
import DemographicCard from "../../components/finances/DemographicCard";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Sif - Home"
        description="Sif - Home"
      />
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
