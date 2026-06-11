import { useState, useMemo, useEffect } from "react";
import {
  Landmark,
  Sliders,
  Scale,
  Sparkles,
  Users,
  Building,
  Theater,
  Briefcase,
  Layers,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  Layers3,
  HelpCircle,
  Sun,
  Moon
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { jejuRegionStats, yearlyTrends } from "./data";
import { JejuMap } from "./components/JejuMap";
import { DataExplorer } from "./components/DataExplorer";
import { AiAnalysis } from "./components/AiAnalysis";

// 고대비 프리미엄 차트 범례 레벨 가독성 보강
const renderLegendText = (value: string) => {
  return (
    <span className="text-xs font-semibold text-[var(--text-muted)] font-sans tracking-wide ml-1.5 mr-3">
      {value}
    </span>
  );
};

export default function App() {
  // 0. Dark/Light 모드 상태 관리
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // 1. 가중치 상태 관리
  const [corpWeight, setCorpWeight] = useState<number>(1.2);
  const [groupWeight, setGroupWeight] = useState<number>(1.0);
  const [venueWeight, setVenueWeight] = useState<number>(2.0);
  const [galleryWeight, setGalleryWeight] = useState<number>(1.5);

  // 2. 선택된 행정지역 ("제주시" | "서귀포시" | null)
  const [selectedRegion, setSelectedRegion] = useState<"제주시" | "서귀포시" | null>(null);

  // HTML 루트 태그와 테마 동기화 처리
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }, [isDarkMode]);

  // 3. 지표 데이터 산출 및 계산
  const scores = useMemo(() => {
    const data: Record<
      "제주시" | "서귀포시",
      { total: number; perCapita: number; venues: number; corps: number; groups: number; galleries: number }
    > = {
      "제주시": { total: 0, perCapita: 0, venues: 0, corps: 0, groups: 0, galleries: 0 },
      "서귀포시": { total: 0, perCapita: 0, venues: 0, corps: 0, groups: 0, galleries: 0 }
    };

    jejuRegionStats.forEach((stat) => {
      const region = stat.region;
      const weightedScore =
        stat.venuesCount * venueWeight +
        stat.corporationsCount * corpWeight +
        stat.groupsCount * groupWeight +
        stat.galleriesCount * galleryWeight;

      // 인구 1만 명당 지수 산출
      const perCapita = (weightedScore / stat.population) * 10000;

      data[region] = {
        total: weightedScore,
        perCapita: perCapita,
        venues: stat.venuesCount * venueWeight,
        corps: stat.corporationsCount * corpWeight,
        groups: stat.groupsCount * groupWeight,
        galleries: stat.galleriesCount * galleryWeight
      };
    });

    return data;
  }, [corpWeight, groupWeight, venueWeight, galleryWeight]);

  // 차트 가공용 데이터
  const comparisonChartData = useMemo(() => {
    return jejuRegionStats.map((stat) => ({
      name: stat.region,
      "공연장 수": stat.venuesCount,
      "법인 수": stat.corporationsCount,
      "예술단체 수": stat.groupsCount,
      "갤러리 수": stat.galleriesCount
    }));
  }, []);

  const scoreBreakdownChartData = useMemo(() => {
    return [
      {
        name: "제주시",
        "공연장 점수": Number(scores["제주시"].venues.toFixed(1)),
        "법인 점수": Number(scores["제주시"].corps.toFixed(1)),
        "예술단체 점수": Number(scores["제주시"].groups.toFixed(1)),
        "갤러리 점수": Number(scores["제주시"].galleries.toFixed(1))
      },
      {
        name: "서귀포시",
        "공연장 점수": Number(scores["서귀포시"].venues.toFixed(1)),
        "법인 점수": Number(scores["서귀포시"].corps.toFixed(1)),
        "예술단체 점수": Number(scores["서귀포시"].groups.toFixed(1)),
        "갤러리 점수": Number(scores["서귀포시"].galleries.toFixed(1))
      }
    ];
  }, [scores]);

  const changePreset = (type: "balanced" | "facility" | "support") => {
    if (type === "balanced") {
      setCorpWeight(1.0);
      setGroupWeight(1.0);
      setVenueWeight(1.0);
      setGalleryWeight(1.0);
    } else if (type === "facility") {
      setCorpWeight(0.5);
      setGroupWeight(0.5);
      setVenueWeight(2.5);
      setGalleryWeight(2.0);
    } else if (type === "support") {
      setCorpWeight(2.0);
      setGroupWeight(2.5);
      setVenueWeight(0.8);
      setGalleryWeight(1.0);
    }
  };

  // 불균형 지수 (서귀포와 제주시의 밀도 격차)
  const imbalancePercent = useMemo(() => {
    const scRatio = (scores["서귀포시"].perCapita / (scores["제주시"].perCapita || 1)) * 100;
    return scRatio;
  }, [scores]);

  return (
    <div className={`${isDarkMode ? "" : "light"} min-h-screen bg-[var(--app-bg)] font-sans text-[var(--app-text)] antialiased p-3 sm:p-6 lg:p-8 select-none transition-colors duration-200`}>
      {/* 바디 맥스 컨테이너 */}
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-fade-in">
        {/* 헤더 섹션 */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-2xl p-6 sm:p-8 shadow-md transition-colors duration-200">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-serif text-[var(--text-title)] tracking-wide leading-tight font-bold transition-colors">
              제주 예술생태계 지수
            </h1>
            <p className="text-sm text-[var(--text-muted)] font-medium tracking-wider mt-2 font-sans transition-colors">
              제주 예술생태계 지수 및 지역 불균형 정량 분석 플랫폼
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* 다크/라이트모드 토글 버튼 */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 bg-[var(--subpanel-bg)] hover:bg-[var(--preset-btn-bg)] border border-[var(--panel-border)] rounded-xl text-[var(--text-title)] transition-all duration-200 shadow-sm flex items-center justify-center cursor-pointer"
              aria-label="Toggle Dark/Light Mode"
              title={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="bg-[var(--subpanel-bg)] border border-[var(--panel-border)] px-4 py-2.5 rounded flex flex-col items-center transition-colors">
              <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-medium">기준 연도</span>
              <span className="text-base font-sans font-semibold text-[var(--text-title)] mt-0.5 transition-colors">2026년 기준</span>
            </div>
            <div className="bg-[var(--subpanel-bg)] border border-[var(--panel-border)] px-4 py-2.5 rounded flex flex-col items-center transition-colors">
              <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-medium">제주 총 인구</span>
              <span className="text-base font-sans font-semibold text-[var(--text-white-invert)] mt-0.5 transition-colors">685,800 명</span>
            </div>
          </div>
        </header>

        {/* 중단 메인 제어반 & 맵 오버레이 */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 가중치 제어반 좌측 패널 (4 cols) */}
          <div className="lg:col-span-4 flex flex-col bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-2xl p-6 shadow-md gap-6 transition-colors">
            <div>
              <h3 className="text-sm sm:text-base font-serif text-[var(--text-white-invert)] uppercase tracking-wider flex items-center gap-2 font-semibold">
                <Sliders className="w-4 h-4 text-[var(--text-title)]" />
                생태계 평가 지표 가중치 설계
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] font-sans mt-2 leading-relaxed">
                각 인프라 요소별 가중 점수를 조절하면 정량 활성화 총합 지수가 실시간 피드백 연산됩니다.
              </p>
            </div>

            {/* 프리셋 셀렉터 */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[var(--text-muted)] font-sans uppercase tracking-widest block">분석 정책 최적 프리셋</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => changePreset("balanced")}
                  className="px-2 py-2 text-xs font-semibold rounded border border-[var(--panel-border)] text-[var(--text-muted)] bg-[var(--preset-btn-bg)] hover:bg-[var(--text-title)] hover:text-[var(--app-bg)] hover:border-transparent transition-all text-center uppercase font-sans cursor-pointer"
                >
                  균등 평가
                </button>
                <button
                  onClick={() => changePreset("facility")}
                  className="px-2 py-2 text-xs font-semibold rounded border border-[var(--panel-border)] text-[var(--text-muted)] bg-[var(--preset-btn-bg)] hover:bg-[var(--text-title)] hover:text-[var(--app-bg)] hover:border-transparent transition-all text-center uppercase font-sans cursor-pointer"
                >
                  시설 중심
                </button>
                <button
                  onClick={() => changePreset("support")}
                  className="px-2 py-2 text-xs font-semibold rounded border border-[var(--panel-border)] text-[var(--text-muted)] bg-[var(--preset-btn-bg)] hover:bg-[var(--text-title)] hover:text-[var(--app-bg)] hover:border-transparent transition-all text-center uppercase font-sans cursor-pointer"
                >
                  학회/법인 중심
                </button>
              </div>
            </div>

            {/* 슬라이더 목록 */}
            <div className="space-y-4">
              {/* 1. 공연장 가중치 */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs sm:text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide flex items-center gap-1.5 font-sans">
                    <Theater className="w-3.5 h-3.5 text-[var(--icon-purple)]" />
                    공연장 수 가중치
                  </label>
                  <span className="text-xs font-mono font-bold text-[var(--text-title)] bg-[var(--subpanel-bg)] border border-[var(--panel-border)] px-2.5 py-0.5 rounded-md transition-colors">
                    {venueWeight.toFixed(1)}x
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={venueWeight}
                  onChange={(e) => setVenueWeight(parseFloat(e.target.value))}
                  className="w-full h-1 bg-[var(--panel-border)] rounded-lg cursor-pointer transition-colors"
                />
              </div>

              {/* 2. 갤러리/미술관 가중치 */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs sm:text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide flex items-center gap-1.5 font-sans">
                    <Layers3 className="w-3.5 h-3.5 text-[var(--icon-amber)]" />
                    갤러리 / 예술마을
                  </label>
                  <span className="text-xs font-mono font-bold text-[var(--text-title)] bg-[var(--subpanel-bg)] border border-[var(--panel-border)] px-2.5 py-0.5 rounded-md transition-colors">
                    {galleryWeight.toFixed(1)}x
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={galleryWeight}
                  onChange={(e) => setGalleryWeight(parseFloat(e.target.value))}
                  className="w-full h-1 bg-[var(--panel-border)] rounded-lg cursor-pointer transition-colors"
                />
              </div>

              {/* 3. 문화예술 법인 가중치 */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs sm:text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide flex items-center gap-1.5 font-sans">
                    <Building className="w-3.5 h-3.5 text-[var(--icon-blue)]" />
                    문화예술법인 가중치
                  </label>
                  <span className="text-xs font-mono font-bold text-[var(--text-title)] bg-[var(--subpanel-bg)] border border-[var(--panel-border)] px-2.5 py-0.5 rounded-md transition-colors">
                    {corpWeight.toFixed(1)}x
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={corpWeight}
                  onChange={(e) => setCorpWeight(parseFloat(e.target.value))}
                  className="w-full h-1 bg-[var(--panel-border)] rounded-lg cursor-pointer transition-colors"
                />
              </div>

              {/* 4. 예술단체 가중치 */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs sm:text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide flex items-center gap-1.5 font-sans">
                    <Users className="w-3.5 h-3.5 text-[var(--icon-emerald)]" />
                    예술단체 가중치
                  </label>
                  <span className="text-xs font-mono font-bold text-[var(--text-title)] bg-[var(--subpanel-bg)] border border-[var(--panel-border)] px-2.5 py-0.5 rounded-md transition-colors">
                    {groupWeight.toFixed(1)}x
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={groupWeight}
                  onChange={(e) => setGroupWeight(parseFloat(e.target.value))}
                  className="w-full h-1 bg-[var(--panel-border)] rounded-lg cursor-pointer transition-colors"
                />
              </div>
            </div>

            {/* 수치 격차 경고 / 안내문 */}
            <div className="bg-[var(--subpanel-bg)] border border-[var(--panel-border)] p-4 rounded-xl mt-auto transition-colors">
              <h4 className="text-sm font-serif text-[var(--text-title)] font-semibold flex items-center gap-1.5 uppercase tracking-wide">
                <Scale className="w-4 h-4" />
                지형적 인프라 불균형 진단 요양
              </h4>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] font-sans leading-relaxed mt-2">
                제주시는 인구수에 비례하여 법인과 단체 수에서 압도적으로 큰 비중을 가지지만, <strong className="text-[var(--text-title)] font-semibold font-sans">인구 대비 향유 밀도</strong> 기준으로는 서귀포시가 갤러리와 관광극장 등 특화 거점을 다수 보유하여 대등한 저력을 증명하고 있습니다.
              </p>
            </div>
          </div>

          {/* 지형도 우측 패널 (8 cols) */}
          <div className="lg:col-span-8">
            <JejuMap selectedRegion={selectedRegion} onSelectRegion={setSelectedRegion} scores={scores} isDarkMode={isDarkMode} />
          </div>
        </section>

        {/* 하단 차트 위젯 그리드 */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 가중치 적용 점수 기여도 컴포넌트 */}
          <div className="bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-2xl p-6 shadow-md flex flex-col h-[380px] transition-colors">
            <div>
              <h3 className="text-sm sm:text-base font-serif text-[var(--text-white-invert)] uppercase tracking-widest flex items-center gap-2 font-semibold transition-colors">
                <Layers className="w-4 h-4 text-[var(--text-title)]" />
                지역별 예술 지표 세부 기여도
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] font-sans uppercase mt-1.5 transition-colors">사용자 설정 가중치가 반영된 지역별 누적 기여도 연산입니다.</p>
            </div>
            <div className="flex-1 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreBreakdownChartData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#2d2d2d" : "#dfd9cc"} />
                  <XAxis dataKey="name" stroke={isDarkMode ? "#6b7280" : "#968e7f"} fontSize={11} tickLine={false} />
                  <YAxis stroke={isDarkMode ? "#6b7280" : "#968e7f"} fontSize={11} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      background: isDarkMode ? "#141416" : "#ffffff",
                      border: isDarkMode ? "1px solid #2d2d2d" : "1px solid #dfd9cc",
                      borderRadius: "12px",
                      color: isDarkMode ? "#e0e0e0" : "#1c1a17",
                      fontSize: "12px",
                      fontFamily: "Inter, sans-serif"
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" formatter={renderLegendText} />
                  <Bar dataKey="공연장 점수" stackId="a" fill="var(--chart-1)" name="공연장 스코어" />
                  <Bar dataKey="갤러리 점수" stackId="a" fill="var(--chart-2)" name="갤러리 스코어" />
                  <Bar dataKey="법인 점수" stackId="a" fill="var(--chart-3)" name="법인 스코어" />
                  <Bar dataKey="예술단체 점수" stackId="a" fill="var(--chart-4)" name="예술단체 스코어" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 인프라 기본 총량 비교 컴포넌트 */}
          <div className="bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-2xl p-6 shadow-md flex flex-col h-[380px] transition-colors">
            <div>
              <h3 className="text-sm sm:text-base font-serif text-[var(--text-white-invert)] uppercase tracking-widest flex items-center gap-2 font-semibold transition-colors">
                <Scale className="w-4 h-4 text-[var(--text-muted)]" />
                인프라 기본 보유량 비교
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] font-sans uppercase mt-1.5 transition-colors">가중치가 고정된 자치단체 보유 정량 데이터 지형 비교입니다.</p>
            </div>
            <div className="flex-1 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonChartData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#2d2d2d" : "#dfd9cc"} />
                  <XAxis dataKey="name" stroke={isDarkMode ? "#6b7280" : "#968e7f"} fontSize={11} tickLine={false} />
                  <YAxis stroke={isDarkMode ? "#6b7280" : "#968e7f"} fontSize={11} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      background: isDarkMode ? "#141416" : "#ffffff",
                      border: isDarkMode ? "1px solid #2d2d2d" : "1px solid #dfd9cc",
                      borderRadius: "12px",
                      color: isDarkMode ? "#e0e0e0" : "#1c1a17",
                      fontSize: "12px",
                      fontFamily: "Inter, sans-serif"
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" formatter={renderLegendText} />
                  <Bar dataKey="공연장 수" fill="var(--chart-1)" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="갤러리 수" fill="var(--chart-2)" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="법인 수" fill="var(--chart-3)" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="예술단체 수" fill="var(--chart-4)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* 연도별 단체 증가 세그먼트 (보강 데이터 분석) */}
        <section className="bg-[var(--panel-bg)] border border-[var(--panel-border)] p-6 rounded-2xl shadow-md transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--panel-border)] pb-4 mb-4 transition-colors">
            <div>
              <h3 className="text-sm sm:text-base font-serif text-[var(--text-white-invert)] uppercase tracking-widest flex items-center gap-2 font-semibold transition-colors">
                <TrendingUp className="w-4 h-4 text-[var(--text-title)]" />
                연도별 누적 예술단체 성장 추이
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] font-sans uppercase mt-1.5 transition-colors">2021년부터 현재까지 등록된 예술 단체의 연도별 우상향 추세선입니다.</p>
            </div>
            <span className="text-xs font-sans font-semibold bg-[var(--subpanel-bg)] border border-[var(--panel-border)] text-[var(--text-title)] px-3 py-1.5 rounded self-start sm:self-center transition-colors">
              평균 성장속도: 제주시 +8.1%, 서귀포시 +5.7%
            </span>
          </div>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yearlyTrends} margin={{ top: 10, right: 20, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#2d2d2d" : "#dfd9cc"} />
                <XAxis dataKey="year" stroke={isDarkMode ? "#6b7280" : "#968e7f"} fontSize={11} tickLine={false} />
                <YAxis stroke={isDarkMode ? "#6b7280" : "#968e7f"} fontSize={11} tickLine={false} />
                <Tooltip
                  cursor={{ stroke: isDarkMode ? '#2d2d2d' : '#dfd9cc', strokeWidth: 1 }}
                  contentStyle={{
                    background: isDarkMode ? "#141416" : "#ffffff",
                    border: isDarkMode ? "1px solid #2d2d2d" : "1px solid #dfd9cc",
                    borderRadius: "12px",
                    color: isDarkMode ? "#e0e0e0" : "#1c1a17",
                    fontSize: "12px",
                    fontFamily: "Inter, sans-serif"
                  }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" formatter={renderLegendText} />
                <Line type="monotone" dataKey="제주시" stroke="var(--chart-line-1)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="서귀포시" stroke="var(--chart-line-2)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* 제주 문화 보존 지도 검색 패널 */}
        <section id="data-explorer-panel">
          <DataExplorer selectedRegion={selectedRegion} isDarkMode={isDarkMode} />
        </section>

        {/* AI 심층 분석 패널 세그먼트 */}
        <section id="ai-analysis-panel">
          <AiAnalysis weights={{ corpWeight, groupWeight, venueWeight, galleryWeight }} scores={scores} isDarkMode={isDarkMode} />
        </section>

        {/* 푸터 영역 */}
        <footer className="text-center text-[var(--text-muted)] text-[10px] uppercase tracking-wider py-8 border-t border-[var(--panel-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
          <p>© 2026 제주 예술생태계 지수 분석 시스템. 모든 권리 보유.</p>
          <div className="flex gap-4 self-center justify-center">
            <a href="#ai-analysis-panel" className="hover:text-[var(--text-title)] transition-colors">AI SWOT 분석 보고서</a>
            <a href="#data-explorer-panel" className="hover:text-[var(--text-title)] transition-colors">예술 인프라 정보 탐색기</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
