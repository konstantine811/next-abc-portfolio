import { BlogPost } from "@/@types/schema.notion";
import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

export default class NotionService {
  client: Client;
  n2m: NotionToMarkdown;
  constructor() {
    this.client = new Client({ auth: process.env.NOTION_ACCESS_TOKEN });
    this.n2m = new NotionToMarkdown({ notionClient: this.client });
  }

  async getPublishedBlogPosts() {
    const database = process.env.DATA_BASE_ID ?? "";
    // list blog posts
    try {
      const response = await this.client.databases.query({
        database_id: database,
        filter: {
          property: "IsPublished",
          checkbox: {
            equals: true,
          },
        },
      });
      return response.results.map((res) => {
        return NotionService.pageToPostTransformer(res);
      });
    } catch (e) {
      console.log("error", e);
      return [];
    }
  }

  private static pageToPostTransformer(page: any): BlogPost {
    console.log(page);
    let cover = page.cover;
    switch (cover?.type) {
      case "flie":
        cover = page.cover.file;
        break;
      case "external":
        cover = page.cover.external.url;
        break;
      default:
        cover = "";
    }
    return {
      id: page.id,
      cover,
      title: page.properties.Name.title[0].plain_text,
      category: page.properties.Category.select,
    };
  }
}
