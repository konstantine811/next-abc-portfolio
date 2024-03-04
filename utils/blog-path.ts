import { PATH_ROUTE_NAME } from "@/configs/navigation";

export function getPathName(id: number) {
  return `${PATH_ROUTE_NAME.blog}/${id}`;
}
