export const KEYWORDS = [
  "print",
  "if",
  "else",
  "while",
  "let",
  "return",
  "break",
  "continue",
  "let",
  "fn",
  "return",
];

export const SYMBOLS = [
  "+",
  "-",
  "*",
  "/",
  "=",
  ";",
  "(",
  ")",
  "{",
  "}",
  ">",
  "<",
  "!",
  ",",
];

export const MULTI_CHAR_SYMBOLS = ["==", "!=", ">=", "<="];

export type TokenType = "identifier" | "number" | "keyword" | "symbol";

export interface Token {
  type: TokenType;
  value: string;
}
