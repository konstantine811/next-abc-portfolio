"use client";

import { QuoteBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { BlockObjectChild } from "@/@types/schema.notion";
// components
import NotionRichText from "./notionRichText";
import NotionParseItem from "./notionNumberList";
import NotionSwitchParse from "./notionSwitchParse";

interface Prop {
  item: QuoteBlockObjectResponse & BlockObjectChild;
}

const NotionQuote = ({ item }: Prop) => {
  return (
    <div className="flex">
      <div className="border-l-2 border-l-white pr-5 ml-5"></div>
      <div>
        <NotionRichText
          as={"blockquote"}
          rich_text={item.quote.rich_text}
          color={item.quote.color}
          className="text-lg"
        />
        {item.children && (
          <NotionSwitchParse level={2} post={item.children as any} />
        )}
      </div>
    </div>
  );
};

export default NotionQuote;
