"use client";

import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const REGION_STATS: Record<string, { evCount: number; totalDistance: number }> = {
  '곡성군': { evCount: 502, totalDistance: 232471900 },
  '광양시': { evCount: 2993, totalDistance: 1296410000 },
  '구례군': { evCount: 333, totalDistance: 191696400 },
  '나주시': { evCount: 2444, totalDistance: 1032591000 },
  '담양군': { evCount: 957, totalDistance: 446621600 },
  '목포시': { evCount: 1590, totalDistance: 1288297000 },
  '무안군': { evCount: 1322, totalDistance: 692978000 },
  '보성군': { evCount: 522, totalDistance: 317568500 },
  '순천시': { evCount: 3955, totalDistance: 2033346000 },
  '신안군': { evCount: 7628, totalDistance: 2331231000 },
  '여수시': { evCount: 3454, totalDistance: 1898673000 },
  '영광군': { evCount: 1284, totalDistance: 400371300 },
  '영암군': { evCount: 886, totalDistance: 489290500 },
  '완도군': { evCount: 483, totalDistance: 307461200 },
  '장성군': { evCount: 753, totalDistance: 416124900 },
  '장흥군': { evCount: 486, totalDistance: 279998400 },
  '진도군': { evCount: 407, totalDistance: 209426600 },
  '함평군': { evCount: 742, totalDistance: 712585400 },
  '해남군': { evCount: 981, totalDistance: 2280749000 },
  '화순군': { evCount: 699, totalDistance: 550730400 },
  '고흥군': { evCount: 698, totalDistance: 433616000 },
  '강진군': { evCount: 457, totalDistance: 294173700 },
};

const EMISSION_FACTOR_EV = 56.5; // g/km
const EMISSION_FACTOR_ICE = 245; // g/km
const ICE_CARS_TOTAL = 1246868;

export default function CarbonComparison() {
  const regions = Object.keys(REGION_STATS);
  const [region, setRegion] = useState<string>(regions[0]);
  const [distance, setDistance] = useState<number>(30);
  const [result, setResult] = useState<{ ice: number; ev: number; my: number; saved: number } | null>(null);

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setRegion(selected);
    setResult(null);
  };

  const handleCalculate = () => {
    const iceEmission = Number(((distance * EMISSION_FACTOR_ICE) / 1000).toFixed(2));

    const avgDistance = REGION_STATS[region].totalDistance / REGION_STATS[region].evCount;
    const evAvgEmission = Number(((avgDistance * EMISSION_FACTOR_EV) / 1000).toFixed(2));

    const myEmission = Number(((distance * EMISSION_FACTOR_EV) / 1000).toFixed(2));
    const saved = iceEmission - myEmission;

    setResult({ ice: iceEmission, ev: evAvgEmission, my: myEmission, saved });
  };

  return (
    <div className="p-4 border rounded shadow bg-white max-w-4xl mx-auto">
      <h2 className="text-lg font-bold mb-4">🚗 내 주행거리, 전기차와 내연기관차의 차이는?</h2>

      <div className="flex flex-wrap gap-4 items-end mb-4">
        {/* ✅ 시군 선택 드롭다운: 가로 길이 주행거리 입력창과 동일하게 수정 */}
        <div className="flex flex-col gap-2 min-w-[200px] w-full sm:w-auto">
          <label className="block text-sm font-medium mb-1">시군 선택</label>
          <select
            className="w-full border px-2 py-1 rounded text-sm"
            value={region}
            onChange={handleRegionChange}
          >
            {regions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div className="text-sm text-gray-700">
          🔧 내 차가 내연기관차였다면: <strong>{((distance * EMISSION_FACTOR_ICE) / 1000).toFixed(2)}</strong> kg CO₂
          {result && (
            <div className="mt-1 text-xs text-gray-600 space-y-1">
              <p>🔋 {region} 전기차 평균 배출량: <strong>{result.ev.toFixed(2)}</strong> kg CO₂</p>
              <p>🧍 나의 전기차 배출량: <strong>{result.my.toFixed(2)}</strong> kg CO₂</p>
              <p>🌱 절감량: <strong>{result.saved.toFixed(2)}</strong> kg CO₂</p>
              <p>🌳 약 <strong>{Math.round(result.saved / 0.15)}</strong> 그루의 나무 심은 효과</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col gap-2 min-w-[200px]">
          <label className="block text-sm font-medium">내 전기차 주행거리 (km)</label>
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(parseInt(e.target.value) || 0)}
            className="border px-2 py-1 rounded text-sm w-full"
            min={0}
          />
          <button
            onClick={handleCalculate}
            className="mt-2 bg-blue-600 text-white px-3 py-1.5 text-sm rounded hover:bg-blue-700"
          >
            계산하기
          </button>
        </div>

        {result && (
          <div className="flex-1 min-w-[280px]">
            <Bar
              data={{
                labels: ['전남 내연기관차', `${region} 전기차 평균`, '나의 전기차'],
                datasets: [{
                  label: '',
                  data: [result.ice, result.ev, result.my],
                  backgroundColor: ['#E74C3C', '#82E0AA', '#2ECC71'],
                }],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                  title: { display: false },
                },
                indexAxis: 'y',
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: 'CO₂ (kg)',
                      font: { size: 10 },
                    },
                    ticks: { font: { size: 10 } },
                    beginAtZero: true,
                  },
                  y: {
                    ticks: { font: { size: 10 } },
                  },
                },
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
