"use client";

import { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import NotionLink from "./notionLink";

interface Prop {
  data: RichTextItemResponse;
}

const NotionText = ({ data }: Prop) => {
  return (
    <>
      {data.href ? <NotionLink data={data} /> : <span>{data.plain_text}</span>}
    </>
  );
};

export default NotionText;
