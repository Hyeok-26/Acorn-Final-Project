import OverviewSection from "@/components/OverviewSection";
import SalesAnalyticsSection from "@/components/SalesAnalyticsSection";
import PopularItemsSection from "@/components/PopularItemsSection";

const overview = [
  {
    title: "현재 수강생 수",
    value: "320",
    diff: "+1.8%",
    sub: "전월 대비 +6명",
    color: "text-blue-600",
    diffColor: "text-blue-500"
  },
  {
    title: "현재 강사 수",
    value: "15",
    diff: "",
    sub: "현재 근무 중",
    color: "text-indigo-600",
    diffColor: ""
  },
  {
    title: "현재 수업 개수",
    value: "15",
    diff: "",
    sub: "현재 강의 중",
    color: "text-indigo-600",
    diffColor: ""
  }
];

const salesData = [
  { month: "1월", sales: 900000 },
  { month: "2월", sales: 950000 },
  { month: "3월", sales: 1100000 },
  { month: "4월", sales: 1200000 },
  { month: "5월", sales: 1300000 },
  { month: "6월", sales: 1400000 },
  { month: "7월", sales: 1500000 },
  { month: "8월", sales: 1600000 },
  { month: "9월", sales: 1700000 },
  { month: "10월", sales: 1800000 },
  { month: "11월", sales: 1900000 },
  { month: "12월", sales: 2000000 },
];

const items = [
  { name: "파이썬 입문", count: 120, earned: 3500000 },
  { name: "자바 중급", count: 98, earned: 2800000 },
  { name: "웹 개발 기초", count: 85, earned: 2100000 },
];

function Admin() {
    
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

export default Admin;