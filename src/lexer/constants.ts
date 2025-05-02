export const KEYWORDS = ["print", "if", "else", "while", "let", "return"];

export const SYMBOLS = ["+", "-", "*", "/", "=", ";", "(", ")", "{", "}"];

export type TokenType = "identifier" | "number" | "keyword" | "symbol";

export interface Token {
  type: TokenType;
  value: string;
}
