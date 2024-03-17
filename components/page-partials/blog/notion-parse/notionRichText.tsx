import { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import TextWrapper from "@/components/wrapper/text-wrapper";
import { ElementType } from "react";

interface NotionRichTextProps {
  rich_text: RichTextItemResponse[];
  color: string;
  as: ElementType;
}

const NotionRichText = ({ rich_text, color, as }: NotionRichTextProps) => {
  return (
    <TextWrapper as={as}>
      {rich_text.map((item, index) => {
        return <span key={index}>{item.plain_text}</span>;
      })}
    </TextWrapper>
  );
};

export default NotionRichText;
