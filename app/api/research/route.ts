import { NextResponse } from "next/server";
import { z } from "zod";
import { readUrls } from "../../../lib/reader-agent";
import { analyzeReaders } from "../../../lib/analysis-agent";

const schema = z.object({ query: z.string().trim().min(3).max(500) });
type TavilyResult = { title?: string; url: string; content?: string };
export async function POST(req: Request) {
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success)
      return NextResponse.json(
        { error: "Enter a research question (3–500 characters)." },
        { status: 400 },
      );
    if (!process.env.TAVILY_API_KEY)
      return NextResponse.json(
        {
          error:
            "TAVILY_API_KEY is not configured. Copy .env.example to .env.local and add a Tavily key to enable live research.",
        },
        { status: 503 },
      );
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query: parsed.data.query,
        search_depth: "advanced",
        include_answer: false,
        max_results: 8,
      }),
      cache: "no-store",
    });
    if (!response.ok)
      throw new Error(`Search provider returned ${response.status}.`);
    const data = (await response.json()) as { results?: TavilyResult[] };
    const results = (data.results || []).map((r) => ({
        title: r.title || r.url,
        url: r.url,
        content: r.content || "No extract available.",
      }));
    const reader = await readUrls(results.map((r) => r.url));
    return NextResponse.json({ results, reader, analysis: analyzeReaders(reader) });
  } catch (e) {
    return NextResponse.json(
      {
        error: e instanceof Error ? e.message : "Unable to complete research.",
      },
      { status: 500 },
    );
  }
}
