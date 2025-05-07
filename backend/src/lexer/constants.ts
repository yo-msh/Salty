export const KEYWORDS = [
  "print",
  "if",
  "else",
  "while",
  "return",
  "break",
  "continue",
  "let",
  "fn",
  "return",
  "true",
  "false",
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
  "[",
  "]",
  ".",
];

export const MULTI_CHAR_SYMBOLS = ["==", "!=", ">=", "<=", "&&", "||"];

export type TokenType = "identifier" | "number" | "keyword" | "symbol";

export interface Token {
  type: TokenType;
  value: string;
}
