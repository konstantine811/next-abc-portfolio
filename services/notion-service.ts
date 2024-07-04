import {
  BLogPostPage,
  BlockObjectChildResponse,
  BlogPost,
  BlogPostEntity,
} from "@/@types/schema.notion";
import { LocaleType } from "@/configs/locale";
import { Client } from "@notionhq/client";
import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export default class NotionService {
  client: Client;
  constructor() {
    this.client = new Client({
      auth: process.env.NOTION_ACCESS_TOKEN,
    });
  }

  async getPublishedBlogPosts(lang: LocaleType): Promise<BlogPostEntity> {
    const database =
      process.env[`DATA_BLOG_BASE_ID_${lang.toUpperCase()}`] ?? "";
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

      return this.groupPostsByCategory(response.results);
    } catch (e) {
      console.error(e);
      return {};
    }
  }

  async fetcher(url: string, method = "GET") {
    return fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${process.env.NOTION_ACCESS_TOKEN}`,
      },
    });
  }

  async getSingleBlogPost(id: string): Promise<BLogPostPage | null> {
    try {
      const page = await this.client.pages.retrieve({
        page_id: id,
      });
      const post = await this.client.blocks.children.list({
        block_id: id,
      });
      const results = (
        await this.getNestedItems(post.results as BlockObjectResponse[])
      ).filter((i) => i) as BlockObjectChildResponse[];
      if (results) {
        return { post: results, page: this.pageToPostTransformer(page) };
      }
      return null;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  private groupPostsByCategory(pages: any[]): BlogPostEntity {
    return pages.reduce((acc: any, page: any) => {
      const post = this.pageToPostTransformer(page);
      const name = post.category.name;
      if (!acc[name]) {
        acc[name] = [];
      }
      acc[name].push(post);
      return acc;
    }, {} as Record<string, BlogPost[]>);
  }

  private getNestedItems(
    results: BlockObjectResponse[]
  ): Promise<(BlockObjectChildResponse | undefined)[]> {
    return Promise.all(
      results?.map(async (i) => {
        if (i.has_children) {
          const children = await this.client.blocks.children.list({
            block_id: i.id,
          });
          const results = (
            await this.getNestedItems(children.results as BlockObjectResponse[])
          ).filter((i) => i) as BlockObjectChildResponse[];
          return {
            ...i,
            children: results,
          } as any;
        }
        return i;
      })
    );
  }

  private pageToPostTransformer(page: any): BlogPost {
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
      langId: page.properties.lang.id,
    };
  }
}
