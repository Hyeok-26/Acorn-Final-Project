import OverviewSection from "@/components/ceo/OverviewSection";
import SalesAnalyticsSection from "@/components/ceo/SalesAnalyticsSection";
import PopularItemsSection from "@/components/ceo/PopularItemsSection";

function Ceo() {
  // 예시 데이터
  const overview = [
    {
      title: "본사 발주수익",
      value: "$35,485",
      diff: "+2.8%",
      sub: "작년 대비 +$2,450",
      color: "text-green-600",
      diffColor: "text-green-500"
    },
    {
      title: "전체 누적 수강생",
      value: "15,235",
      diff: "+2.8%",
      sub: "작년 대비 +2.8%",
      color: "text-blue-600",
      diffColor: "text-blue-500"
    },
    {
      title: "운영중인 학원 수",
      value: "120",
      diff: "",
      sub: "현재 운영중",
      color: "text-indigo-600",
      diffColor: ""
    }
  ];

  const salesData = [
    { month: "0", sales: 0 },
    { month: "1월", sales: 1000000 },
    { month: "2월", sales: 1200000 },
    { month: "3월", sales: 1500000 },
    { month: "4월", sales: 1800000 },
    { month: "5월", sales: 2000000 },
    { month: "6월", sales: 2100000 },
    { month: "7월", sales: 2200000 },
    { month: "8월", sales: 2500000 },
    { month: "9월", sales: 2700000 },
    { month: "10월", sales: 3000000 },
    { month: "11월", sales: 3200000 },
    { month: "12월", sales: 3500000 },
  ];

  const items = [
    { name: "JAVA", count: 3251, earned: 12345 },
    { name: "PYTHON", count: 2890, earned: 11200 },
    { name: "JAVASCRIPT", count: 2100, earned: 9800 },
  ];

  return (
    <div className="flex flex-col gap-6 p-8 bg-gray-50 min-h-screen">
      <OverviewSection overview={overview} />
      <div className="flex flex-col lg:flex-row gap-6">
        <SalesAnalyticsSection salesData={salesData} />
        <PopularItemsSection items={items} />
      </div>
    </div>
  );
}

export default Ceo;