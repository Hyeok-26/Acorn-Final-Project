import { FaCrown, FaUserFriends, FaCoins } from "react-icons/fa";

type Item = {
  name: string;
  count: number;
  earned: number;
};

interface PopularItemsSectionProps {
  items: Item[];
}

const rankColors = [
  "bg-yellow-400 text-white", // 1등
  "bg-gray-400 text-white",   // 2등
  "bg-orange-400 text-white", // 3등
];

const PopularItemsSection = ({ items }: PopularItemsSectionProps) => (
  <section className="w-full lg:w-80 bg-white rounded-lg shadow p-6 min-h-[600px] flex flex-col justify-center">
    <div className="text-2xl font-bold mb-4">누적 인기 강좌(수강생 기준)</div>
    <ul className="space-y-4 flex-1 flex flex-col justify-center">
      {items.map((item, idx) => (
        <li
          key={item.name}
          className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 hover:shadow-md transition-all"
        >
          <span className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg ${rankColors[idx] || "bg-gray-200 text-gray-700"}`}>
            {idx === 0 ? <FaCrown /> : idx + 1}
          </span>
          <div className="flex-1">
            <div className="font-semibold text-gray-800">{item.name}</div>
            <div className="text-xs text-gray-500 flex items-center gap-2">
              <FaUserFriends className="inline" /> {item.count}명
              <FaCoins className="inline ml-2" /> {item.earned.toLocaleString()}원
            </div>
          </div>
        </li>
      ))}
    </ul>
  </section>
);

export default PopularItemsSection; 