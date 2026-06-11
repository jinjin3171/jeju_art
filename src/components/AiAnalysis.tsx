import React, { useState } from "react";
import Markdown from "react-markdown";
import { Sparkles, BrainCircuit, Loader2, AlertCircle, FileText } from "lucide-react";

interface AiAnalysisProps {
  weights: {
    corpWeight: number;
    groupWeight: number;
    venueWeight: number;
    galleryWeight: number;
  };
  scores: {
    "제주시": { total: number; perCapita: number; venues: number; corps: number; groups: number; galleries: number };
    "서귀포시": { total: number; perCapita: number; venues: number; corps: number; groups: number; galleries: number };
  };
  isDarkMode?: boolean;
}

export const AiAnalysis: React.FC<AiAnalysisProps> = ({ weights, scores }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const triggerAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          weights,
          jejuSiScore: scores["제주시"].total.toFixed(1),
          seogwipoSiScore: scores["서귀포시"].total.toFixed(1),
          jejuSiPerCapita: scores["제주시"].perCapita.toFixed(1),
          seogwipoSiPerCapita: scores["서귀포시"].perCapita.toFixed(1)
        })
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || "AI 분석 생성 중 예기치 않은 오류가 발생했습니다.");
      }
      setAnalysis(data.analysis);
      setIsExpanded(true); // Automatically expand when new analysis loads
    } catch (e: any) {
      console.error(e);
      setError(e.message || "서버와 연결할 수 없거나 API 키가 설정되지 않았습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-2xl p-6 md:p-8 shadow-md relative overflow-hidden transition-colors">
      {/* 백그라운드 디자인 그라데이션 */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-[var(--text-title)]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-[var(--text-title)]/3 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10 font-sans">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[var(--subpanel-bg)]/80 text-[var(--text-title)] text-xs font-semibold rounded border border-[var(--text-title)]/40 tracking-wider uppercase mb-3 transition-colors">
            <Sparkles className="w-3 h-3" />
            Gemini 심층 정밀 진단
          </div>
          <h3 className="text-xl sm:text-2xl font-serif text-[var(--text-title)] mt-1 font-semibold tracking-wide uppercase transition-colors">
            제주 예술생태계 SWOT 분석 및 거시적 정책 권고안
          </h3>
          <p className="text-[var(--text-muted)] text-xs sm:text-sm mt-3 leading-relaxed transition-colors">
            현재 셋팅된 가중 보정률({weights.corpWeight}x, {weights.groupWeight}x, {weights.venueWeight}x, {weights.galleryWeight}x)과 정량 데이터 격차를 대조하여, 지역 예술생태계 건강도 분류 진단 및 격차 극복 AI 마스터플랜을 출력합니다.
          </p>
        </div>

        <div className="flex-shrink-0">
          <button
            onClick={triggerAnalysis}
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-4 bg-[var(--text-title)] hover:bg-[var(--button-hover-bg)] disabled:opacity-50 text-black font-semibold text-xs sm:text-sm rounded transition-all duration-200 uppercase tracking-widest cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                성장 리포트 분석 중...
              </>
            ) : (
              <>
                <BrainCircuit className="w-4 h-4 text-black" />
                전략 리포트 보고서 생성
              </>
            )}
          </button>
        </div>
      </div>

      {loading && (
        <div className="mt-8 flex flex-col items-center justify-center py-16 bg-[var(--subpanel-bg)]/80 border border-[var(--panel-border)] rounded-xl backdrop-blur-sm transition-colors">
          <Loader2 className="w-8 h-8 text-[var(--text-title)] animate-spin mb-4 transition-colors" />
          <p className="text-[var(--app-text)] font-bold text-sm sm:text-base font-sans transition-colors">제주 인구 및 정량 예술밀도 합성 중...</p>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-2 max-w-sm text-center px-4 leading-relaxed font-sans uppercase transition-colors">
            제주시 대비 서귀포시 자치밀도 격차 연계 SWOT 분석문 구조 체계화 중
          </p>
        </div>
      )}

      {error && !loading && (
        <div className="mt-8 p-5 bg-[#1a0a0d] border border-rose-950/40 rounded-xl flex items-start gap-4 font-sans">
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-rose-300">리포트 연산 에러가 감지되었습니다</h4>
            <p className="text-xs sm:text-sm text-rose-400/80 mt-1 leading-relaxed">
              {error}
            </p>
          </div>
        </div>
      )}

      {analysis && !loading && (
        <div className="mt-8 bg-[var(--subpanel-bg)] rounded-xl border border-[var(--panel-border)] p-6 md:p-8 hover:border-[var(--text-title)]/30 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--panel-border)] pb-4 mb-6 transition-colors">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[var(--text-title)]" />
              <h4 className="text-xs sm:text-sm font-serif text-[var(--app-text)] tracking-wider uppercase font-semibold transition-colors">제주 예술생태계 공식 보고서</h4>
            </div>
            
            {/* 드롭다운 폴딩 컨트롤러 */}
            <div className="flex items-center gap-2 font-sans">
              <span className="text-xs text-[var(--text-muted)] font-medium transition-colors">상세 내용:</span>
              <select
                value={isExpanded ? "expanded" : "collapsed"}
                onChange={(e) => setIsExpanded(e.target.value === "expanded")}
                className="bg-[var(--panel-bg)] border border-[var(--panel-border)] text-xs font-semibold px-3 py-1.5 rounded text-[var(--app-text)] focus:outline-none focus:border-[var(--text-title)]/60 cursor-pointer transition-colors"
                id="report-collapse-dropdown"
              >
                <option value="expanded" className="bg-[var(--panel-bg)] text-[var(--app-text)]">전체 내용 펼쳐보기 ▾</option>
                <option value="collapsed" className="bg-[var(--panel-bg)] text-[var(--app-text)]">내용 접어서 보류하기 ▴</option>
              </select>
            </div>
          </div>

          {isExpanded ? (
            <div className="markdown-body prose select-text max-w-none text-[var(--app-text)] animate-fade-in font-sans">
              <Markdown
                components={{
                  h1: ({ children }) => <h1 className="text-base sm:text-lg font-serif font-bold text-[var(--text-white-invert)] mt-6 mb-3 flex items-center border-l-2 border-[var(--text-title)] pl-3 uppercase tracking-wider transition-colors">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-sm sm:text-base font-serif font-semibold text-[var(--text-title)] mt-5 mb-2.5 uppercase tracking-wide transition-colors">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-xs sm:text-sm font-serif text-[var(--text-white-invert)] mt-4 mb-2 uppercase transition-colors">{children}</h3>,
                  p: ({ children }) => <p className="text-sm sm:text-base text-[var(--app-text)] leading-relaxed mb-4 transition-colors">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-5 mb-4 text-sm sm:text-base text-[var(--text-muted)] space-y-2 transition-colors">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-5 mb-4 text-sm sm:text-base text-[var(--text-muted)] space-y-2 transition-colors">{children}</ol>,
                  li: ({ children }) => <li className="leading-relaxed font-sans text-[var(--app-text)] transition-colors">{children}</li>,
                  blockquote: ({ children }) => <blockquote className="border-l-2 border-[var(--text-title)]/60 bg-[var(--panel-bg)] p-3 rounded-r my-4 text-sm sm:text-base text-[var(--app-text)] italic transition-colors">{children}</blockquote>,
                  strong: ({ children }) => <strong className="text-[var(--text-title)] font-semibold transition-colors">{children}</strong>
                }}
              >
                {analysis}
              </Markdown>
            </div>
          ) : (
            <div className="py-6 text-center text-[var(--text-muted)] text-xs sm:text-sm font-sans transition-colors">
              보고서 본문이 축소되었습니다. 위의 선택 드롭다운을 통해 언제든지 전체 내용을 다시 확인하거나 전개할 수 있습니다.
            </div>
          )}
        </div>
      )}

      {/* 미생성 시 팁 보드 */}
      {!analysis && !loading && !error && (
        <div className="mt-8 p-5 bg-[var(--subpanel-bg)] border border-[var(--panel-border)] rounded-xl flex items-start gap-4 transition-colors">
          <div className="p-2 bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-lg text-[var(--text-title)] flex-shrink-0 transition-colors">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-serif text-[var(--text-white-invert)] tracking-wide uppercase font-semibold transition-colors">AI SWOT 보고서 운영 및 생성 안내</h4>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-2 leading-relaxed font-sans transition-colors">
              사용자가 설정한 가중치(가감 배율)에 발맞춰 두 행정 자치단체의 정량 데이터가 실시간 구조체화됩니다. 생성 단추를 누르면, 인프라 격출 분포와 문화 향양 잠재력을 결합한 입체전 보고 장르를 구성하여 즉각 마크다운으로 환류합니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
