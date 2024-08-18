import { CSSProperties } from "react";

export const customDarkTheme: { [key: string]: CSSProperties } = {
  'code[class*="language-"]': {
    color: "#fff",
    background: "none",
    fontFamily: '"Fira Code", "Fira Mono", monospace',
    textAlign: "left",
    whiteSpace: "pre",
    wordSpacing: "normal",
    wordBreak: "normal",
    wordWrap: "normal",
    lineHeight: "1.5",
    tabSize: "4",
    hyphens: "none",
  },
  'pre[class*="language-"]': {
    color: "#fff",
    background: "#1e1e1e",
    fontFamily: '"Fira Code", "Fira Mono", monospace',
    textAlign: "left",
    whiteSpace: "pre",
    wordSpacing: "normal",
    wordBreak: "normal",
    wordWrap: "normal",
    lineHeight: "1.5",
    tabSize: "4",
    hyphens: "none",
    padding: "1em",
    margin: ".5em 0",
    overflow: "auto",
    borderRadius: "4px",
  },
  comment: { color: "rgba(255, 255, 255, 0.533)", opacity: 0.3 },
  punctuation: { color: "rgba(255, 255, 255, 1)" },
  property: { color: "rgba(255, 255, 255, 1)" },
  tag: { color: "rgba(255, 255, 255, 0.533)" },
  boolean: { color: "rgba(255, 255, 255, 0.533)" },
  number: { color: "rgba(255, 255, 255, 0.533)" },
  "function-name": { color: "rgba(255, 255, 255, 1)" },
  "class-name": { color: "rgba(255, 255, 255, 0.533)" },
  constant: { color: "rgba(255, 255, 255, 1)" },
  symbol: { color: "rgba(255, 255, 255, 0.533)" },
  selector: { color: "rgba(255, 255, 255, 0.533)" },
  "attr-name": { color: "rgba(255, 255, 255, 0.533)" },
  string: { color: "rgba(255, 255, 255, 0.533)" },
  char: { color: "rgba(255, 255, 255, 1)" },
  builtin: { color: "#ce9178" },
  operator: { color: "rgba(255, 255, 255, 0.533)" },
  entity: { color: "rgba(255, 255, 255, 1)", cursor: "help" },
  url: { color: "rgba(255, 255, 255, 0.533)" },
  variable: { color: "rgba(255, 255, 255, 1)" },
  function: { color: "rgba(255, 255, 255, 1)" },
  regex: { color: "rgba(255, 255, 255, 0.533)" },
  important: { color: "rgba(255, 255, 255, 0.533)", fontWeight: "bold" },
  italic: { fontStyle: "italic" },
  bold: { fontWeight: "bold" },
  import: { color: "rgba(255, 255, 255, 0.533)" },
  keyword: { color: "rgba(255, 255, 255, 0.533)" },
};

export const customLightTheme: { [key: string]: CSSProperties } = {
  'code[class*="language-"]': {
    color: "#2d2d2d",
    textShadow: "0 1px rgba(255, 255, 255, 0.3)",
    fontFamily: "monospace",
    direction: "ltr",
    textAlign: "left",
    whiteSpace: "pre",
    wordSpacing: "normal",
    wordBreak: "normal",
    lineHeight: "1.5",
    MozTabSize: "4",
    OTabSize: "4",
    tabSize: "4",
    WebkitHyphens: "none",
    MozHyphens: "none",
    msHyphens: "none",
    hyphens: "none",
    fontSize: "18px",
  },
  'pre[class*="language-"]': {
    color: "#2d2d2d",
    textShadow: "0 1px rgba(255, 255, 255, 0.3)",
    fontFamily:
      "Inconsolata, Monaco, Consolas, 'Courier New', Courier, monospace",
    direction: "ltr",
    textAlign: "left",
    whiteSpace: "pre",
    wordSpacing: "normal",
    wordBreak: "normal",
    lineHeight: "1.5",
    MozTabSize: "4",
    OTabSize: "4",
    tabSize: "4",
    WebkitHyphens: "none",
    MozHyphens: "none",
    msHyphens: "none",
    hyphens: "none",
    padding: "1em",
    margin: ".5em 0",
    overflow: "auto",
    borderRadius: "0.3em",
    background: "#f5f5f5",
  },
  ':not(pre) > code[class*="language-"]': {
    background: "#f5f5f5",
    padding: ".1em",
    borderRadius: ".3em",
  },
  'const[class*="language-"]': {
    color: "#ff0000",
  },
  comment: {
    color: "#888888",
  },
  prolog: {
    color: "#888888",
  },
  doctype: {
    color: "#888888",
  },
  cdata: {
    color: "#888888",
  },
  punctuation: {
    color: "#2d2d2d",
  },
  ".namespace": {
    opacity: ".7",
  },
  property: {
    color: "#005cc5",
  },
  keyword: {
    color: "#005cc5",
  },
  tag: {
    color: "#005cc5",
  },
  "class-name": {
    color: "#d73a49",
    textDecoration: "underline",
  },
  boolean: {
    color: "#005cc5",
  },
  constant: {
    color: "#005cc5",
  },
  symbol: {
    color: "#e36209",
  },
  deleted: {
    color: "#e36209",
  },
  number: {
    color: "#6f42c1",
  },
  selector: {
    color: "#22863a",
  },
  "attr-name": {
    color: "#22863a",
  },
  string: {
    color: "#032f62",
  },
  char: {
    color: "#032f62",
  },
  builtin: {
    color: "#032f62",
  },
  inserted: {
    color: "#032f62",
  },
  variable: {
    color: "#e36209",
  },
  operator: {
    color: "#d73a49",
  },
  entity: {
    color: "#d73a49",
    cursor: "help",
  },
  url: {
    color: "#032f62",
  },
  ".language-css .token.string": {
    color: "#032f62",
  },
  ".style .token.string": {
    color: "#032f62",
  },
  atrule: {
    color: "#d73a49",
  },
  "attr-value": {
    color: "#d73a49",
  },
  function: {
    color: "#6f42c1",
  },
  regex: {
    color: "#032f62",
  },
  important: {
    color: "#d73a49",
    fontWeight: "bold",
  },
  bold: {
    fontWeight: "bold",
  },
  italic: {
    fontStyle: "italic",
  },
};
