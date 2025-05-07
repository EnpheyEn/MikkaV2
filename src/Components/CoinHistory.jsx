import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

const mockCoinHistory = [
  {
    id: 1,
    date: "2025-04-15T10:30:00",
    type: "earn",
    amount: 5,
    description: "Received coins from QR scan",
    branch: "Siam Paragon", // เพิ่มชื่อสาขา
  },
  {
    id: 2,
    date: "2025-04-20T14:15:00",
    type: "spend",
    amount: -10,
    description: "Redeemed for Iced Latte",
    branch: "Central World",
  },
  {
    id: 3,
    date: "2025-05-01T08:45:00",
    type: "earn",
    amount: 3,
    description: "Bonus coins from birthday promo",
    branch: "ICONSIAM",
  },
];

function CoinHistory() {
  const [coinHistory, setCoinHistory] = useState([]);

  useEffect(() => {
    setCoinHistory(mockCoinHistory);
  }, []);

  return (
    <div className="min-h-screen bg-white p-4 pt-20 max-w-xl mx-auto">
      <h1 className="mt-5 text-xl font-bold mb-4 text-center text-[#D51F39]">
        Coin History
      </h1>

      {coinHistory.length === 0 ? (
        <p className="text-center text-gray-500">No history found.</p>
      ) : (
        <ul className="space-y-4">
          {coinHistory.map((item) => (
            <li
              key={item.id}
              className="border border-[#D51F39] rounded-xl p-4 shadow-sm bg-gray-50 "
            >
              <p className="text-gray-800">{item.description}</p>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">
                  {dayjs(item.date).format("DD MMM YYYY HH:mm")}
                </span>
                <div className="flex items-center gap-1">
                  <span
                    className={`font-bold flex items-center gap-1 ${
                      item.type === "earn" ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {item.amount > 0 ? `+${item.amount}` : item.amount}
                    <img className="w-5 h-5" src="/mk_ui_coin.png" alt="coin" />
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500">Branch: {item.branch}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CoinHistory;
