import { memo, useCallback, useEffect } from "react";
import { CodeBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
// types
import { BlockObjectChild } from "@/@types/schema.notion";
import { Badge } from "@/components/ui/badge";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

import NoiseGrid from "@/components/page-partials/common/noise-grid";
import SyntaxHighlighter from "react-syntax-highlighter";
import dark from "react-syntax-highlighter/dist/esm/styles/hljs/atom-one-dark";

interface Prop {
  item: CodeBlockObjectResponse & BlockObjectChild;
  onCopy: () => void;
  isCopied: boolean;
}

const NotionCode = ({ item, onCopy, isCopied }: Prop) => {
  const codeString = item.code.rich_text
    .map((item) => item.plain_text)
    .join("");

  useEffect(() => {
    console.log("is copied", isCopied);
  }, [isCopied]);

  // UseCallback to memoize the copy logic
  const copyToClipboard = useCallback(() => {
    navigator.clipboard
      .writeText(codeString)
      .then(() => {
        onCopy();
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  }, [codeString, onCopy]);

  return (
    <NoiseGrid opacity={0.133333}>
      <div className="w-full border overflow-hidden relative">
        <div className="relative h-4">
          <Badge
            className="absolute shadow-gray-600 shadow-sm"
            variant="outline"
          >
            {item.code.language}
          </Badge>
        </div>
        <div className="code-highlighter p-8">
          <SyntaxHighlighter lang={item.code.language} style={dark}>
            {codeString}
          </SyntaxHighlighter>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={copyToClipboard}
          type="button"
          className="absolute right-2 cursor-pointer top-8 h-auto w-7 px-2"
        >
          {isCopied ? <Check /> : <Copy />}
        </Button>
      </div>
    </NoiseGrid>
  );
};

export default NotionCode;
