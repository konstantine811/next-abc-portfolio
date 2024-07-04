import { BlockObjectChild } from "@/@types/schema.notion";
import { NumberedListItemBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import NotionRichText from "./notionRichText";

interface Props {
  items: (NumberedListItemBlockObjectResponse & BlockObjectChild)[];
}

const NotionParseItem = ({ items }: Props) => {
  return (
    <ol className="list-decimal pl-8 py-4">
      {items.map((item, index) => {
        return (
          <li key={index} className="py-1">
            <NotionRichText
              key={item.id}
              as={"span"}
              rich_text={item.numbered_list_item.rich_text}
              color={item.numbered_list_item.color}
            />
          </li>
        );
      })}
    </ol>
  );
};

export default NotionParseItem;
