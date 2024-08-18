import { CSSProperties, useEffect, useState } from "react";
import { CodeBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// types
import { BlockObjectChild } from "@/@types/schema.notion";
import { THEME_TYPES } from "@/@types/theme";
import { useTheme } from "next-themes";
import { Badge } from "@/components/ui/badge";
import {
  customDarkTheme,
  customLightTheme,
} from "@/configs/code-highlight-theme";
import { useToast } from "@/components/ui/use-toast";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Prop {
  item: CodeBlockObjectResponse & BlockObjectChild;
}

const NotionCode = ({ item }: Prop) => {
  const { toast } = useToast();
  const codeString = item.code.rich_text
    .map((item) => item.plain_text)
    .join("");
  const { theme } = useTheme();
  const [codeTheme, setCodeTheme] = useState<{
    [key: string]: CSSProperties;
  }>();
  useEffect(() => {
    switch (theme) {
      case THEME_TYPES.light:
        setCodeTheme(customLightTheme);
        break;
      case THEME_TYPES.dark:
        setCodeTheme(customDarkTheme);
        break;
      default:
        setCodeTheme(customDarkTheme);
        break;
    }
  }, [theme]);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(codeString)
      .then(() => {
        console.log("on save");
        toast({
          title: "Code copied to clipboard!p",
        });
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div className="rounded-xl border overflow-hidden relative">
      <div className="relative h-4">
        <Badge className="absolute shadow-gray-600 shadow-sm" variant="outline">
          {item.code.language}
        </Badge>
      </div>

      <SyntaxHighlighter
        language={item.code.language}
        style={codeTheme}
        showLineNumbers
        showInlineLineNumbers
      >
        {codeString}
      </SyntaxHighlighter>
      <Button
        variant="ghost"
        size="icon"
        onClick={copyToClipboard}
        className="absolute right-2 cursor-pointer top-8 h-auto w-7 px-2"
      >
        <Copy />
      </Button>
    </div>
  );
};

export default NotionCode;
