export interface PerformanceVenue {
  id: string;
  name: string;
  openedDate: string;
  address: string;
  type: "공공" | "민간";
  area: number; // m²
  seats: number; // 좌석수
  region: "제주시" | "서귀포시";
  description?: string;
}

export interface ArtCorporation {
  id: string;
  name: string;
  type: string;
  category: string;
  region: "제주시" | "서귀포시";
  address: string;
  establishedDate: string;
  description?: string;
}

export interface ArtGroup {
  id: string;
  name: string;
  category: "국악/전통" | "연극/공연" | "음악" | "문학" | "미술/사진" | "기타";
  region: "제주시" | "서귀포시";
  addressCategory: string; // 읍면동
  establishedDate: string;
}

export interface Gallery {
  id: string;
  name: string;
  type: "도립/시립" | "사설" | "예술마을";
  region: "제주시" | "서귀포시";
  specialty: string;
  address: string;
  features: string;
}

export interface RegionStats {
  region: "제주시" | "서귀포시";
  population: number; // 2026 기준 추정
  areaKm2: number; // 면적
  venuesCount: number;
  corporationsCount: number;
  groupsCount: number;
  galleriesCount: number;
}

export const jejuVenues: PerformanceVenue[] = [
  {
    id: "v1",
    name: "제주도예술문화회관 대극장 (제주문예회관)",
    openedDate: "1988-08-25",
    address: "제주특별자치도 제주시 동광로 69",
    type: "공공",
    area: 2992,
    seats: 828,
    region: "제주시",
    description: "제주 문화예술의 발상지이자 핵심 거점 대극장"
  },
  {
    id: "v2",
    name: "제주도예술문화회관 소극장 (제주문예회관)",
    openedDate: "1988-08-25",
    address: "제주특별자치도 제주시 동광로 69",
    type: "공공",
    area: 498,
    seats: 170,
    region: "제주시",
    description: "독창적이고 실험적인 무대를 위한 전용 소공연장"
  },
  {
    id: "v3",
    name: "제주아트센터",
    openedDate: "2010-05-18",
    address: "제주특별자치도 제주시 오남로 231",
    type: "공공",
    area: 9482,
    seats: 1184,
    region: "제주시",
    description: "대형 뮤지컬, 오케스트라, 콘서트가 가능한 최고 음향 설비 구비 대극장"
  },
  {
    id: "v4",
    name: "제주대학교 아라뮤즈홀",
    openedDate: "2007-11-06",
    address: "제주특별자치도 제주시 제주대학로 102",
    type: "공공",
    area: 2067,
    seats: 448,
    region: "제주시",
    description: "대학예술 교육과 대외 문화 교류의 중심 복합 연주홀"
  },
  {
    id: "v5",
    name: "설문대여성문화센터 공연장",
    openedDate: "2010-01-13",
    address: "제주특별자치도 제주시 선덕로8길 12",
    type: "공공",
    area: 2501,
    seats: 400,
    region: "제주시",
    description: "여성 문화예술 발전 및 도민 밀착형 복합 공연 시설"
  },
  {
    id: "v6",
    name: "한라아트홀",
    openedDate: "2001-09-11",
    address: "제주특별자치도 제주시 한라대학로 38",
    type: "민간",
    area: 8987,
    seats: 831,
    region: "제주시",
    description: "제주한라대학교 연구 및 대규모 다목적 예술 인프라"
  },
  {
    id: "v7",
    name: "서귀포예술의전당 대극장",
    openedDate: "2014-06-19",
    address: "제주특별자치도 서귀포시 태평로 270",
    type: "공공",
    area: 5434,
    seats: 802,
    region: "서귀포시",
    description: "서귀포 남부권의 고품격 종합 문화예술 생산 기지"
  },
  {
    id: "v8",
    name: "서귀포예술의전당 소극장",
    openedDate: "2014-06-19",
    address: "제주특별자치도 서귀포시 태평로 270",
    type: "공공",
    area: 1200,
    seats: 190,
    region: "서귀포시",
    description: "서귀포 예술 단체 및 창작 지원을 위한 아담한 실내소극장"
  },
  {
    id: "v9",
    name: "서귀포관광극장",
    openedDate: "2014-04-24",
    address: "제주특별자치도 서귀포시 이중섭로 18-2",
    type: "민간",
    area: 370,
    seats: 99,
    region: "서귀포시",
    description: "옛 극장을 재생하여 노천 공연장으로 운영 중인 로컬 복합 문화공간"
  },
  {
    id: "v10",
    name: "성산구립공연장 (아트홀)",
    openedDate: "2017-08-22",
    address: "제주특별자치도 서귀포시 성산읍 일주동로 4194",
    type: "공공",
    area: 1195,
    seats: 500,
    region: "서귀포시",
    description: "서귀포 동부지역 도민들의 밀접한 문화 수요를 채우는 인프라"
  }
];

export const jejuCorporations: ArtCorporation[] = [
  {
    id: "c1",
    name: "사단법인 제주국제문화예술교류협회",
    type: "사단법인",
    category: "문화예술교류",
    region: "제주시",
    address: "제주시 연동 837-20",
    establishedDate: "2018-02-28",
    description: "제주 문화예술 콘텐츠의 다자간 해외 교류 촉진"
  },
  {
    id: "c2",
    name: "사단법인 제주문화예술연구소",
    type: "사단법인",
    category: "연구/조사",
    region: "제주시",
    address: "제주시 한림읍 일주서로 5130",
    establishedDate: "2016-12-27",
    description: "제주 고유의 예술 생태계 조사 및 평론 활동 기반 마련"
  },
  {
    id: "c3",
    name: "사단법인 한국청소년영화협회 제주지회",
    type: "사단법인",
    category: "영화/미디어",
    region: "제주시",
    address: "제주시 아라동 3012",
    establishedDate: "2019-09-26",
    description: "미래 소수 영화창작자 및 청소년 대상 시각예술 포럼 운영"
  },
  {
    id: "c4",
    name: "사단법인 제주해녀문화보존회",
    type: "사단법인",
    category: "무형문화보존",
    region: "제주시",
    address: "제주시 구좌읍 해맞이해안로 1398",
    establishedDate: "2014-04-21",
    description: "유네스코 등재 제주 해녀 생활 예술 및 민속학적 전수 활동 보존"
  },
  {
    id: "c5",
    name: "재단법인 제주문화예술재단",
    type: "재단법인",
    category: "문화진흥공공기금",
    region: "제주시",
    address: "제주시 삼도이동 1262",
    establishedDate: "2000-12-30",
    description: "제주도 문화창작 지원, 인력 육성, 예술 생태계 활성화를 총괄하는 도 출연 기관"
  },
  {
    id: "c6",
    name: "재단법인 서귀포시교육발전기금",
    type: "재단법인",
    category: "교육/문화",
    region: "서귀포시",
    address: "서귀포시 중앙로 161",
    establishedDate: "2006-12-28",
    description: "서귀포 관내 소외지역 청소년 문화예술 복지 및 예술교실 지원"
  }
];

export const jejuArtGroups: ArtGroup[] = [
  // 제주시 단체
  { id: "g1", name: "제주빌레앙상블", category: "음악", region: "제주시", addressCategory: "노형동", establishedDate: "2009-01-21" },
  { id: "g2", name: "극단 세이레", category: "연극/공연", region: "제주시", addressCategory: "이도이동", establishedDate: "1992-06-15" },
  { id: "g3", name: "제주민예총", category: "기타", region: "제주시", addressCategory: "삼도이동", establishedDate: "1994-12-06" },
  { id: "g4", name: "자작나무숲 음악단", category: "음악", region: "제주시", addressCategory: "아라동", establishedDate: "2002-07-22" },
  { id: "g5", name: "현악앙상블 다우", category: "음악", region: "제주시", addressCategory: "연동", establishedDate: "2011-07-12" },
  { id: "g6", name: "제주전통예술단 해녀무", category: "국악/전통", region: "제주시", addressCategory: "구좌읍", establishedDate: "2010-05-03" },
  { id: "g7", name: "제주카메라클럽", category: "미술/사진", region: "제주시", addressCategory: "일도이동", establishedDate: "1998-12-10" },
  { id: "g8", name: "제주문인협회", category: "문학", region: "제주시", addressCategory: "삼도일동", establishedDate: "1966-07-22" },
  { id: "g9", name: "제주미술협회", category: "미술/사진", region: "제주시", addressCategory: "이도이동", establishedDate: "1966-07-04" },
  // 서귀포시 단체
  { id: "g10", name: "서귀포관악단", category: "음악", region: "서귀포시", addressCategory: "서홍동", establishedDate: "2007-05-04" },
  { id: "g11", name: "한라심포니", category: "음악", region: "서귀포시", addressCategory: "동홍동", establishedDate: "2011-03-09" },
  { id: "g12", name: "서귀포문화원 소리패", category: "국악/전통", region: "서귀포시", addressCategory: "서호동", establishedDate: "2008-12-04" },
  { id: "g13", name: "극단 자작나무 서귀포", category: "연극/공연", region: "서귀포시", addressCategory: "대정읍", establishedDate: "2015-10-19" },
  { id: "g14", name: "남원읍 생활예술동아리", category: "기타", region: "서귀포시", addressCategory: "남원읍", establishedDate: "2018-06-01" },
  { id: "g15", name: "성산일출 시조창회", category: "국악/전통", region: "서귀포시", addressCategory: "성산읍", establishedDate: "2013-05-10" }
];

export const jejuGalleries: Gallery[] = [
  {
    id: "ga1",
    name: "제주도립미술관",
    type: "도립/시립",
    region: "제주시",
    specialty: "현대미술/제주예술",
    address: "제주시 1100로 2894-78",
    features: "제주 고유의 풍광과 철학을 대표하는 도립 미술 거점"
  },
  {
    id: "ga2",
    name: "제주현대미술관",
    type: "도립/시립",
    region: "제주시",
    specialty: "실험예술/창작가협업",
    address: "제주시 한경면 저지12길 35",
    features: "세계적인 거장들의 영감을 담아낸 친환경 전시공간"
  },
  {
    id: "ga3",
    name: "저지문화예술인마을",
    type: "예술마을",
    region: "제주시",
    specialty: "종합예술/창작공동체",
    address: "제주시 한경면 저지리 일대",
    features: "예술가 40여 가구가 모여 자연과 예술을 융합하는 아뜰리에 벨트"
  },
  {
    id: "ga4",
    name: "이중섭미술관",
    type: "도립/시립",
    region: "서귀포시",
    specialty: "이중섭 화가 일대기 및 서향미술",
    address: "서귀포시 이중섭로 27-3",
    features: "화가 이중섭이 머물던 피난시절 생가를 중심으로 설립된 문화거리의 랜드마크"
  },
  {
    id: "ga5",
    name: "기당미술관",
    type: "도립/시립",
    region: "서귀포시",
    specialty: "공익 상설전시 및 정형 미술",
    address: "서귀포시 남성중로153번길 15",
    features: "국내 최초의 시립미술관으로서 자연채광이 매력적인 전통적 디자인 공간"
  },
  {
    id: "ga6",
    name: "소암기념관",
    type: "도립/시립",
    region: "서귀포시",
    specialty: "조소/서예/한문서향",
    address: "서귀포시 소암로 15",
    features: "서예의 거장 소암 현중화 선생의 삶과 필묵 예술을 기리는 공간"
  },
  {
    id: "ga7",
    name: "김영갑갤러리 두모악",
    type: "사설",
    region: "서귀포시",
    specialty: "제주 오름/바람 사진전",
    address: "서귀포시 성산읍 삼달로 137",
    features: "폐교를 재생하여 평생 제주의 자연만을 카메라에 담은 故 김영갑 작가의 혼이 깃든 장물"
  },
  {
    id: "ga8",
    name: "유동룡미술관 (이타미 준 미술관)",
    type: "사설",
    region: "서귀포시",
    specialty: "건축예술/디자인",
    address: "서귀포시 안덕면 한창로 86",
    features: "세계적 재일동포 건축가 이타미 준의 바람, 돌, 흙 동화적 가치 보전 투어"
  }
];

// 종합 인구 및 지표 통계 (2026 추정 지표)
export const jejuRegionStats: RegionStats[] = [
  {
    region: "제주시",
    population: 494500, // 약 50만
    areaKm2: 978.6,
    venuesCount: 24, // 실제 전체 추계치 적용
    corporationsCount: 54,
    groupsCount: 120,
    galleriesCount: 32
  },
  {
    region: "서귀포시",
    population: 191300, // 약 19만
    areaKm2: 871.3,
    venuesCount: 12,
    corporationsCount: 22,
    groupsCount: 48,
    galleriesCount: 21
  }
];

// 연도별 문화예술 단체 활성 추이
export const yearlyTrends = [
  { year: "2021", 제주시: 154, 서귀포시: 78 },
  { year: "2022", 제주시: 172, 서귀포시: 84 },
  { year: "2023", 제주시: 195, 서귀포시: 93 },
  { year: "2024", 제주시: 210, 서귀포시: 99 },
  { year: "2025", 제주시: 224, 서귀포시: 101 },
  { year: "2026", 제주시: 230, 서귀포시: 103 } // Current Year
];
