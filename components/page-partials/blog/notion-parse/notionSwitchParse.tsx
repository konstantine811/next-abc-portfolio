import {
  BlockObjectResponse,
  BulletedListItemBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
// compoents
import NotionBulletListItem from "./notionBulletListItem";
import { BlockObjectChildResponse } from "@/@types/schema.notion";

interface Prop {
  post: BlockObjectChildResponse[];
  level?: number;
}

const NotionSwitchParse = ({ post, level }: Prop) => {
  return (
    <>
      {post?.map((item: BlockObjectChildResponse) => {
        switch (item.type) {
          case "bulleted_list_item":
            return (
              <NotionBulletListItem key={item.id} level={level} data={item} />
            );
        }
      })}
    </>
  );
};

export default NotionSwitchParse;
