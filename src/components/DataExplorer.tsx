import React, { useState, useMemo } from "react";
import {
  Search,
  Building,
  Users,
  Theater,
  Grid,
  MapPin,
  Maximize2,
  X,
  Palette
} from "lucide-react";
import {
  jejuVenues,
  jejuCorporations,
  jejuArtGroups,
  jejuGalleries
} from "../data";

interface DataExplorerProps {
  selectedRegion: "제주시" | "서귀포시" | null;
  isDarkMode?: boolean;
}

export const DataExplorer: React.FC<DataExplorerProps> = ({ selectedRegion }) => {
  const [activeTab, setActiveTab] = useState<"venues" | "corporations" | "groups" | "galleries">("venues");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [itemType, setItemType] = useState<"venues" | "corporations" | "groups" | "galleries" | null>(null);

  // 탭별 행정구역 및 카테고리 필터 상태
  const [filterVenueRegion, setFilterVenueRegion] = useState<string>("all");
  const [filterVenueType, setFilterVenueType] = useState<string>("all");

  const [filterCorpRegion, setFilterCorpRegion] = useState<string>("all");
  const [filterCorpType, setFilterCorpType] = useState<string>("all");
  const [filterCorpCategory, setFilterCorpCategory] = useState<string>("all");

  const [filterGroupRegion, setFilterGroupRegion] = useState<string>("all");
  const [filterGroupCategory, setFilterGroupCategory] = useState<string>("all");

  const [filterGalleryRegion, setFilterGalleryRegion] = useState<string>("all");
  const [filterGalleryType, setFilterGalleryType] = useState<string>("all");
  const [filterGallerySpecialty, setFilterGallerySpecialty] = useState<string>("all");

  // 고유 카테고리/테마 동적 추출
  const corpCategories = useMemo(() => {
    return Array.from(new Set(jejuCorporations.map((c) => c.category)));
  }, []);

  const groupCategories = useMemo(() => {
    return Array.from(new Set(jejuArtGroups.map((g) => g.category)));
  }, []);

  const gallerySpecialties = useMemo(() => {
    return Array.from(new Set(jejuGalleries.map((g) => g.specialty)));
  }, []);

  // 1. 공연장 데이터 필터 및 검색
  const filteredVenues = useMemo(() => {
    return jejuVenues.filter((item) => {
      const matchRegion = filterVenueRegion === "all" || item.region === filterVenueRegion;
      const matchType = filterVenueType === "all" || item.type === filterVenueType;
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchRegion && matchType && matchSearch;
    });
  }, [filterVenueRegion, filterVenueType, searchQuery]);

  // 2. 문화예술법인 데이터 필터 및 검색
  const filteredCorporations = useMemo(() => {
    return jejuCorporations.filter((item) => {
      const matchRegion = filterCorpRegion === "all" || item.region === filterCorpRegion;
      const matchType = filterCorpType === "all" || item.type === filterCorpType;
      const matchCategory = filterCorpCategory === "all" || item.category === filterCorpCategory;
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchRegion && matchType && matchCategory && matchSearch;
    });
  }, [filterCorpRegion, filterCorpType, filterCorpCategory, searchQuery]);

  // 3. 예술단체 데이터 필터 및 검색
  const filteredGroups = useMemo(() => {
    return jejuArtGroups.filter((item) => {
      const matchRegion = filterGroupRegion === "all" || item.region === filterGroupRegion;
      const matchCategory = filterGroupCategory === "all" || item.category === filterGroupCategory;
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.addressCategory.toLowerCase().includes(searchQuery.toLowerCase());
      return matchRegion && matchCategory && matchSearch;
    });
  }, [filterGroupRegion, filterGroupCategory, searchQuery]);

  // 4. 미술관/갤러리 데이터 필터 및 검색
  const filteredGalleries = useMemo(() => {
    return jejuGalleries.filter((item) => {
      const matchRegion = filterGalleryRegion === "all" || item.region === filterGalleryRegion;
      const matchType = filterGalleryType === "all" || item.type === filterGalleryType;
      const matchSpecialty = filterGallerySpecialty === "all" || item.specialty === filterGallerySpecialty;
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.features.toLowerCase().includes(searchQuery.toLowerCase());
      return matchRegion && matchType && matchSpecialty && matchSearch;
    });
  }, [filterGalleryRegion, filterGalleryType, filterGallerySpecialty, searchQuery]);

  const handleRowClick = (item: any, type: "venues" | "corporations" | "groups" | "galleries") => {
    setSelectedItem(item);
    setItemType(type);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setItemType(null);
  };

  return (
    <div className="bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-2xl shadow-md overflow-hidden p-6 transition-colors">
      {/* 탭 헤더 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--panel-border)] pb-5 mb-6 transition-colors">
        <div>
          <h3 className="text-base sm:text-lg font-serif text-[var(--text-white-invert)] uppercase tracking-widest flex items-center gap-2 font-semibold transition-colors">
            <Grid className="w-4 h-4 text-[var(--text-title)]" />
            제주 예술생태계 데이터 디렉터리 검색
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1.5 font-sans transition-colors">
            제주 특별자치도 행정 단독/법인 단체 및 공연 인프라를 전수 해부하는 검색 엔진입니다.
          </p>
        </div>

        {/* 실시간 통합 검색바 */}
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3.5 top-3.5 w-3.5 h-3.5 text-[var(--text-muted-dark)]" />
          <input
            type="text"
            placeholder="공간명, 단체분야, 관서주소 통합 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded bg-[var(--subpanel-bg)] border border-[var(--panel-border)] text-sm text-[var(--text-white-invert)] placeholder-[var(--text-muted-dark)] focus:outline-none focus:ring-1 focus:ring-[var(--text-title)]/40 hover:border-[var(--text-title)]/30 transition-colors font-sans"
          />
        </div>
      </div>

      {/* 카테고리 셀렉터 탭 */}
      <div className="flex gap-2 p-1 bg-[var(--subpanel-bg)] border border-[var(--panel-border)] rounded mb-6 overflow-x-auto scroller-hidden transition-colors">
        <button
          onClick={() => { setActiveTab("venues"); setSearchQuery(""); }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase rounded whitespace-nowrap transition-all cursor-pointer font-sans border ${
            activeTab === "venues" ? "bg-[var(--panel-bg)] text-[var(--text-title)] border-[var(--text-title)]/30 shadow-sm" : "text-[var(--text-muted)] border-transparent hover:text-[var(--text-white-invert)]"
          }`}
        >
          <Theater className="w-3.5 h-3.5" />
          공연 장소 ({filteredVenues.length})
        </button>
        <button
          onClick={() => { setActiveTab("corporations"); setSearchQuery(""); }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase rounded whitespace-nowrap transition-all cursor-pointer font-sans border ${
            activeTab === "corporations" ? "bg-[var(--panel-bg)] text-[var(--text-title)] border-[var(--text-title)]/30 shadow-sm" : "text-[var(--text-muted)] border-transparent hover:text-[var(--text-white-invert)]"
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          예술 법인 ({filteredCorporations.length})
        </button>
        <button
          onClick={() => { setActiveTab("groups"); setSearchQuery(""); }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase rounded whitespace-nowrap transition-all cursor-pointer font-sans border ${
            activeTab === "groups" ? "bg-[var(--panel-bg)] text-[var(--text-title)] border-[var(--text-title)]/30 shadow-sm" : "text-[var(--text-muted)] border-transparent hover:text-[var(--text-white-invert)]"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          예술 단체 ({filteredGroups.length})
        </button>
        <button
          onClick={() => { setActiveTab("galleries"); setSearchQuery(""); }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase rounded whitespace-nowrap transition-all cursor-pointer font-sans border ${
            activeTab === "galleries" ? "bg-[var(--panel-bg)] text-[var(--text-title)] border-[var(--text-title)]/30 shadow-sm" : "text-[var(--text-muted)] border-transparent hover:text-[var(--text-white-invert)]"
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          화랑 / 미술구역 ({filteredGalleries.length})
        </button>
      </div>

      {/* 데이터 리스트 뷰 */}
      <div className="overflow-x-auto rounded border border-[var(--panel-border)] transition-colors">
        {/* 1. 공연장 탭 */}
        {activeTab === "venues" && (
          <table className="w-full text-left border-collapse font-sans">
            <thead>
              <tr className="bg-[var(--map-si-bg)] border-b border-[var(--panel-border)] text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider transition-colors">
                <th className="p-4">공연장명</th>
                <th className="p-4">
                  <div className="flex items-center gap-1.5">
                    <span>유형</span>
                    <select
                      value={filterVenueType}
                      onChange={(e) => setFilterVenueType(e.target.value)}
                      className="bg-[var(--panel-bg)] hover:bg-[var(--preset-btn-bg)] text-[var(--text-title)] border border-[var(--panel-border)] rounded px-2 py-1 text-[11px] font-semibold focus:outline-none cursor-pointer transition-colors"
                    >
                      <option value="all">전체</option>
                      <option value="공공">공공</option>
                      <option value="민간">민간</option>
                    </select>
                  </div>
                </th>
                <th className="p-4">
                  <div className="flex items-center gap-1.5">
                    <span>소재행정지</span>
                    <select
                      value={filterVenueRegion}
                      onChange={(e) => setFilterVenueRegion(e.target.value)}
                      className="bg-[var(--panel-bg)] hover:bg-[var(--preset-btn-bg)] text-[var(--text-title)] border border-[var(--panel-border)] rounded px-2 py-1 text-[11px] font-semibold focus:outline-none cursor-pointer transition-colors"
                    >
                      <option value="all">전체</option>
                      <option value="제주시">제주시</option>
                      <option value="서귀포시">서귀포시</option>
                    </select>
                  </div>
                </th>
                <th className="p-4">개관일자</th>
                <th className="p-4">규모 (좌석)</th>
                <th className="p-4 text-center">조회</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--panel-border)] text-[var(--app-text)] text-xs transition-colors">
              {filteredVenues.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[var(--text-muted-dark)]">지표 조건에 수렴하는 가용 공연 정보가 부재합니다.</td>
                </tr>
              ) : (
                filteredVenues.map((item) => (
                  <tr key={item.id} className="hover:bg-[var(--preset-btn-bg)]/30 transition-colors">
                    <td className="p-4 font-semibold text-[var(--text-white-invert)]">{item.name}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.type === "공공" ? "bg-[var(--text-title)]/10 text-[var(--text-title)] border border-[var(--text-title)]/30" : "bg-[var(--subpanel-bg)] text-[var(--text-muted)] border border-[var(--panel-border)]"}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="p-4">{item.region}</td>
                    <td className="p-4 text-[var(--text-muted-dark)]">{item.openedDate}</td>
                    <td className="p-4 font-mono font-medium">{item.seats ? `${item.seats.toLocaleString()}석` : "-"}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleRowClick(item, "venues")}
                        className="inline-flex items-center gap-1 text-xs text-[var(--text-title)] font-semibold hover:text-[var(--button-hover-bg)] transition-colors cursor-pointer"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        상세
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {/* 2. 문화예술법인 탭 */}
        {activeTab === "corporations" && (
          <table className="w-full text-left border-collapse font-sans">
            <thead>
              <tr className="bg-[var(--map-si-bg)] border-b border-[var(--panel-border)] text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider transition-colors">
                <th className="p-4">법인/재단명</th>
                <th className="p-4">
                  <div className="flex items-center gap-1.5">
                    <span>설립유형</span>
                    <select
                      value={filterCorpType}
                      onChange={(e) => setFilterCorpType(e.target.value)}
                      className="bg-[var(--panel-bg)] hover:bg-[var(--preset-btn-bg)] text-[var(--text-title)] border border-[var(--panel-border)] rounded px-2 py-1 text-[11px] font-semibold focus:outline-none cursor-pointer transition-colors"
                    >
                      <option value="all">전체</option>
                      <option value="사단법인">사단법인</option>
                      <option value="재단법인">재단법인</option>
                    </select>
                  </div>
                </th>
                <th className="p-4">
                  <div className="flex items-center gap-1.5">
                    <span>전문분야</span>
                    <select
                      value={filterCorpCategory}
                      onChange={(e) => setFilterCorpCategory(e.target.value)}
                      className="bg-[var(--panel-bg)] hover:bg-[var(--preset-btn-bg)] text-[var(--text-title)] border border-[var(--panel-border)] rounded px-2 py-1 text-[11px] font-semibold focus:outline-none cursor-pointer max-w-[110px]"
                    >
                      <option value="all">전체</option>
                      {corpCategories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </th>
                <th className="p-4">
                  <div className="flex items-center gap-1.5">
                    <span>소재지</span>
                    <select
                      value={filterCorpRegion}
                      onChange={(e) => setFilterCorpRegion(e.target.value)}
                      className="bg-[var(--panel-bg)] hover:bg-[var(--preset-btn-bg)] text-[var(--text-title)] border border-[var(--panel-border)] rounded px-2 py-1 text-[11px] font-semibold focus:outline-none cursor-pointer transition-colors"
                    >
                      <option value="all">전체</option>
                      <option value="제주시">제주시</option>
                      <option value="서귀포시">서귀포시</option>
                    </select>
                  </div>
                </th>
                <th className="p-4">설립일자</th>
                <th className="p-4 text-center">조회</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--panel-border)] text-[var(--app-text)] text-xs transition-colors">
              {filteredCorporations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[var(--text-muted-dark)]">등록된 문화예술 법인이 없습니다.</td>
                </tr>
              ) : (
                filteredCorporations.map((item) => (
                  <tr key={item.id} className="hover:bg-[var(--preset-btn-bg)]/30 transition-colors">
                    <td className="p-4 font-semibold text-[var(--text-white-invert)]">{item.name}</td>
                    <td className="p-4">{item.type}</td>
                    <td className="p-4 text-[var(--text-muted)]">{item.category}</td>
                    <td className="p-4">{item.region}</td>
                    <td className="p-4 text-[var(--text-muted-dark)]">{item.establishedDate}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleRowClick(item, "corporations")}
                        className="inline-flex items-center gap-1 text-xs text-[var(--text-title)] font-semibold hover:text-[var(--button-hover-bg)] transition-colors cursor-pointer"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        상세
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {/* 3. 예술단체 탭 */}
        {activeTab === "groups" && (
          <table className="w-full text-left border-collapse font-sans">
            <thead>
              <tr className="bg-[var(--map-si-bg)] border-b border-[var(--panel-border)] text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider transition-colors">
                <th className="p-4">예술단체명</th>
                <th className="p-4">
                  <div className="flex items-center gap-1.5">
                    <span>예술분야</span>
                    <select
                      value={filterGroupCategory}
                      onChange={(e) => setFilterGroupCategory(e.target.value)}
                      className="bg-[var(--panel-bg)] hover:bg-[var(--preset-btn-bg)] text-[var(--text-title)] border border-[var(--panel-border)] rounded px-2 py-1 text-[11px] font-semibold focus:outline-none cursor-pointer max-w-[110px]"
                    >
                      <option value="all">전체</option>
                      {groupCategories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </th>
                <th className="p-4">
                  <div className="flex items-center gap-1.5">
                    <span>소속행정구</span>
                    <select
                      value={filterGroupRegion}
                      onChange={(e) => setFilterGroupRegion(e.target.value)}
                      className="bg-[var(--panel-bg)] hover:bg-[var(--preset-btn-bg)] text-[var(--text-title)] border border-[var(--panel-border)] rounded px-2 py-1 text-[11px] font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="all">전체</option>
                      <option value="제주시">제주시</option>
                      <option value="서귀포시">서귀포시</option>
                    </select>
                  </div>
                </th>
                <th className="p-4">활동 행정구(동/읍/면)</th>
                <th className="p-4">창립 연월</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--panel-border)] text-[var(--app-text)] text-xs transition-colors">
              {filteredGroups.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[var(--text-muted-dark)]">등록된 가설 예술단체가 없습니다.</td>
                </tr>
              ) : (
                filteredGroups.map((item) => (
                  <tr key={item.id} className="hover:bg-[var(--preset-btn-bg)]/30 transition-colors">
                    <td className="p-4 font-semibold text-[var(--text-white-invert)]">{item.name}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-[var(--subpanel-bg)] text-[var(--text-muted)] border border-[var(--panel-border)] text-[10px] font-medium transition-colors">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4">{item.region}</td>
                    <td className="p-4 text-[var(--text-muted)]">{item.addressCategory}</td>
                    <td className="p-4 text-[var(--text-muted-dark)] font-mono">{item.establishedDate}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {/* 4. 갤러리/예술마을 탭 */}
        {activeTab === "galleries" && (
          <table className="w-full text-left border-collapse font-sans">
            <thead>
              <tr className="bg-[var(--map-si-bg)] border-b border-[var(--panel-border)] text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider transition-colors">
                <th className="p-4">갤러리/공간명</th>
                <th className="p-4">
                  <div className="flex items-center gap-1.5">
                    <span>공간 분류</span>
                    <select
                      value={filterGalleryType}
                      onChange={(e) => setFilterGalleryType(e.target.value)}
                      className="bg-[var(--panel-bg)] hover:bg-[var(--preset-btn-bg)] text-[var(--text-title)] border border-[var(--panel-border)] rounded px-2 py-1 text-[11px] font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="all">전체</option>
                      <option value="도립/시립">도립/시립</option>
                      <option value="사설">사설</option>
                      <option value="예술마을">예술마을</option>
                    </select>
                  </div>
                </th>
                <th className="p-4">
                  <div className="flex items-center gap-1.5">
                    <span>대표 테마</span>
                    <select
                      value={filterGallerySpecialty}
                      onChange={(e) => setFilterGallerySpecialty(e.target.value)}
                      className="bg-[var(--panel-bg)] hover:bg-[var(--preset-btn-bg)] text-[var(--text-title)] border border-[var(--panel-border)] rounded px-2 py-1 text-[11px] font-semibold focus:outline-none cursor-pointer max-w-[125px]"
                    >
                      <option value="all">전체</option>
                      {gallerySpecialties.map((spec) => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>
                </th>
                <th className="p-4">
                  <div className="flex items-center gap-1.5">
                    <span>행정 시</span>
                    <select
                      value={filterGalleryRegion}
                      onChange={(e) => setFilterGalleryRegion(e.target.value)}
                      className="bg-[var(--panel-bg)] hover:bg-[var(--preset-btn-bg)] text-[var(--text-title)] border border-[var(--panel-border)] rounded px-2 py-1 text-[11px] font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="all">전체</option>
                      <option value="제주시">제주시</option>
                      <option value="서귀포시">서귀포시</option>
                    </select>
                  </div>
                </th>
                <th className="p-4">주소</th>
                <th className="p-4 text-center">조회</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--panel-border)] text-[var(--app-text)] text-xs transition-colors">
              {filteredGalleries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[var(--text-muted-dark)]">등록된 유관 화랑시설이 없습니다.</td>
                </tr>
              ) : (
                filteredGalleries.map((item) => (
                  <tr key={item.id} className="hover:bg-[var(--preset-btn-bg)]/30 transition-colors">
                    <td className="p-4 font-semibold text-[var(--text-white-invert)]">{item.name}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#8e7a53]/10 text-[var(--text-muted)] border border-[#8e7a53]/30">
                        {item.type}
                      </span>
                    </td>
                    <td className="p-4 text-[var(--text-muted)]">{item.specialty}</td>
                    <td className="p-4">{item.region}</td>
                    <td className="p-4 text-[var(--text-muted-dark)] select-all">{item.address}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleRowClick(item, "galleries")}
                        className="inline-flex items-center gap-1 text-xs text-[var(--text-title)] font-semibold hover:text-[var(--button-hover-bg)] transition-colors cursor-pointer"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        상세
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* 상세 팝업 모달 */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[var(--panel-bg)] rounded-xl max-w-lg w-full overflow-hidden shadow-2xl border border-[var(--panel-border)] animate-slide-up">
            <div className="bg-[var(--subpanel-bg)] p-6 text-[var(--text-white-invert)] border-b border-[var(--panel-border)] relative transition-colors">
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-white-invert)] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="mb-2">
                <span className="text-xs font-serif font-bold tracking-wider uppercase border border-[var(--text-title)]/40 text-[var(--text-title)] px-2.5 py-1 rounded">
                  {itemType === "venues" ? "공연 무대" : itemType === "corporations" ? "문화 예술 법정기관" : "미술 화랑 영역 / 갤러리"}
                </span>
              </div>
              <h4 className="text-xl font-serif font-semibold text-[var(--text-white-invert)] mt-3 leading-snug uppercase tracking-wide transition-colors">{selectedItem.name}</h4>
              <p className="text-sm text-[var(--text-muted)] mt-1 select-all flex items-center gap-1.5 font-sans">
                <MapPin className="w-3.5 h-3.5 text-[var(--text-title)] flex-shrink-0" />
                {selectedItem.address}
              </p>
            </div>

            <div className="p-6 space-y-4">
              {/* 특장점 / 역할 설명 */}
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider block font-sans transition-colors">소개 및 주요 보존 가치</span>
                <p className="text-sm text-[var(--app-text)] leading-relaxed font-sans bg-[var(--subpanel-bg)] border border-[var(--panel-border)] p-3.5 rounded transition-colors">
                  {selectedItem.description || selectedItem.features || "제주 향양 유산 보존 및 가치 분산을 성실히 실현하는 종합 정점 기상 거소입니다."}
                </p>
              </div>

              {/* 기본 제원 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[var(--subpanel-bg)] p-3 rounded border border-[var(--panel-border)] transition-colors">
                  <span className="text-xs font-semibold text-[var(--text-muted)] block uppercase tracking-wide font-sans mt-0.5">소재지 구분</span>
                  <p className="text-sm font-semibold mt-0.5 font-sans text-[var(--text-white-invert)]">{selectedItem.region}</p>
                </div>

                {itemType === "venues" && (
                  <>
                    <div className="bg-[var(--subpanel-bg)] p-3 rounded border border-[var(--panel-border)] transition-colors">
                      <span className="text-xs font-semibold text-[var(--text-muted)] block uppercase tracking-wide font-sans mt-0.5">총 수용 좌석수</span>
                      <p className="text-sm font-bold text-[var(--text-title)] mt-0.5 font-mono">{selectedItem.seats ? `${selectedItem.seats.toLocaleString()}석` : "-"}</p>
                    </div>
                    <div className="bg-[var(--subpanel-bg)] p-3 rounded border border-[var(--panel-border)] transition-colors">
                      <span className="text-xs font-semibold text-[var(--text-muted)] block uppercase tracking-wide font-sans mt-0.5">정식 개관일</span>
                      <p className="text-sm font-semibold mt-0.5 font-sans text-[var(--text-white-invert)]">{selectedItem.openedDate}</p>
                    </div>
                    <div className="bg-[var(--subpanel-bg)] p-3 rounded border border-[var(--panel-border)] transition-colors">
                      <span className="text-xs font-semibold text-[var(--text-muted)] block uppercase tracking-wide font-sans mt-0.5">무대 대경 규모</span>
                      <p className="text-sm font-semibold mt-0.5 font-mono text-[var(--text-muted)]">{selectedItem.area ? `${selectedItem.area.toLocaleString()} m²` : "-"}</p>
                    </div>
                  </>
                )}

                {itemType === "corporations" && (
                  <>
                    <div className="bg-[var(--subpanel-bg)] p-3 rounded border border-[var(--panel-border)] transition-colors">
                      <span className="text-xs font-semibold text-[var(--text-muted)] block uppercase tracking-wide font-sans mt-0.5">전문 특화 장르</span>
                      <p className="text-sm font-semibold text-[var(--text-title)] mt-0.5 font-sans">{selectedItem.category}</p>
                    </div>
                    <div className="bg-[var(--subpanel-bg)] p-3 rounded border border-[var(--panel-border)] transition-colors">
                      <span className="text-xs font-semibold text-[var(--text-muted)] block uppercase tracking-wide font-sans mt-0.5">도정 설립 구인일</span>
                      <p className="text-sm font-semibold mt-0.5 font-mono text-[var(--text-white-invert)]">{selectedItem.establishedDate}</p>
                    </div>
                  </>
                )}

                {itemType === "galleries" && (
                  <>
                    <div className="bg-[var(--subpanel-bg)] p-3 rounded border border-[var(--panel-border)] transition-colors">
                      <span className="text-xs font-semibold text-[var(--text-muted)] block uppercase tracking-wide font-sans mt-0.5">화랑 주력 분과</span>
                      <p className="text-sm font-semibold text-[var(--text-title)] mt-0.5 font-sans">{selectedItem.specialty}</p>
                    </div>
                    <div className="bg-[var(--subpanel-bg)] p-3 rounded border border-[var(--panel-border)] transition-colors">
                      <span className="text-xs font-semibold text-[var(--text-muted)] block uppercase tracking-wide font-sans mt-0.5">공간 주력 성향</span>
                      <p className="text-sm font-semibold mt-0.5 font-sans text-[var(--text-white-invert)]">{selectedItem.type}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="bg-[var(--subpanel-bg)] px-6 py-4 border-t border-[var(--panel-border)] flex justify-end transition-colors">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 rounded text-xs font-semibold text-[var(--text-muted)] bg-[var(--panel-bg)] border border-[var(--panel-border)] hover:bg-[var(--preset-btn-bg)] transition-colors cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
