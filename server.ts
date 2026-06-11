import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini Client
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }

  // API Endpoint: Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", serverTime: new Date().toISOString() });
  });

  // API Endpoint: Dynamic AI Analysis of Jeju Art Ecosystem
  app.post("/api/analyze", async (req, res) => {
    try {
      const {
        weights,
        jejuSiScore,
        seogwipoSiScore,
        jejuSiPerCapita,
        seogwipoSiPerCapita,
        datasetSummary
      } = req.body;

      if (!ai) {
        return res.status(403).json({
          error: "GEMINI_API_KEY가 설정되지 않았습니다. AI 분석을 위해 Settings 메뉴에서 API 키를 설정해주세요."
        });
      }

      const prompt = `
당신은 제주특별자치도 문화예술 정책 및 도정 연구원입니다. 아래 정량 데이터를 바탕으로 제주시와 서귀포시 간의 '제주 문화예술 예술생태계 지수'를 심층 분석하고, 실질적인 지역 예술 불균형 극복 방안을 SWOT 및 정책 제안 형태로 꼼꼼히 한국어로 작성하라.

--- 입력 데이터 현황 ---
- 설정된 평가지표 가중치:
  * 문화예술 법인 수 가중치: ${weights.corpWeight}x
  * 예술단체 수 가중치: ${weights.groupWeight}x
  * 공연장 수 가중치: ${weights.venueWeight}x
  * 갤러리/예술마을 수 가중치: ${weights.galleryWeight}x

- 가중치 적용 예술생태계 지수 (정량 평가 점수):
  * 제주시 총점: ${jejuSiScore}점
  * 서귀포시 총점: ${seogwipoSiScore}점
  * 격차 (제주시 대비 서귀포시 비율): ${((seogwipoSiScore / (jejuSiScore || 1)) * 100).toFixed(1)}%

- 인구 1만명당 예술생태계 지수 (밀도 평가 점수 - 제주시 약 49.5만명, 서귀포시 약 19.1만명):
  * 제주시 인구 대비 지수: ${jejuSiPerCapita}점/만 명
  * 서귀포시 인구 대비 지수: ${seogwipoSiPerCapita}점/만 명
  * 대비 비율: 서귀포시가 제주시의 ${((seogwipoSiPerCapita / (jejuSiPerCapita || 1)) * 100).toFixed(1)}% 수준

--- 응답 형식 가이드 ---
다음 세션들로 구성된 마크다운 결과물로 반환해주세요:

1. 📊 **정량 지표 평가 및 격차 요약**: 단순 총량과 인구 대비 밀도 점수가 의미하는 상반된 현상을 다루며, 서귀포시가 총량에서는 뒤쳐지나 밀도 면에서 가지는 이점을 분석합니다.
2. ⚔️ **지역 예술 생태계 SWOT 분석**:
   - **강점(Strength)** & **약점(Weakness)** (제주시와 서귀포시 각각의 특장점 분석)
   - **기회(Opportunity)** & **위협(Threat)** (제조업 부재, 풍부한 자연환경, 관광객 유입과 인구 불균형 요인)
3. 💡 **예술 불균형 극복을 위한 3대 정책 권고안**: 지리적 격차를 혁신하기 위해 어떠한 지원이 실무적으로 조치되어야 하는지에 대한 전문적이고 구체적인 제안.

정형화된 가식적 조언 대신 도정 보고서에 들어갈 수 있는 수준의 품격 있고 예리한 전문적 문체로 진술해주세요.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
      });

      return res.json({
        analysis: response.text || "분석 결과를 생성하지 못했습니다."
      });
    } catch (e: any) {
      console.error(e);
      return res.status(500).json({
        error: `AI 분석 연산에 실패했습니다: ${e.message || e}`
      });
    }
  });

  // Serve static UI / assets
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[FULL-STACK] Server successfully running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server", err);
});
