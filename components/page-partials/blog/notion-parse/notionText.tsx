"use client";

import { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import NotionLink from "./notionLink";

interface Prop {
  data: RichTextItemResponse;
}

const NotionText = ({ data }: Prop) => {
  return (
    <>{data.href ? <NotionLink data={data} /> : <p>{data.plain_text}</p>}</>
  );
};

export default NotionText;
