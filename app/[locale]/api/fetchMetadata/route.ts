import axios from "axios";
import { load } from "cheerio";

export async function GET(req: Request, params: any) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams).get("url");

  if (!searchParams || typeof searchParams !== "string") {
    return new Response(JSON.stringify({ error: "URL is required" }), {
      status: 400,
    });
  }
  try {
    const { data: html } = await axios.get(searchParams);
    const $ = load(html);

    // Extract metadata
    const title =
      $('meta[property="og:title"]').attr("content") || $("title").text();
    const description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content");
    const image = $('meta[property="og:image"]').attr("content");
    const url = $('meta[property="og:url"]').attr("content") || searchParams;

    const metadata = { title, description, image, url };

    return new Response(JSON.stringify(metadata), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch metadata" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
