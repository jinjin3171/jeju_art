import React, { useState } from "react";
import { Landmark } from "lucide-react";

interface JejuMapProps {
  selectedRegion: "제주시" | "서귀포시" | null;
  onSelectRegion: (region: "제주시" | "서귀포시" | null) => void;
  scores: {
    "제주시": { total: number; perCapita: number; venues: number; corps: number; groups: number; galleries: number };
    "서귀포시": { total: number; perCapita: number; venues: number; corps: number; groups: number; galleries: number };
  };
  isDarkMode?: boolean;
}

export const JejuMap: React.FC<JejuMapProps> = ({
  selectedRegion,
  onSelectRegion,
  scores
}) => {
  const [hoveredRegion, setHoveredRegion] = useState<"제주시" | "서귀포시" | null>(null);
  const [activePin, setActivePin] = useState<{ name: string; info: string; x: number; y: number } | null>(null);

  // 대표적인 핀들 (지도상 위치 매핑 - 가상의 중심 좌표로 설정)
  const pins = [
    { name: "제주아트센터", type: "venue", region: "제주시", x: 200, y: 130, info: "공연장 (1,184석)" },
    { name: "제주도립미술관", type: "gallery", region: "제주시", x: 190, y: 180, info: "도립 대표 미술관" },
    { name: "제주문예회관", type: "venue", region: "제주시", x: 260, y: 120, info: "문화예술회관" },
    { name: "저지문화예술인마을", type: "gallery", region: "제주시", x: 75, y: 220, info: "서부 예술창작 마을" },
    { name: "서귀포예술의전당", type: "venue", region: "서귀포시", x: 210, y: 310, info: "공연장 (992석)" },
    { name: "이중섭미술관", type: "gallery", region: "서귀포시", x: 230, y: 320, info: "서귀포 대표 미술관" },
    { name: "김영갑갤러리 두모악", type: "gallery", region: "서귀포시", x: 370, y: 260, info: "동부 자연친화 갤러리" },
  ];

  const handleRegionClick = (region: "제주시" | "서귀포시") => {
    if (selectedRegion === region) {
      onSelectRegion(null);
    } else {
      onSelectRegion(region);
    }
  };

  const seoguipoPercentOfJeju = (scores["서귀포시"].total / (scores["제주시"].total || 1)) * 100;
  const imbalancePercent = (scores["서귀포시"].perCapita / (scores["제주시"].perCapita || 1)) * 100;

  return (
    <div className="relative bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-2xl p-6 shadow-md overflow-hidden min-h-[480px] transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-sm sm:text-base font-serif text-[var(--text-white-invert)] uppercase tracking-widest flex items-center gap-2 font-semibold transition-colors">
            <Landmark className="w-4 h-4 text-[var(--text-title)]" />
            제주특별자치도 예술생태계 지형도
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] font-sans mt-1.5 transition-colors">지도를 클릭하면 미세 가중치 배율에 수렴된 실시간 세부 지표가 로드됩니다.</p>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={() => onSelectRegion(null)}
            className={`px-3 py-1.5 text-xs font-semibold uppercase rounded border transition-all font-sans cursor-pointer ${
              !selectedRegion
                ? "bg-[var(--text-title)] border-[var(--text-title)] text-[var(--app-bg)] font-bold shadow-sm"
                : "border-[var(--panel-border)] text-[var(--text-muted)] bg-[var(--subpanel-bg)] hover:bg-[var(--preset-btn-bg)] hover:text-[var(--text-white-invert)]"
            }`}
          >
            전체 보기
          </button>
          <button
            onClick={() => onSelectRegion("제주시")}
            className={`px-3 py-1.5 text-xs font-semibold uppercase rounded border transition-all font-sans cursor-pointer ${
              selectedRegion === "제주시"
                ? "bg-[var(--text-title)] border-[var(--text-title)] text-[var(--app-bg)] font-bold shadow-sm"
                : "border-[var(--panel-border)] text-[var(--text-muted)] bg-[var(--subpanel-bg)] hover:bg-[var(--preset-btn-bg)] hover:text-[var(--text-white-invert)]"
            }`}
          >
            제주시
          </button>
          <button
            onClick={() => onSelectRegion("서귀포시")}
            className={`px-3 py-1.5 text-xs font-semibold uppercase rounded border transition-all font-sans cursor-pointer ${
              selectedRegion === "서귀포시"
                ? "bg-[var(--text-title)] border-[var(--text-title)] text-[var(--app-bg)] font-bold shadow-sm"
                : "border-[var(--panel-border)] text-[var(--text-muted)] bg-[var(--subpanel-bg)] hover:bg-[var(--preset-btn-bg)] hover:text-[var(--text-white-invert)]"
            }`}
          >
            서귀포시
          </button>
        </div>
      </div>

      <div className="flex justify-center items-center h-[340px] relative">
        <div className="relative w-full max-w-[440px] aspect-[5/4] flex items-center justify-center">
          <svg
            viewBox="0 0 500 400"
            className="w-full h-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.15)] select-none transition-all duration-300"
          >
            {/* 제주시 (북부 영역) */}
            <path
              d="M 50 210 C 50 180, 80 140, 140 100 C 180 80, 240 60, 310 60 C 370 60, 420 100, 450 140 C 470 170, 470 190, 430 205 C 380 220, 320 215, 270 215 C 220 215, 170 220, 110 225 C 80 228, 50 225, 50 210 Z"
              fill={selectedRegion === "제주시" ? "var(--map-active-bg)" : hoveredRegion === "제주시" ? "var(--map-hover-si)" : "var(--map-si-bg)"}
              stroke={selectedRegion === "제주시" ? "var(--text-title)" : "var(--panel-border)"}
              strokeWidth={selectedRegion === "제주시" ? "2.5" : "1.2"}
              className="cursor-pointer transition-all duration-300"
              onClick={() => handleRegionClick("제주시")}
              onMouseEnter={() => setHoveredRegion("제주시")}
              onMouseLeave={() => setHoveredRegion(null)}
            />

            {/* 서귀포시 (남부 영역) */}
            <path
              d="M 50 210 C 50 225, 80 228, 110 225 C 170 220, 220 215, 270 215 C 320 215, 380 220, 430 205 C 470 190, 470 210, 450 240 C 420 280, 370 330, 310 330 C 240 330, 180 320, 140 300 C 80 260, 50 230, 50 210 Z"
              fill={selectedRegion === "서귀포시" ? "var(--map-active-bg)" : hoveredRegion === "서귀포시" ? "var(--map-hover-seo)" : "var(--map-seo-bg)"}
              stroke={selectedRegion === "서귀포시" ? "var(--text-title)" : "var(--panel-border)"}
              strokeWidth={selectedRegion === "서귀포시" ? "2.5" : "1.2"}
              className="cursor-pointer transition-all duration-300"
              onClick={() => handleRegionClick("서귀포시")}
              onMouseEnter={() => setHoveredRegion("서귀포시")}
              onMouseLeave={() => setHoveredRegion(null)}
            />

            {/* 한라산 상징 중심원 */}
            <ellipse
              cx="250"
              cy="200"
              rx="45"
              ry="25"
              fill="var(--subpanel-bg)"
              stroke="var(--panel-border)"
              strokeWidth="1"
              className="pointer-events-none opacity-80"
            />

            {/* 지역 레이블 - 떠있는 글씨 형태 */}
            <g
              className="cursor-pointer select-none"
              onClick={() => handleRegionClick("제주시")}
              onMouseEnter={() => setHoveredRegion("제주시")}
              onMouseLeave={() => setHoveredRegion(null)}
            >
              <text
                x="250"
                y="110"
                textAnchor="middle"
                fill={selectedRegion === "제주시" ? "var(--text-title)" : hoveredRegion === "제주시" ? "var(--text-white-invert)" : "var(--text-muted)"}
                className="text-xs font-sans font-bold tracking-widest transition-colors duration-200"
              >
                제주시
              </text>
            </g>

            <g
              className="cursor-pointer select-none"
              onClick={() => handleRegionClick("서귀포시")}
              onMouseEnter={() => setHoveredRegion("서귀포시")}
              onMouseLeave={() => setHoveredRegion(null)}
            >
              <text
                x="250"
                y="290"
                textAnchor="middle"
                fill={selectedRegion === "서귀포시" ? "var(--text-title)" : hoveredRegion === "서귀포시" ? "var(--text-white-invert)" : "var(--text-muted)"}
                className="text-xs font-sans font-bold tracking-widest transition-colors duration-200"
              >
                서귀포시
              </text>
            </g>

            {/* 주요 핀 오버레이 */}
            {pins.map((pin, i) => (
              <g
                key={i}
                className="cursor-pointer"
                onMouseEnter={() => setActivePin({ name: pin.name, info: pin.info, x: pin.x, y: pin.y })}
                onMouseLeave={() => setActivePin(null)}
              >
                <circle
                  cx={pin.x}
                  cy={pin.y}
                  r="5"
                  fill="var(--text-title)"
                  stroke="var(--app-bg)"
                  strokeWidth="1.5"
                  className="transition-colors duration-200"
                />
              </g>
            ))}
          </svg>

          {/* 미니 툴팁 / 브리핑 보드 */}
          {activePin && (
            <div
              className="absolute bg-[var(--panel-bg)] text-[var(--app-text)] rounded-xl p-3 shadow-xl text-[11px] z-30 flex flex-col gap-0.5 border border-[var(--text-title)]/40 pointer-events-none animate-fade-in"
              style={{
                left: `${(activePin.x / 500) * 100}%`,
                top: `${(activePin.y / 400) * 100 - 15}%`,
                transform: "translate(-50%, -100%)"
              }}
            >
              <span className="font-semibold whitespace-nowrap text-[var(--text-title)]">{activePin.name}</span>
              <span className="text-[var(--text-muted)] text-[9px] uppercase tracking-wider">{activePin.info}</span>
            </div>
          )}
        </div>
      </div>

      {/* 미니 비교 상태판 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 p-4 bg-[var(--subpanel-bg)] border border-[var(--panel-border)] rounded-2xl animate-fade-in transition-colors">
        <div
          onClick={() => handleRegionClick("제주시")}
          className={`p-5 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between ${
            selectedRegion === "제주시" ? "bg-[var(--panel-bg)] border-[var(--text-title)] shadow-lg shadow-[#dfb35a]/5" : "border-[var(--panel-border)] bg-[var(--panel-bg)] hover:bg-[var(--preset-btn-bg)]"
          }`}
        >
          <div>
            <div className="flex items-center justify-between border-b border-[var(--panel-border)] pb-3 mb-4 transition-colors">
              <div className="flex items-center gap-2 text-[var(--text-title)] font-serif font-bold text-sm uppercase tracking-wider transition-colors">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--text-title)] transition-colors"></span>
                제주시
              </div>
              <span className="text-xs text-[var(--text-muted)] font-medium bg-[var(--subpanel-bg)]/80 px-2.5 py-1 rounded tracking-wide font-sans border border-[var(--panel-border)] transition-colors">인구 약 49.4만 명</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider block font-sans transition-colors">예술생태계 총합</span>
                <span className="text-3xl md:text-4xl font-sans font-bold text-[var(--text-title)] block transition-colors">{scores["제주시"].total.toFixed(1)}</span>
                <p className="text-xs text-[var(--text-muted)] leading-normal font-sans transition-colors">인프라 총량 가중 평가 스코어 (62.7% 비중)</p>
              </div>

              <div className="space-y-1 sm:border-l sm:border-[var(--panel-border)] sm:pl-5 transition-colors">
                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider block font-sans transition-colors">인구 1만명당 지수 밀도</span>
                <span className="text-2xl md:text-3xl font-sans font-bold text-[var(--text-white-invert)] block transition-colors">{scores["제주시"].perCapita.toFixed(2)}</span>
                <p className="text-xs text-[var(--text-muted)] leading-normal font-sans transition-colors">인구 비례 밀도 (제주시 약 49.4만명)</p>
              </div>
            </div>
          </div>
        </div>

        <div
          onClick={() => handleRegionClick("서귀포시")}
          className={`p-5 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between ${
            selectedRegion === "서귀포시" ? "bg-[var(--panel-bg)] border-[var(--text-title)] shadow-lg shadow-[#dfb35a]/5" : "border-[var(--panel-border)] bg-[var(--panel-bg)] hover:bg-[var(--preset-btn-bg)]"
          }`}
        >
          <div>
            <div className="flex items-center justify-between border-b border-[var(--panel-border)] pb-3 mb-4 transition-colors">
              <div className="flex items-center gap-2 text-[var(--text-title)] font-serif font-bold text-sm uppercase tracking-wider transition-colors">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--text-title)] transition-colors"></span>
                서귀포시
              </div>
              <span className="text-xs text-[var(--text-muted)] font-medium bg-[var(--subpanel-bg)]/80 px-2.5 py-1 rounded tracking-wide font-sans border border-[var(--panel-border)] transition-colors">인구 약 19.1만 명</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider block font-sans transition-colors">예술생태계 총합</span>
                <span className="text-3xl md:text-4xl font-sans font-bold text-[var(--text-title)] block transition-colors">{scores["서귀포시"].total.toFixed(1)}</span>
                <p className="text-xs text-[var(--text-muted)] leading-normal font-sans transition-colors">
                  제주시 대비 <strong className="text-[var(--text-white-invert)] font-medium font-sans">{seoguipoPercentOfJeju.toFixed(1)}%</strong> 수준
                </p>
              </div>

              <div className="space-y-1 sm:border-l sm:border-[var(--panel-border)] sm:pl-5 transition-colors">
                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider block font-sans transition-colors">인구 1만명당 지수 밀도</span>
                <span className="text-2xl md:text-3xl font-sans font-bold text-[var(--text-white-invert)] block transition-colors">{scores["서귀포시"].perCapita.toFixed(2)}</span>
                <p className="text-xs text-[var(--text-muted)] leading-normal font-sans transition-colors">
                  제주시 밀도 격차 대비 <strong className="text-[var(--text-title)] font-semibold font-sans">{imbalancePercent.toFixed(1)}%</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
