"use client";

import { useEffect, useState } from "react";

interface VoiceLog {
  time: string;
  command: string;
}

interface Props {
  onClose: () => void;
}

export function VoiceLogModal({ onClose }: Props) {
  const [logs, setLogs] = useState<VoiceLog[]>([]);

  useEffect(() => {
    const storedLogs = localStorage.getItem("voiceLogs");
    if (storedLogs) {
      setLogs(JSON.parse(storedLogs));
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 w-[90%] max-w-lg p-6 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">음성 인식 로그</h2>

        <button
          className="text-sm text-blue-500 hover:underline mb-4"
          onClick={onClose}
        >
          ✕ 닫기
        </button>

        {logs.length === 0 ? (
          <p className="text-gray-500">기록된 명령어가 없습니다.</p>
        ) : (
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {logs
              .slice()
              .reverse()
              .map((log, index) => (
                <li
                  key={index}
                  className="p-2 border rounded bg-white dark:bg-gray-700"
                >
                  <div className="text-sm text-gray-500">
                    {new Date(log.time).toLocaleString("ko-KR")}
                  </div>
                  <div className="text-base">{log.command}</div>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}
