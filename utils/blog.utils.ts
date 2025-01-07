import { BlogPost } from "@/@types/schema.notion";
import { PATH_ROUTE_NAME } from "@/configs/navigation";

const normalizeToCompact = (uuid: string) => uuid.replace(/-/g, "");
export function getPathName(id: string) {
  return `${PATH_ROUTE_NAME.blog}/${normalizeToCompact(id)}`;
}

export function orderBlogPost(items: BlogPost[]) {
  return [...items]?.sort((a, b) => a.order - b.order);
}
