import { QuoteBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { BlockObjectChild } from "@/@types/schema.notion";
// components
import NotionRichText from "./notionRichText";

interface Prop {
  item: QuoteBlockObjectResponse & BlockObjectChild;
}

const NotionQuote = ({ item }: Prop) => {
  return (
    <div className="flex">
      <div className="border-l-2 border-l-white pr-5 ml-5"></div>
      <NotionRichText
        as={"blockquote"}
        rich_text={item.quote.rich_text}
        color={item.quote.color}
        className="text-lg"
      />
    </div>
  );
};

export default NotionQuote;
