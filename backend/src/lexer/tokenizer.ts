// This module defines the tokenizer for the language.
// It takes a string input and converts it into an array of tokens.
// Each token has a type and a value.

import {
  KEYWORDS,
  SYMBOLS,
  MULTI_CHAR_SYMBOLS,
  Token,
  TokenType,
} from "./constants";

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let cursor = 0;

  const isLetter = (ch: string) => /[a-z]/i.test(ch);
  const isDigit = (ch: string) => /[0-9]/.test(ch);

  while (cursor < input.length) {
    const char = input[cursor];

    // Skip whitespace
    if (/\s/.test(char)) {
      cursor++;
      continue;
    }

    // Skip comments
    if (char === "/" && input[cursor + 1] === "/") {
      // Skip until end of line
      while (cursor < input.length && input[cursor] !== "\n") {
        cursor++;
      }
      continue;
    }

    // Multi-character symbols
    const twoChar = input.slice(cursor, cursor + 2);
    if (MULTI_CHAR_SYMBOLS.includes(twoChar)) {
      tokens.push({ type: "symbol", value: twoChar });
      cursor += 2;
      continue;
    }

    // Single-character symbols
    if (SYMBOLS.includes(char)) {
      tokens.push({ type: "symbol", value: char });
      cursor++;
      continue;
    }

    // Identifiers / Keywords
    if (isLetter(char) || char === "_") {
      let word = "";
      while (cursor < input.length && /[a-zA-Z0-9_]/.test(input[cursor])) {
        word += input[cursor++];
      }
    
      const type: TokenType = KEYWORDS.includes(word)
        ? "keyword"
        : "identifier";
      tokens.push({ type, value: word });
      continue;
    }
    

    // Numbers (int or float)
    if (isDigit(char)) {
      let number = "";
      while (
        cursor < input.length &&
        (isDigit(input[cursor]) || input[cursor] === ".")
      ) {
        number += input[cursor++];
      }

      if (number.split(".").length > 2) {
        throw new Error(`Invalid number format: ${number}`);
      }

      tokens.push({ type: "number", value: number });
      continue;
    }

    throw new Error(`Unexpected character: ${char}`);
  }

  return tokens;
}
