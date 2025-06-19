"use client";

import React, { useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";

declare global {
  interface Window {
    kakao: any;
  }
}

const categoryMap: Record<string, string> = {
  "🍴 식당": "FD6",
  "☕ 카페": "CE7",
  "🏪 편의점": "CS2",
  "🌳 공원": "AT4",
  "🅿️ 주차장": "PK6",
};

interface PlaceClick {
  name: string;
  count: number;
}

export default function StoreMapContent() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [markers, setMarkers] = useState<any[]>([]);
  const [overlays, setOverlays] = useState<any[]>([]);
  const [clickCounts, setClickCounts] = useState<Record<string, number>>({});
  const [placeDetails, setPlaceDetails] = useState<
    Record<string, { address: string; tel: string }>
  >({});
  const router = useRouter();

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://dapi.kakao.com/v2/maps/sdk.js?appkey=5feab55ffc4253ee492145692b2dd466&autoload=false&libraries=services";
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        if (!mapRef.current) return;

        const center = new window.kakao.maps.LatLng(37.498095, 127.02761);
        const mapInstance = new window.kakao.maps.Map(mapRef.current, {
          center,
          level: 4,
        });

        setMap(mapInstance);
      });
    };
  }, []);

  const clearMarkersAndOverlays = () => {
    markers.forEach((m) => m.setMap(null));
    overlays.forEach((o) => o.setMap(null));
    setMarkers([]);
    setOverlays([]);
  };

  const createMarkersFromPlaces = (places: any[]) => {
    const bounds = new window.kakao.maps.LatLngBounds();
    const newMarkers: any[] = [];
    const newOverlays: any[] = [];

    places.forEach((place) => {
      if (!place.x || !place.y) return;

      const position = new window.kakao.maps.LatLng(place.y, place.x);

      const marker = new window.kakao.maps.Marker({
        map,
        position,
      });

      const overlayContent = `
        <div style="padding:10px; background:#fff; border-radius:10px; box-shadow:0 2px 8px rgba(0,0,0,0.2);">
          <strong>${place.place_name}</strong><br/>
          ${place.address_name || place.road_address_name}<br/>
          ${place.phone || ""}
        </div>`;

      const overlay = new window.kakao.maps.CustomOverlay({
        content: overlayContent,
        position: position,
        yAnchor: 2,
        zIndex: 3,
      });

      let visible = false;
      window.kakao.maps.event.addListener(marker, "click", () => {
        if (visible) {
          overlay.setMap(null);
        } else {
          newOverlays.forEach((o) => o.setMap(null));
          overlay.setMap(map);
        }
        visible = !visible;

        setClickCounts((prev) => {
          const newCount = {
            ...prev,
            [place.place_name]: (prev[place.place_name] || 0) + 1,
          };
          return newCount;
        });

        setPlaceDetails((prev) => ({
          ...prev,
          [place.place_name]: {
            address: place.address_name || place.road_address_name,
            tel: place.phone || "전화번호 없음",
          },
        }));
      });

      newMarkers.push(marker);
      newOverlays.push(overlay);
      bounds.extend(position);
    });

    map.setBounds(bounds);
    setMarkers(newMarkers);
    setOverlays(newOverlays);
  };

  const handleSearch = () => {
    if (!searchTerm.trim() || !map) return;
    clearMarkersAndOverlays();

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(searchTerm, (data: any[], status: string) => {
      if (status === window.kakao.maps.services.Status.OK) {
        createMarkersFromPlaces(data);
      } else {
        alert("검색 결과가 없습니다.");
      }
    });
  };

  const handleCategoryClick = (categoryName: string) => {
    if (!map) return;
    clearMarkersAndOverlays();

    const center = map.getCenter();
    const ps = new window.kakao.maps.services.Places();

    if (categoryName === "🌳 공원") {
      ps.keywordSearch("공원", (data: any[], status: string) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const sortedData = data.sort((a, b) => {
            const centerLat = center.getLat();
            const centerLng = center.getLng();
            const distA = Math.sqrt(Math.pow(a.y - centerLat, 2) + Math.pow(a.x - centerLng, 2));
            const distB = Math.sqrt(Math.pow(b.y - centerLat, 2) + Math.pow(b.x - centerLng, 2));
            return distA - distB;
          });
          createMarkersFromPlaces(sortedData.slice(0, 15));
        } else {
          alert("공원 검색 결과가 없습니다.");
        }
      }, {
        location: center,
        radius: 5000,
        sort: window.kakao.maps.services.SortBy.DISTANCE
      });
    } else {
      ps.categorySearch(
        categoryMap[categoryName],
        (data: any[], status: string) => {
          if (status === window.kakao.maps.services.Status.OK) {
            createMarkersFromPlaces(data);
          } else {
            alert("검색 결과가 없습니다.");
          }
        },
        { location: center, radius: 2000 }
      );
    }
  };

  const top3: PlaceClick[] = Object.entries(clickCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", padding: "20px" }}>
      <div style={{ width: "880px", margin: "0 auto", display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="지역명 (예: 서울 강남)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          style={{
            flex: 1,
            padding: "10px",
            fontSize: "16px",
            border: "2px solid #ccc",
            borderRadius: "8px",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "10px 20px",
            backgroundColor: "#8e44ad",
            color: "white",
            fontWeight: "bold",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          검색
        </button>
      </div>

      <div
        style={{
          width: "880px",
          margin: "15px auto 0",
          display: "flex",
          gap: "10px",
          justifyContent: "space-between",
        }}
      >
        {Object.keys(categoryMap).map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            style={categoryBtnStyle(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div
        ref={mapRef}
        style={{
          width: "880px",
          height: "500px",
          margin: "20px auto",
          borderRadius: "12px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      />

      <div
        style={{
          width: "880px",
          margin: "30px auto",
          padding: "20px",
          borderRadius: "20px",
          background: "#fff",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>
          🔥 인기 편의시설 TOP 3
        </h2>

        {top3.length > 0 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            {top3.map((place, idx) => {
              const detail = placeDetails[place.name];
              return (
                <div
                  key={idx}
                  style={{
                    flex: "1 1 30%",
                    background: "#f9f9f9",
                    padding: "12px",
                    borderRadius: "10px",
                    textAlign: "left",
                    lineHeight: "1.5",
                    minWidth: "200px",
                    maxWidth: "260px",
                  }}
                >
                  <strong>{idx + 1}. {place.name}</strong><br />
                  📍 {detail?.address || "주소 없음"}<br />
                  ☎️ {detail?.tel || "전화번호 없음"}
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ color: "#777", fontSize: "14px" }}>
            편의시설을 클릭해보세요! 📍<br />
            클릭할수록 인기 장소가 여기에 표시됩니다.
          </p>
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "30px",
          marginBottom: "40px",
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            width: "360px",
            padding: "14px 0",
            fontSize: "18px",
            fontWeight: "bold",
            backgroundColor: "#3498db",
            color: "white",
            border: "2px solid #2980b9",
            borderRadius: "12px",
            cursor: "pointer",
          }}
        >
          🔌 뒤로 가기
        </button>
      </div>
    </div>
  );
}

function categoryBtnStyle(label: string) {
  const colors: Record<string, string> = {
    "🍴 식당": "#e74c3c",
    "☕ 카페": "#f39c12",
    "🏪 편의점": "#3498db",
    "🌳 공원": "#2ecc71",
    "🅿️ 주차장": "#27ae60",
  };
  return {
    flex: 1,
    padding: "10px 0",
    fontSize: "16px",
    fontWeight: "bold",
    color: "white",
    backgroundColor: colors[label],
    border: "none",
    borderRadius: "24px",
    cursor: "pointer",
  };
}
