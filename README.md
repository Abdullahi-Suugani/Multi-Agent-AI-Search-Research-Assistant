# Scout — Multi-Agent AI Research Assistant

# Multi-Agent-AI-Search-Research-Assistant

Phase 3 implementation: a Next.js/TypeScript workspace with Tavily Search, Reader, and deterministic Analysis Agents. The Reader deduplicates URLs, fetches HTML, falls back to Playwright for rendered pages, extracts explicit metadata/JSON-LD/text, and returns Zod-validated structured data. The Analysis Agent compares verified reader data, parses explicit prices, removes duplicate products, and reports limitations. Missing values are always `unknown`.

## Run locally

```bash
npm install
Copy-Item .env.example .env.local
# add TAVILY_API_KEY to .env.local
npm run dev
```

Install the Playwright browser once with `npx playwright install chromium`. Keep API keys server-side.

Open http://localhost:3000. `OPENAI_API_KEY` is reserved for the analysis/recommendation phases. API keys are never sent to the browser.

## Architecture roadmap

The API boundary is intentionally small so the Search Agent can be replaced by a durable Router → Search → Reader → Analysis → Recommendation workflow. Next phases should add Prisma/PostgreSQL persistence, Playwright reading with robots.txt checks, structured LLM outputs, retries/rate limits, and Inngest background execution. The current UI reports only request-level activity and does not fabricate counts.
