"use client";

import React, { useState } from "react";

const averageDistanceByRegion: Record<string, number> = {
  '순천시': 28,
  '여수시': 30,
  '광양시': 32,
  '목포시': 26,
  '해남군': 38,
  '고흥군': 36,
  '완도군': 34,
  '강진군': 39,
  '장흥군': 37,
  '보성군': 35,
};

export default function CarbonComparison() {
  const [region, setRegion] = useState<string>('순천시');
  const [distance, setDistance] = useState<number>(averageDistanceByRegion['순천시']);
  const [result, setResult] = useState<{ gasoline: string; ev: string; saved: string } | null>(null);

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRegion = e.target.value;
    setRegion(selectedRegion);
    setDistance(averageDistanceByRegion[selectedRegion] || 30);
    setResult(null);
  };

  const handleCalculate = () => {
    const gasolineCO2 = 192;
    const evCO2 = 60;
    const saved = (distance * (gasolineCO2 - evCO2)) / 1000;

    setResult({
      gasoline: ((distance * gasolineCO2) / 1000).toFixed(2),
      ev: ((distance * evCO2) / 1000).toFixed(2),
      saved: saved.toFixed(2),
    });
  };

  return (
    <div className="p-4 border rounded shadow bg-white">
      <h2 className="text-xl font-bold mb-4">📉 탄소 절감 계산기</h2>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">시군 선택:</label>
        <select
          className="w-full border px-3 py-2 rounded"
          value={region}
          onChange={handleRegionChange}
        >
          {Object.keys(averageDistanceByRegion).map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">주행거리 (km):</label>
        <input
          type="number"
          value={distance}
          onChange={(e) => setDistance(Number(e.target.value))}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <button
        onClick={handleCalculate}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        절감량 계산하기
      </button>

      {result && (
        <div className="mt-4 text-sm">
          <p>🚗 내연기관차 배출량: <strong>{result.gasoline}</strong> kg CO₂</p>
          <p>🔋 전기차 배출량: <strong>{result.ev}</strong> kg CO₂</p>
          <p>🌱 절감량: <strong>{result.saved}</strong> kg CO₂</p>
        </div>
      )}
    </div>
  );
}
