import { CSSProperties, useEffect, useState } from "react";
import { CodeBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/default-highlight";
// types
import { BlockObjectChild } from "@/@types/schema.notion";
import { THEME_TYPES } from "@/@types/theme";
import { useTheme } from "next-themes";
import {
  atomOneDark,
  atomOneLight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Badge } from "@/components/ui/badge";

interface Prop {
  item: CodeBlockObjectResponse & BlockObjectChild;
}

const NotionCode = ({ item }: Prop) => {
  const { theme } = useTheme();
  const [codeTheme, setCodeTheme] = useState<{
    [key: string]: CSSProperties;
  }>();
  useEffect(() => {
    switch (theme) {
      case THEME_TYPES.light:
        setCodeTheme(atomOneLight);
        break;
      case THEME_TYPES.dark:
        setCodeTheme(atomOneDark);
        break;
      default:
        setCodeTheme(atomOneDark);
        break;
    }
  }, [theme]);
  return (
    <div className="rounded-sm overflow-hidden ">
      <div className="relative h-4">
        <Badge className="absolute shadow-gray-600 shadow-sm" variant="outline">
          {item.code.language}
        </Badge>
      </div>

      <SyntaxHighlighter language={item.code.language} style={codeTheme}>
        {item.code.rich_text.map((item) => item.plain_text)}
      </SyntaxHighlighter>
    </div>
  );
};

export default NotionCode;
